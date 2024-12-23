import { addClassName } from '@/utils/className';

import { FC } from 'react';
import './index.less';

export interface ToolButtonProps {
  type: 'primary' | 'dashed' | 'link' | 'text' | 'default';
  size: 'small' | 'base' | 'middle' | 'large';
  active: boolean;
  disabled: boolean;
  onClick: (event: React.MouseEvent) => void;
  children: React.ReactNode;
}

const ToolButton: FC<Partial<ToolButtonProps>> = (
  props = {
    type: 'default',
    size: 'base',
    disabled: false,
  },
) => {
  console.log('size: ', props.size)
  return (
    <button
      className={addClassName([
        'ui-tool-button',
        `ui-tool-button-${props.size ?? 'base'}`,
        props.active ? 'ui-tool-button-active' : '',
      ])}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default ToolButton;
