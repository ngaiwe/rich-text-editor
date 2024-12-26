// 工作栏 - 格式处理控件(列表)
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $findMatchingParent, $getNearestNodeOfType } from '@lexical/utils';
import { Select } from 'antd';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_CRITICAL,
  // eslint-disable-next-line camelcase
  DEPRECATED_$isGridSelection,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import { ValueOf } from '../../@types/global';
import { BlockControls, OPTIONS } from './config';

import { CLEAR_FORMATTING } from '../../config/GlobalCommand';
import DropDown, { DropDownItem } from '@/ui/ToolDropDown';

const BlockControlsDropDownTool = () => {
  const [editor] = useLexicalComposerContext();

  const [blockType, setBlockType] = useState(BlockControls.normal);

  const updateHeadingNode = useCallback(
    (value: HeadingTagType, selection: RangeSelection) => {
      if (selection && $isRangeSelection(selection)) {
        // 清楚格式
        editor.dispatchCommand(CLEAR_FORMATTING, { formats: ['bold', 'font-size'] });

        // 设置标题
        $setBlocksType(selection as RangeSelection, () => $createHeadingNode(value));

        setTimeout(() => editor.blur(), 300);
      }
    },
    [editor],
  );

  const changeCallback = useCallback(
    (value: ValueOf<typeof BlockControls>) => {
      setBlockType?.(value);

      editor.update(() => {
        const selection = $getSelection();

        switch (value) {
          case BlockControls.normal:
            if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
              $setBlocksType(selection, () => $createParagraphNode());
            }
            break;
          case BlockControls.h1:
            updateHeadingNode(value as HeadingTagType, selection as RangeSelection);
            break;
          case BlockControls.h2:
            updateHeadingNode(value as HeadingTagType, selection as RangeSelection);

            break;
          case BlockControls.quote:
            editor.update(() => {
              const selection = $getSelection();
              if (selection) {
                $setBlocksType(selection as RangeSelection, () => $createQuoteNode());
              }
            });
            break;
          case BlockControls.bullet:
            if (blockType !== BlockControls.bullet) {
              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            } else {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            }
            break;
          case BlockControls.number:
            if (blockType !== BlockControls.number) {
              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            } else {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            }
            break;
        }
      });
    },
    [blockType, editor, updateHeadingNode],
  );

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          let element =
            anchorNode.getKey() === 'root'
              ? anchorNode
              : $findMatchingParent(anchorNode, e => {
                  const parent = e.getParent();
                  return parent !== null && $isRootOrShadowRoot(parent);
                });

          if (element === null) {
            element = anchorNode.getTopLevelElementOrThrow();
          }

          const elementKey = element.getKey();
          const elementDOM = editor.getElementByKey(elementKey);

          if (elementDOM !== null) {
            if ($isListNode(element)) {
              const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
              const type = parentList ? parentList.getListType() : element.getListType();
              setBlockType(type);
            } else {
              const type = $isHeadingNode(element) ? element.getTag() : element.getType();

              if (type in BlockControls) {
                setBlockType(type as keyof typeof BlockControls);
              } else {
                setBlockType(BlockControls.normal);
              }
            }
          }
        }
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor]);

  return (
    <DropDown>
      {OPTIONS.map((option, index) => (
        <DropDownItem key={index}>
          <span>{option.label}</span>
        </DropDownItem>
      ))}
    </DropDown>
    // <div>
    //   <Select
    //     size="large"
    //     defaultValue={BlockControls.normal}
    //     value={blockType}
    //     defaultActiveFirstOption
    //     style={{ width: 120 }}
    //     bordered={false}
    //     disabled={!editor.isEditable()}
    //     options={OPTIONS}
    //     onChange={changeCallback}
    //   />
    // </div>
  );
};

export { BlockControlsDropDownTool };
