import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ParagraphNode, TextNode, type Klass, type LexicalNode } from 'lexical';

import { PluginHandle, PluginsType } from '../config/PluginsConfig';
import { ExtendedParagraphNode } from './ExtendedParagraphNode';
import { ExtendedTextNode } from './ExtendedTextNode';
import { ImageNode } from './ImageNode';
import { InsertBlankNode } from './InsertBlankNode';
import { ReplaceBlankNode } from './ReplaceBlankNode';

export const DefaultNodes: Array<
  | Klass<LexicalNode>
  | {
      replace: Klass<LexicalNode>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      with: <T extends new (...args: any) => any>(node: InstanceType<T>) => LexicalNode;
    }
> = [
  HeadingNode,
  QuoteNode,
  ExtendedTextNode,
  {
    replace: TextNode,
    with: (node: TextNode) => new ExtendedTextNode(node.__text, node.__key),
  },
  ExtendedParagraphNode,
  {
    replace: ParagraphNode,
    with: (node: ParagraphNode) => new ExtendedParagraphNode(node.__key),
  },
  ListNode,
  ListItemNode,
  TableCellNode,
  TableNode,
  TableRowNode,
  ImageNode,
];

export const enableNodes = (enablePlugins?: PluginsType) => {
  const Nodes = [...DefaultNodes];

  if (!enablePlugins || !Object.keys(enablePlugins)?.length) {
    return Nodes;
  }

  if (PluginHandle.hasReplaceBlankPlugin(enablePlugins)) {
    Nodes.push(ReplaceBlankNode);
  }

  if (PluginHandle.hasInsertBlankPlugin(enablePlugins)) {
    Nodes.push(InsertBlankNode);
  }

  return Nodes;
};
