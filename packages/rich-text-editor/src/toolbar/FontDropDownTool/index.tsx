// 工作栏 - 字体样式控件（字号、字色、字体背景色）
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';

import ToolIcon from '../../ui/ToolIcon';
import { FontDropDownMap, FontDropDowType, HeadingDisabledSizeMap } from './config';

import useHeadingNode from '@/hooks/useHeadingNode';
import DropDown, { DropDownItem } from '@/ui/DropDown';

export interface FontDropDownToolProps {
  type: FontDropDowType;
}

const FontDropDownTool = (props: FontDropDownToolProps) => {
  const [editor] = useLexicalComposerContext();
  const [isHeadingNode] = useHeadingNode();

  const { options, defaultValue, styleKey, icon } = useMemo(
    () => FontDropDownMap[props.type],
    [props.type],
  );
  const [size, setSize] = useState(defaultValue);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          const styleValue = $getSelectionStyleValueForProperty(selection, styleKey);

          setSize(
            $getSelectionStyleValueForProperty(selection, styleKey, styleValue || defaultValue),
          );
        }
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [defaultValue, editor, styleKey]);

  // 字体大小改变
  const onFontSizeChange = useCallback(
    (value: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            [styleKey]: value,
          });
        }
      });
    },
    [editor, styleKey],
  );

  const disabled = useMemo(
    () => !editor.isEditable() || (isHeadingNode && HeadingDisabledSizeMap.includes(props.type)),
    [editor, isHeadingNode, props.type],
  );

  return (
    <DropDown
      disabled={disabled}
      value={size}
      buttonIcon={<ToolIcon component={icon} />}
      onChange={onFontSizeChange}
    >
      {options.map((option, index) => (
        <DropDownItem key={index} label={option.label} value={option.value} />
      ))}
    </DropDown>
  );
};

export { FontDropDownTool };
