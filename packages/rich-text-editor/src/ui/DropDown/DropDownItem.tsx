import { FC } from 'react';
import ToolButton from '../ToolButton';

interface DropDownItemProps {
  label: string;
  value: string | number;
  children?: React.ReactNode;
}

const DropDownItem: FC<DropDownItemProps> = props => {
  return (
    <ToolButton
      onClick={() => {
        console.log(123);
      }}
    >
      {props.children ? props.children : <span>{props.label}</span>}
    </ToolButton>
  );
};

export default DropDownItem;
