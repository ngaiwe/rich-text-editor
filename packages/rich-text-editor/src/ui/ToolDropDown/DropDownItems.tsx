import { addClassName } from '@/utils/className';
import { forwardRef, useEffect } from 'react';
import { classNameTag } from './config';

interface DropDownItemsRef extends HTMLDivElement {}
interface DropDownItemsProps {
  children?: React.ReactNode;
}

const DropDownItems = forwardRef<DropDownItemsRef, DropDownItemsProps>(({ children }, ref) => {
  useEffect(() => {
    console.log('children', children);
  }, [children]);

  return (
    <div ref={ref} className={addClassName([`${classNameTag}-items`])}>
      {children}
    </div>
  );
});
DropDownItems.displayName = 'DropDownItems';

export default DropDownItems;
