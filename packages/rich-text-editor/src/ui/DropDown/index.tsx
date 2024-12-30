import './index.less';
import { addClassName } from '@/utils/className';
import { FC, isValidElement, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ToolButton from '../ToolButton';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import DropDownItems from './DropDownItems';
import { classNameTag, dropDownPadding } from './config';

export { default as DropDownItem } from './DropDownItem';

interface ToolDropDownProps {
  buttonIcon?: React.ReactNode;
  buttonText?: string;
  value?: string | number;
  children?: React.ReactNode[];
}

const DropDown: FC<ToolDropDownProps> = props => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const [showDropDown, setShowDropDown] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    const dropDown = dropDownRef.current;

    if (showDropDown && button !== null && dropDown !== null) {
      const { top, left } = button.getBoundingClientRect();
      dropDown.style.top = `${top + button.offsetHeight + dropDownPadding}px`;
      dropDown.style.left = `${Math.min(left, window.innerWidth - dropDown.offsetWidth - 20)}px`;
    }
  }, [dropDownRef, buttonRef, showDropDown]);

  useEffect(() => {
    console.log('value', props.children);
  }, [props.children]);

  const buttonText = useMemo(() => {
    if (!props.children?.length) {
      return '';
    }

    return props.children
      ?.filter((child): child is React.ReactElement => isValidElement(child))
      .find(child => {
        return child.props.value === props.value;
      })?.props.label;
  }, [props.children, props.value]);

  return (
    <>
      <ToolButton ref={buttonRef} onClick={() => setShowDropDown(!showDropDown)}>
        {props.buttonIcon && (
          <span className={addClassName([`${classNameTag}-button-icon`])}>{props.buttonIcon}</span>
        )}
        <span className={addClassName([`${classNameTag}-button-span`])}>{buttonText}</span>
        {showDropDown ? <UpOutlined /> : <DownOutlined />}
      </ToolButton>

      {showDropDown &&
        createPortal(
          <DropDownItems ref={dropDownRef}>{props.children}</DropDownItems>,
          document.body,
        )}
    </>
  );
};

export default DropDown;
