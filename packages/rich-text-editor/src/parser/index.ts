import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { parseDocument as $parseDocument, Parser as $Parser } from 'htmlparser2';
import { LexicalEditor } from 'lexical/LexicalEditor';
import { LexicalNode } from 'lexical/LexicalNode';
import { GridSelection, NodeSelection, RangeSelection } from 'lexical/LexicalSelection';

import { Document, Element, isTag, isText, Text } from 'domhandler';
import camelCase from 'lodash/camelCase';
import fromPairs from 'lodash/fromPairs';
import mapValues from 'lodash/mapValues';
import pick from 'lodash/pick';
import { Fragment, ReactElement } from 'react';
import { WhiteAttribute, ZHTAGTYPE } from '../config/ParserConstant';
import { CreateElement } from './CreateElement';
import {
  doStrategy,
  ReactComponentMappingKeyType,
  ReactComponentMappingType,
} from './ReactComponentMappings';

export * from './ReactComponentMappings';

export interface EditorParserInitPropsType {
  reactNodeMapping?: ReactComponentMappingType;
}

export class EditorParser {
  private __htmlparser: $Parser | undefined;

  // react dom 唯一 key
  private __keyIndex: number = 0;

  // react components 自定义组件映射关系
  private __reactComponentMapping: ReactComponentMappingType = {};

  private static __instance: EditorParser;

  public static getInstance() {
    if (!this.__instance) {
      this.__instance = new EditorParser();

      this.__instance.__init();
    }

    return this.__instance;
  }

  // 单例初始化
  private __init(params?: EditorParserInitPropsType) {
    this.__parser();

    params && this.updateProps(params);
  }

  // 更新解析器 props
  public updateProps(params: EditorParserInitPropsType) {
    if (params?.reactNodeMapping) {
      this.__reactComponentMapping = Object.assign(
        {},
        this.__reactComponentMapping,
        params.reactNodeMapping,
      );
    }
  }

  // htmlparser2 单例
  private __parser() {
    if (this.__htmlparser) {
      return this.__htmlparser;
    }

    this.__htmlparser = new $Parser({});
    return this.__htmlparser;
  }

  public getHtmlParser() {
    if (this.__htmlparser) {
      return this.__htmlparser;
    }

    return undefined;
  }

  // 富文本格式化
  private __format(doms: Element[]) {
    if (!doms?.length) {
      return [];
    }

    const childrend: Element[] = [];

    doms.forEach(dom => {
      switch (dom.type) {
        case 'tag':
          // 递归
          if (dom?.children?.length) {
            dom.children = this.__format(dom?.children as Element[]);

            childrend.push(dom);
          } else {
            childrend.push(dom);
          }
          break;
        default:
          childrend.push(dom);
      }
    });

    return childrend;
  }

  // text 类解析转换 react dom
  private __parserText(child: Text): ReactElement {
    const props = {
      key: `text-${this.__keyIndex}`,
    };

    return CreateElement(Fragment, props, child.data);
  }

  // style 属性格式化
  private __attributeFormatStyle(styleString: string) {
    if (!styleString) {
      return {};
    }

    return fromPairs(
      styleString.split(';').map(attr => {
        const [key, value] = attr.split(':');

        return [camelCase(key), value];
      }),
    );
  }

  // 属性格式化
  private __attributeFormat(attribute: Record<string, string>): Record<string, string> {
    const attributeFormated = pick(attribute, WhiteAttribute);

    return mapValues(attributeFormated, (value, key) => {
      switch (key) {
        case 'style':
          return this.__attributeFormatStyle(value);
        default:
          return value;
      }
    }) as Record<keyof typeof WhiteAttribute, string>;
  }

  // tag 类解析转换 react dom
  private __parserTag(child: Element): ReactElement {
    try {
      const attribute = this.__attributeFormat(child.attribs);

      const reactComponent = doStrategy(child, attribute[ZHTAGTYPE], this.__reactComponentMapping);

      const key = reactComponent
        ? `tag-${reactComponent.name}-${this.__keyIndex}`
        : `tag-${child.name}-${this.__keyIndex}`;

      const props = {
        key,
        id: key,
        ...attribute,
      };

      return CreateElement(
        reactComponent ?? child.name,
        props,
        this.__recursionHtml(child.children as Element[], []),
      );
    } catch (error) {
      // TODO 容错页面
      return CreateElement('span', {
        key: 'catch',
      });
    }
  }

  // 递归 html dom 返回 react dom
  private __recursionHtml(children: Element[], elements: unknown[]): ReactElement[] {
    const __elements = [...elements] as ReactElement[];

    children.forEach((child: Element) => {
      this.__keyIndex += 1;

      if (isText(child)) {
        __elements.push(this.__parserText(child));
      } else if (isTag(child)) {
        // 递归
        __elements.push(this.__parserTag(child));
      }
    });

    return __elements;
  }

  // htmlstring 写入
  public write(htmlString: string) {
    if (!this.__htmlparser) {
      return;
    }

    this.__htmlparser.write(htmlString);
    this.__htmlparser.end();
  }

  // 获取所有 Mapping ReactNode 或指定 Mapping ReactNode
  public getReactNodeMapping(
    htmlString: string,
    key?: ReactComponentMappingKeyType,
  ): ReactElement[] {
    if (!htmlString) {
      return [];
    }

    let reactDoms: ReactElement[] = this.__reactDoms;

    if (this.__htmlString !== htmlString) {
      reactDoms = this.getReactDomFromHTMLString(htmlString);
    }

    if (key) {
      return reactDoms.filter(reactDom => reactDom?.props?.name && reactDom.props.name === key);
    }

    return reactDoms;
  }

  // 通过 htmlstring 获取 react dom
  private __htmlString: string = '';
  private __reactDoms: ReactElement[] = [];
  public getReactDomFromHTMLString(htmlString: string): ReactElement[] {
    const doms = this.parserHTMLStringToDocumentTree(htmlString);

    if (!doms?.children?.length) {
      // eslint-disable-next-line edu-lint/no-console
      console.warn('doms children length is empty');

      return [];
    }

    const children = this.__format(doms?.children as Element[]);

    const reactDoms = this.__recursionHtml(children, []);

    this.__htmlString = htmlString;

    this.__reactDoms = reactDoms;

    return reactDoms;
  }

  // 解析 htmlstring to document tree
  public parserHTMLStringToDocumentTree(htmlString: string): Document {
    return $parseDocument(htmlString);
  }

  // 解析 htmlstring to lexical dom
  public parserHTMLStringToLexicalDomTree(
    editor: LexicalEditor,
    htmlString: string,
  ): LexicalNode[] {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');

    return $generateNodesFromDOM(editor, doc);
  }

  // 解析 lexical dom to htmlstring
  public parserLexicalDomTreeToHTMLString(
    editor: LexicalEditor,
    selection?: RangeSelection | NodeSelection | GridSelection | null | undefined,
  ): string {
    return $generateHtmlFromNodes(editor, selection);
  }
}
