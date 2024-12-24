// 工作栏 - 文字格式处理 加粗 | 倾斜等
import useHeadingNode from '@/hooks/useHeadingNode';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, ClearOutlined } from '@ant-design/icons';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import { $getNearestBlockElementAncestorOrThrow, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextFormatType,
} from 'lexical';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_TOOLBAR_ICON_SIZE } from '../../config/AntdUiConfig';
import { FontFormatType, FontFormatTypeEnum, HeadingDisabledFormats } from './config';

import ToolButton from '../../ui/ToolButton';

import { CLEAR_FORMATTING, FormatPayload } from '../../config/GlobalCommand';

// 工具栏更新状态白名单
const UPDATE_TOOL_TYPE: string[] = [
  FontFormatTypeEnum.bold,
  FontFormatTypeEnum.italic,
  FontFormatTypeEnum.underline,
];

export interface FontFormatPropsType {
  type: FontFormatType;
}

const FontFormatTool = (props: FontFormatPropsType) => {
  const [editor] = useLexicalComposerContext();
  const [isHeadingNode] = useHeadingNode();

  const { type } = props;

  const [active, setActive] = useState(false);

  const updateToolStatus = useCallback((): void => {
    // 不符合更新工具栏的 type
    if (!UPDATE_TOOL_TYPE.includes(type)) {
      return;
    }

    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        setActive(selection.hasFormat(type as TextFormatType));
      }
    });
  }, [editor, type]);

  const touchButtonCallback = useCallback(() => {
    switch (type) {
      case FontFormatTypeEnum.bold:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        break;
      case FontFormatTypeEnum.italic:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        break;
      case FontFormatTypeEnum.underline:
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        break;
      case FontFormatTypeEnum.reset:
        editor.dispatchCommand(CLEAR_FORMATTING, undefined);
        break;
    }

    updateToolStatus();
  }, [editor, type, updateToolStatus]);

  const buttonContextMemo = useMemo(() => {
    switch (type) {
      case FontFormatTypeEnum.reset:
        // 重置格式
        return (
          <>
            <ClearOutlined />
          </>
        );
      case FontFormatTypeEnum.bold:
        // 加粗
        return (
          <>
            <BoldOutlined />
          </>
        );
      case FontFormatTypeEnum.italic:
        // 倾斜
        return (
          <>
            <ItalicOutlined />
          </>
        );
      case FontFormatTypeEnum.underline:
        // 下划线
        return (
          <>
            <UnderlineOutlined />
          </>
        );
      default:
        return <></>;
    }
  }, [type]);

  const clearFormat = useCallback(
    (payload?: FormatPayload) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchor = selection.anchor;
          const focus = selection.focus;
          const nodes = selection.getNodes();
          const parentNode = nodes[0]?.getParent();
          const formats = payload?.formats || [];

          // 清除指定格式逻辑
          if (formats?.length && parentNode) {
            // 获取父节点的所有子节点
            parentNode.getChildren()?.forEach(childNode => {
              if ($isTextNode(childNode)) {
                const { __style, __format } = childNode;
                const needsReset = formats.some(
                  format =>
                    (format === 'bold' && childNode.hasFormat('bold')) ||
                    (format === 'font-size' && childNode.getStyle().includes('font-size')),
                );

                if (needsReset) {
                  if (__style !== '') {
                    childNode.setStyle('');
                  }
                  if (__format !== 0) {
                    childNode.setFormat(0);
                  }
                }
              }
            });
            return;
          }

          if (anchor.key === focus.key && anchor.offset === focus.offset) {
            return;
          }

          nodes.forEach((node, idx) => {
            // We split the first and last node by the selection
            // So that we don't format unselected text inside those nodes
            if ($isTextNode(node)) {
              if (idx === 0 && anchor.offset !== 0) {
                node = node.splitText(anchor.offset)[1] || node;
              }
              if (idx === nodes.length - 1) {
                node = node.splitText(focus.offset)[0] || node;
              }

              if (node.__style !== '') {
                node.setStyle('');
              }
              if (node.__format !== 0) {
                node.setFormat(0);
                $getNearestBlockElementAncestorOrThrow(node).setFormat('');
              }
            } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
              node.replace($createParagraphNode(), true);
            } else if ($isDecoratorBlockNode(node)) {
              node.setFormat('');
            }
          });
        }
      });
    },
    [editor],
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolStatus();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CLEAR_FORMATTING,
        (payload: FormatPayload) => {
          clearFormat(payload);
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [updateToolStatus, clearFormat, editor]);

  const disabled = useMemo(
    () => !editor.isEditable() || (isHeadingNode && HeadingDisabledFormats.includes(type)),
    [editor, isHeadingNode, type],
  );

  return (
    <div>
      <ToolButton
        type="text"
        active={active}
        size={DEFAULT_TOOLBAR_ICON_SIZE}
        disabled={disabled}
        onClick={touchButtonCallback}
      >
        {buttonContextMemo}
      </ToolButton>
    </div>
  );
};

export { FontFormatTool };
