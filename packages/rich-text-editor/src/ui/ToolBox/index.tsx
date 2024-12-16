import './index.less';

import { addClassName } from '@/utils/className';
import { FC } from 'react';

interface ToolBoxProps {
  children: React.ReactNode;
}

const ToolBox: FC<ToolBoxProps> = props => {
  return <div className={addClassName(['ui-tool-box'])}>{props.children}</div>;
};

export default ToolBox;
