import { FC } from 'react';
import ToolButton from '../ToolButton';

interface DropDownItemProps {
  children?: React.ReactNode;
}

const DropDownItem: FC<DropDownItemProps> = props => {
  return (
    <ToolButton
      onClick={() => {
        console.log(123);
      }}
    >
      {props.children}
    </ToolButton>
  );
};

export default DropDownItem;
