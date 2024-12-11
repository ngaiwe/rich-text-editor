// 工作栏 - 排版控件(居中、左右对齐)
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Select } from 'antd';
import {
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import { getSelectedNode } from '../../utils/getSelectedNode';
import { AlignType, DEFAULT_ALIGN_TYPE, OPTIONS } from './config';

const AlignDropDownTool = () => {
  const [editor] = useLexicalComposerContext();

  const [alignValue, setAlignValue] = useState<ElementFormatType>(DEFAULT_ALIGN_TYPE);

  const changeCallback = useCallback(
    (value: ElementFormatType) => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, value);

      setAlignValue(value);
    },
    [editor],
  );

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          const node = getSelectedNode(selection);
          const parent = node.getParent();
          const alignType = parent?.getFormatType();

          setAlignValue(alignType && AlignType.has(alignType) ? alignType : DEFAULT_ALIGN_TYPE);
        } else if ($isNodeSelection(selection)) {
          const nodes = selection.getNodes();
          const parent = nodes?.[0].getTopLevelElementOrThrow?.();
          const alignType = parent?.getFormatType?.();

          setAlignValue(alignType && AlignType.has(alignType) ? alignType : DEFAULT_ALIGN_TYPE);
        }
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor]);

  return (
    <div>
      <Select
        size="large"
        defaultValue={alignValue}
        value={alignValue}
        defaultActiveFirstOption
        style={{ width: 120 }}
        bordered={false}
        disabled={!editor.isEditable()}
        options={OPTIONS}
        onChange={changeCallback}
      />
    </div>
  );
};

export { AlignDropDownTool };
