import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalContextMenuPlugin } from '@lexical/react/LexicalContextMenuPlugin';
import { $getSelection, GridSelection, LexicalNode, NodeSelection, RangeSelection } from 'lexical';
import { useCallback, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { ContextMenu } from '../../ui/ContextMenu';
import { addClassName } from '../../utils/className';
import ContextMenuOption from './ContextMemuOption';

import useOptions from './OptionsHook';

export default function ContextMenuPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [editorSelection, setEditorSelection] = useState<
    RangeSelection | NodeSelection | GridSelection | null | undefined
  >();

  const options = useOptions(editor, editorSelection);

  const onSelectOption = useCallback(
    (selectedOption: ContextMenuOption, targetNode: LexicalNode | null, closeMenu: () => void) => {
      editor.update(() => {
        selectedOption.onSelect(targetNode);
        closeMenu();
      });
    },
    [editor],
  );

  const menuRenderFn = useCallback(
    (
      anchorElementRef: { current: Element | DocumentFragment | any },
      { selectedIndex, options: _options, selectOptionAndCleanUp, setHighlightedIndex }: any,
      { setMenuRef }: any,
    ) => {
      return anchorElementRef.current
        ? ReactDOM.createPortal(
            <div
              className={addClassName(['typeahead-popover', 'auto-embed-menu'])}
              style={{
                marginLeft: anchorElementRef.current.style.width,
                userSelect: 'none',
                width: 200,
              }}
              ref={setMenuRef}
            >
              <ContextMenu
                options={options}
                selectedItemIndex={selectedIndex}
                onOptionClick={(option: ContextMenuOption, index: number) => {
                  setHighlightedIndex(index);
                  selectOptionAndCleanUp(option);
                }}
                onOptionMouseEnter={(index: number) => {
                  setHighlightedIndex(index);
                }}
              />
            </div>,
            anchorElementRef.current,
          )
        : null;
    },
    [options],
  );

  const onOpen = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();

      setEditorSelection(selection);
    });
  }, [editor]);

  return (
    <LexicalContextMenuPlugin
      options={options}
      onOpen={onOpen}
      onSelectOption={onSelectOption}
      menuRenderFn={menuRenderFn}
    />
  );
}
