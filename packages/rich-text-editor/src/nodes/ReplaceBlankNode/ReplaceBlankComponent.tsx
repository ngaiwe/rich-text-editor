import { mergeRegister } from '@lexical/utils';
import './ReplaceBlank.less';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import {
  $getNodeByKey,
  $getSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  CUT_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useRef } from 'react';
import { $isReplaceBlankNode } from '.';
import { REPLACE_BLANK_CHANGE_COMMAND } from '../../config/GlobalCommand';

export enum ReplaceBlankNodeHandleEnum {
  'ADD' = 'ADD',
  'REMOVE' = 'REMOVE',
}

export interface ReplaceBlankComponentPropsType {
  nodeKey: string;
  text: string;
}

const ReplaceBlankComponent = ({ nodeKey, text }: ReplaceBlankComponentPropsType) => {
  const [editor] = useLexicalComposerContext();

  const blankRef = useRef<null | HTMLSpanElement>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);

  useEffect(() => {
    editor.dispatchCommand(REPLACE_BLANK_CHANGE_COMMAND, undefined);
  }, [editor, nodeKey, text]);

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      const event: KeyboardEvent = payload;
      event.preventDefault();

      if (
        isSelected &&
        $getSelection()
          ?.getNodes()
          ?.find(node => node.getKey() === nodeKey)
      ) {
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);

          if ($isReplaceBlankNode(node)) {
            node.remove();
          }

          editor.dispatchCommand(REPLACE_BLANK_CHANGE_COMMAND, undefined);
        });
      } else {
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);

          if (!node?.isAttached() && node?.isDirty()) {
            editor.dispatchCommand(REPLACE_BLANK_CHANGE_COMMAND, undefined);
          }
        });
      }

      return false;
    },
    [editor, isSelected, nodeKey],
  );

  const onCut = useCallback(
    (payload: KeyboardEvent) => {
      const event: KeyboardEvent = payload;
      event.preventDefault();

      if (
        isSelected &&
        $getSelection()
          ?.getNodes()
          ?.find(node => node.getKey() === nodeKey)
      ) {
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);

          if ($isReplaceBlankNode(node)) {
            node.markDirty();
          }

          editor.dispatchCommand(REPLACE_BLANK_CHANGE_COMMAND, undefined);
        });
      }
      return false;
    },
    [editor, isSelected, nodeKey],
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        payload => {
          const event = payload;
          if (event.target === blankRef.current) {
            if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(CUT_COMMAND, onCut, COMMAND_PRIORITY_LOW),
    );
  }, [clearSelection, editor, isSelected, onCut, onDelete, setSelected]);

  return (
    <span ref={blankRef} className={`replaceBlank ${isSelected ? 'focused' : ''}`}>
      {text}
    </span>
  );
};

export default ReplaceBlankComponent;
