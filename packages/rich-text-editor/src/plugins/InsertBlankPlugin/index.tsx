import { useContext, useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
} from 'lexical';

import { $dfs, $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import filter from 'lodash/filter';
import { INSERTBLANK_CHANGE_COMMAND } from '../../config/EditorCommand';
import {
  InsertHandlePayloadTypeEnum,
  INSERT_BLANK_CHANGE_COMMAND,
  INSERT_BLANK_COMMAND,
} from '../../config/GlobalCommand';
import { EditorContext } from '../../context/EditorContext';
import {
  $createInsertBlankNode,
  $isInsertBlankNode,
  InsertBlankNode,
} from '../../nodes/InsertBlankNode';

export interface InsertBlankChangeParams {
  nodeKey: string;
  index: number;
}

export default function InsertBlankPlugin() {
  const [editor] = useLexicalComposerContext();

  const { dispatchCommandsMap } = useContext(EditorContext);

  useEffect(() => {
    if (!editor.hasNodes([InsertBlankNode])) {
      throw new Error('[InsertBlankNode]: not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_BLANK_COMMAND,
        payload => {
          const blankNode = $createInsertBlankNode(payload);
          $insertNodes([blankNode]);

          if ($isRootOrShadowRoot(blankNode.getParentOrThrow())) {
            $wrapNodeInElement(blankNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        INSERT_BLANK_CHANGE_COMMAND,
        ({ type }) => {
          if (!dispatchCommandsMap) {
            return true;
          }

          editor.update(() => {
            const insertBlanNodes = filter(
              $dfs(),
              ({ node }) =>
                $isInsertBlankNode(node) &&
                !(type === InsertHandlePayloadTypeEnum.CUT && node.isDirty()),
            );

            const value = insertBlanNodes.map(({ node }, index) => {
              if ($isInsertBlankNode(node)) {
                type !== InsertHandlePayloadTypeEnum.CUT && node?.updateIndex(index);

                return {
                  nodeKey: node?.getKey(),
                  index,
                };
              }

              return {};
            }) as InsertBlankChangeParams[];

            dispatchCommandsMap({
              type: 'DISPATCH',
              payload: {
                command: INSERTBLANK_CHANGE_COMMAND,
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
