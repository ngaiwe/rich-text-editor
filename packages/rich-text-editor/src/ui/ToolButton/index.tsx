import { addClassName } from '@/utils/className';

import { forwardRef } from 'react';
import './index.less';

interface ToolButtonRef extends HTMLButtonElement {}

export interface ToolButtonProps {
  type: 'primary' | 'dashed' | 'link' | 'text' | 'default';
  size: 'small' | 'base' | 'middle' | 'large';
  active: boolean;
  disabled: boolean;
  onClick: (event: React.MouseEvent) => void;
  children: React.ReactNode;
}

const ToolButton = forwardRef<ToolButtonRef, Partial<ToolButtonProps>>(
  ({ size = 'base', children, active, onClick }, ref) => {
    return (
      <button
        ref={ref}
        className={addClassName([
          'ui-tool-button',
          `ui-tool-button-${size ?? 'base'}`,
          active ? 'ui-tool-button-active' : '',
        ])}
        onClick={onClick}
      >
        {children}
      </button>
    );
  },
);

ToolButton.displayName = 'ToolButton';

export default ToolButton;
