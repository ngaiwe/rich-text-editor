import type { LexicalEditor } from 'lexical';

import { $isListItemNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $isTabNode,
  COMMAND_PRIORITY_EDITOR,
  INDENT_CONTENT_COMMAND,
  INSERT_TAB_COMMAND,
  KEY_TAB_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical';
import { useEffect } from 'react';

export function registerTabIndentation(editor: LexicalEditor) {
  return editor.registerCommand<KeyboardEvent>(
    KEY_TAB_COMMAND,
    event => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) {
        return false;
      }

      const startOffset = selection.getCharacterOffsets()[0];

      const anchor = selection.anchor;
      const focus = selection.focus;
      const first = focus.isBefore(anchor) ? focus : anchor;
      const firstNode = first.getNode();
      const firstBlock = firstNode.getTopLevelElementOrThrow();

      const tabnode = [...firstBlock.getChildren()].shift();

      event.preventDefault();

      let command = INSERT_TAB_COMMAND;

      if ($isListItemNode(tabnode) || $isTabNode(tabnode) || Boolean(startOffset)) {
        command = event.shiftKey ? OUTDENT_CONTENT_COMMAND : INDENT_CONTENT_COMMAND;
      }

      return editor.dispatchCommand(command, undefined);
    },
    COMMAND_PRIORITY_EDITOR,
  );
}

export function TabIndentationPlugin(): null {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return registerTabIndentation(editor);
  });

  return null;
}
