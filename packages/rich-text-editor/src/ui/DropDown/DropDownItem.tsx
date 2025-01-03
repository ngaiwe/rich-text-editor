import { FC, useMemo, useRef } from 'react';
import ToolButton from '../ToolButton';
import { DropDownContext } from './config';
import React from 'react';

interface DropDownItemProps {
  label: string;
  value: string | number;
  children?: React.ReactNode;
}

const DropDownItem: FC<DropDownItemProps> = props => {
  const ref = useRef<HTMLButtonElement>(null);
  const dropDownContext = React.useContext(DropDownContext);

  if (dropDownContext === null) {
    throw new Error('DropDownItem must be used within a DropDown');
  }

  const { activeValue, dropDwonChange } = dropDownContext;

  const isActive = useMemo(() => activeValue === props.value, [activeValue, props.value]);

  return (
    <ToolButton
      ref={ref}
      active={isActive}
      onClick={() => {
        dropDwonChange?.(props.value);
      }}
    >
      {props.children ? props.children : <span>{props.label}</span>}
    </ToolButton>
  );
};

export default DropDownItem;
