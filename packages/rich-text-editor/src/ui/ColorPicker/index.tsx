import './index.less';

import { FC, useRef, useState } from 'react';
import ToolButton from '../ToolButton';
import { addClassName } from '@/utils/className';
import { classNameTag, ColorPickerContext } from './config';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { createPortal } from 'react-dom';

interface ColorPickerProps {
  buttonIcon?: React.ReactNode;
  disabled?: boolean;
}

const ColorPicker: FC<ColorPickerProps> = props => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showDropDown, setShowDropDown] = useState(false);

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
            value={
              {
                // activeValue,
                // dropDwonChange,
              }
            }
          >
            {/* <DropDownItems ref={dropDownRef}>{props.children}</DropDownItems> */}
          </ColorPickerContext.Provider>,
          document.body,
        )}
    </>
  );
};

export default ColorPicker;
