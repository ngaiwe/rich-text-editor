// 工作栏 - 颜色选择空间
import { BgColorsOutlined, FontColorsOutlined } from '@ant-design/icons';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection';
import { ColorPickerProps, Space } from 'antd';
import ColorPicker from '../../ui/ColorPicker';
import type { Color } from 'antd/es/color-picker';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StorageUtils, STORAGE_KEY_ENUM } from '../../utils/localStorage';
import { ColorDropDownMap, ColorDropDownType, RecommendedColor } from './config';

export interface ColorDropDownToolPropsType {
  type: ColorDropDownType;
}

export const ColorDropDownTool = (props: ColorDropDownToolPropsType) => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  const { allowClear, disabledAlpha, defaultColor, styleKey } = useMemo(
    () => ColorDropDownMap[props.type],
    [props.type],
  );

  // 获取 storage key
  const storageKey = useMemo(() => {
    switch (props.type) {
      case 'fontColor':
        return STORAGE_KEY_ENUM.USER_USED_FONTCOLOR;
      case 'fontBdColor':
        return STORAGE_KEY_ENUM.USER_USED_FONTBDCOLOR;
      default:
        return undefined;
    }
  }, [props.type]);

  const [color, setColor] = useState<ColorPickerProps['value']>(defaultColor);

  const onColorChange = useCallback(
    (color: Color) => {
      setColor(color);

      StorageUtils.getInstance().setUserUsedColor({
        color: color.toHexString(),
        type: storageKey ?? '',
      });

      activeEditor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            [styleKey]: color.toHexString(),
          });
        }
      });
    },
    [activeEditor, storageKey, styleKey],
  );

  const userUsedColors = useMemo<string[]>(() => {
    return (storageKey && StorageUtils.getInstance().getUserUsedColor(storageKey)) ?? [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, color]);

  const updateToolbar = useCallback((): void => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
      return;
    }

    const styleValue = $getSelectionStyleValueForProperty(selection, styleKey);

    setColor($getSelectionStyleValueForProperty(selection, styleKey, styleValue || defaultColor));
  }, [defaultColor, styleKey]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (payload, activeEditor) => {
        updateToolbar();
        setActiveEditor(activeEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, updateToolbar]);

  return (
    <ColorPicker
      presets={[
        {
          label: '预设字段',
          colors: [
            '#000000',
            '#000000',
            '#000000',
            '#000000',
            '#000000',
            '#000000',
            '#000000',
            '#000000',
            '#000000',
            '#000000',
            '#000000',
            '#000000',
            '#000000',
          ],
        },
      ]}
      value={color}
      buttonIcon={<FontColorsOutlined />}
    />
    // <Space align="center">
    //   {props.type === 'fontColor' ? <FontColorsOutlined /> : <BgColorsOutlined />}
    //   <ColorPicker
    //     allowClear={allowClear}
    //     disabledAlpha={disabledAlpha}
    //     value={color}
    //     disabled={!editor.isEditable()}
    //     onChangeComplete={onColorChange}
    //     presets={[
    //       {
    //         label: '标准色',
    //         colors: RecommendedColor,
    //       },
    //       {
    //         label: '最近使用',
    //         colors: userUsedColors,
    //       },
    //     ]}
    //   />
    // </Space>
  );
};
