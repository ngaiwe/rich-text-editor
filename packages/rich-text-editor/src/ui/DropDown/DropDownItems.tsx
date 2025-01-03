import { addClassName } from '@/utils/className';
import { forwardRef } from 'react';
import { classNameTag } from './config';

interface DropDownItemsRef extends HTMLDivElement {}
interface DropDownItemsProps {
  children?: React.ReactNode;
}

const DropDownItems = forwardRef<DropDownItemsRef, DropDownItemsProps>((props, ref) => {
  return (
    <div ref={ref} className={addClassName([`${classNameTag}-items`])}>
      {props.children}
    </div>
  );
});
DropDownItems.displayName = 'DropDownItems';

export default DropDownItems;
