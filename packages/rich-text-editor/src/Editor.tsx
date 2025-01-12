import './styles/htmlVariables.less';
import './styles/editor.less';
import '@rc-component/color-picker/assets/index.css';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import React, { forwardRef } from 'react';
import { EditorContainer } from './Container';

import EditorTheme from './themes/EditorTheme';

import {
  $createParagraphNode,
  $getRoot,
  $insertNodes,
  $isElementNode,
  LexicalEditor,
} from 'lexical';
import { PluginsType } from './config/PluginsConfig';
import { EditorContextPrivider } from './context/EditorContext';
import { ListenerType } from './EditorReducer';
import { EditorRefProxyContainer, EditorRefProxyContainerType } from './EditorRef';
import { enableNodes } from './nodes';
import { EditorParser } from './parser';
import { addClassName } from './utils/className';

export interface EditorConfigType {
  editable?: boolean;
  plugins?: PluginsType;
}

export interface EditorPropsType {
  richText?: string;
  style?: React.CSSProperties;
  onChange?: ListenerType;
  config?: EditorConfigType;
  plugins?: EditorPluginConfig[];
}

function prepopulatedRichText(editor: LexicalEditor, htmlString: string) {
  const newNodes = EditorParser.getInstance().parserHTMLStringToLexicalDomTree(editor, htmlString);

  const elements = newNodes.map(node => {
    if ($isElementNode(node)) {
      return node;
    }

    const paragraph = $createParagraphNode();

    paragraph.append(node);

    return paragraph;
  });

  $getRoot().select();

  $insertNodes(elements);
}

function onError(error: Error) {
  console.error(error);
}

const Editor = forwardRef<EditorRefProxyContainerType, EditorPropsType>(
  (props, refProxy): JSX.Element => {
    const initialConfig = {
      editorState: props?.richText
        ? (editor: LexicalEditor) => prepopulatedRichText(editor, props?.richText || '')
        : undefined,
      namespace: 'Editor',
      // 待重构
      nodes: enableNodes(props?.config?.plugins),
      theme: EditorTheme,
      editable: props?.config?.editable ?? true,
      // 待重构
      onError,
    };

    return (
      <LexicalComposer initialConfig={initialConfig}>
        <div className={addClassName(['main'])} style={props?.style ?? {}}>
          <EditorContextPrivider>
            <EditorRefProxyContainer ref={refProxy}>
              <EditorContainer
                plugins={props?.plugins ?? []}
                config={props?.config}
                onChange={props?.onChange}
              />
            </EditorRefProxyContainer>
          </EditorContextPrivider>
        </div>
      </LexicalComposer>
    );
  },
);

Editor.displayName = 'Editor';

export { Editor };
