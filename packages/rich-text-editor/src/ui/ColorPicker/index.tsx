import './index.less';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import ToolButton from '../ToolButton';
import { addClassName } from '@/utils/className';
import { classNameTag, ColorPickerContext, dropDownPadding } from './config';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { createPortal } from 'react-dom';
import ColorPickerPanel from './ColorPickerPanel';

interface ColorPickerProps {
  value: string;
  buttonIcon?: React.ReactNode;
  disabled?: boolean;
}

const ColorPicker: FC<ColorPickerProps> = props => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const colorPickerPanelRef = useRef<HTMLDivElement>(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const [color, setColor] = useState(props.value);

  const handleColorChange = useCallback((value: string) => {
    console.log('改变 color:', value);
    setColor(value);
  }, []);

  useEffect(() => {
    setColor(props.value);
  }, [props.value]);

  useEffect(() => {
    const button = buttonRef.current;
    const dropDown = colorPickerPanelRef.current;

    if (showDropDown && button !== null && dropDown !== null) {
      const { top, left } = button.getBoundingClientRect();
      dropDown.style.top = `${top + button.offsetHeight + dropDownPadding}px`;
      dropDown.style.left = `${Math.min(left, window.innerWidth - dropDown.offsetWidth - 20)}px`;
    }
  }, [colorPickerPanelRef, buttonRef, showDropDown]);

  return (
    <>
      <div className={addClassName([`${classNameTag}-button-bar`])}>
        <ToolButton ref={buttonRef} disabled={props.disabled}>
          {props.buttonIcon && (
            <span className={addClassName([`${classNameTag}-button-icon`])}>
              {props.buttonIcon}
            </span>
          )}
        </ToolButton>
        <ToolButton
          disabled={props.disabled}
          style={{ paddingLeft: 0, paddingRight: 0, marginRight: '8px' }}
          onClick={() => setShowDropDown(!showDropDown)}
        >
          {showDropDown ? <UpOutlined /> : <DownOutlined />}
        </ToolButton>
      </div>

      {showDropDown &&
        createPortal(
          <ColorPickerContext.Provider
            value={{
              color,
              handleColorChange,
            }}
          >
            <ColorPickerPanel ref={colorPickerPanelRef} />
          </ColorPickerContext.Provider>,
          document.body,
        )}
    </>
  );
};

export default ColorPicker;
