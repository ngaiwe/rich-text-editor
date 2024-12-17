import { addClassName } from '@/utils/className';

import { FC } from 'react';
import './index.less';

export interface ToolButtonProps {
  type: 'primary' | 'dashed' | 'link' | 'text' | 'default';
  size: 'small' | 'base' | 'middle' | 'large';
  disabled: boolean;
  children?: React.ReactNode;
}

const ToolButton: FC<ToolButtonProps> = (
  props = {
    type: 'default',
    size: 'base',
    disabled: false,
  },
) => {
  return (
    <button className={addClassName(['ui-tool-button', `ui-tool-button-${props.size}`])}>
      {props.children}
    </button>
  );
};

export default ToolButton;
