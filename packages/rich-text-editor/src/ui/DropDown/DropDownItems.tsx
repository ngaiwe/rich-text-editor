import { addClassName } from '@/utils/className';
import { forwardRef, useEffect } from 'react';
import { classNameTag } from './config';

interface DropDownItemsRef extends HTMLDivElement {}
interface DropDownItemsProps {
  children?: React.ReactNode;
}

const DropDownItems = forwardRef<DropDownItemsRef, DropDownItemsProps>((props, ref) => {
  useEffect(() => {
    console.log('childrens', props.children);
  }, [props.children]);

  return (
    <div ref={ref} className={addClassName([`${classNameTag}-items`])}>
      {props.children}
    </div>
  );
});
DropDownItems.displayName = 'DropDownItems';

export default DropDownItems;
