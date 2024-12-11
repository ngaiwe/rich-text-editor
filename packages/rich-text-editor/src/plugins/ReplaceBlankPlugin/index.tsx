import { useContext, useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
} from 'lexical';

import { $dfs, $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import filter from 'lodash/filter';
import { REPLACEBLANK_CHANGE_COMMAND } from '../../config/EditorCommand';
import { REPLACE_BLANK_CHANGE_COMMAND, REPLACE_BLANK_COMMAND } from '../../config/GlobalCommand';
import { EditorContext } from '../../context/EditorContext';
import {
  $createReplaceBlankNode,
  $isReplaceBlankNode,
  ReplaceBlankNode,
} from '../../nodes/ReplaceBlankNode';

export interface ReplaceBlankChangeParams {
  nodeKey: string;
  text: string;
  index: number;
}

export default function ReplaceBlankPlugin() {
  const [editor] = useLexicalComposerContext();

  const { dispatchCommandsMap } = useContext(EditorContext);

  useEffect(() => {
    if (!editor.hasNodes([ReplaceBlankNode])) {
      throw new Error('[ReplaceBlankNode]: not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand(
        REPLACE_BLANK_COMMAND,
        () => {
          const selection = $getSelection();

          if (!$isRangeSelection(selection)) {
            return true;
          }

          const text = selection.getTextContent();

          if (!text?.length) {
            return true;
          }

          const replaceBlankNode = $createReplaceBlankNode({
            text,
          });

          $insertNodes([replaceBlankNode]);

          if ($isRootOrShadowRoot(replaceBlankNode.getParentOrThrow())) {
            $wrapNodeInElement(replaceBlankNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        REPLACE_BLANK_CHANGE_COMMAND,
        () => {
          if (!dispatchCommandsMap) {
            return true;
          }

          editor.update(() => {
            const replaceBlanNodes = filter(
              $dfs(),
              ({ node }) => $isReplaceBlankNode(node) && !node.isDirty(),
            );

            const value = replaceBlanNodes.map((decoratorNode, index) => {
              const node = decoratorNode.node;
              if ($isReplaceBlankNode(node)) {
                return {
                  nodeKey: node?.getKey(),
                  text: node?.getText(),
                  index,
                };
              }
              return {};
            }) as ReplaceBlankChangeParams[];

            dispatchCommandsMap({
              type: 'DISPATCH',
              payload: {
                command: REPLACEBLANK_CHANGE_COMMAND,
                params: {
                  value,
                },
              },
            });
          });
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [dispatchCommandsMap, editor]);

  return null;
}
