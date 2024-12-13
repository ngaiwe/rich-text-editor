import './index.less';

import { PluginsType } from '../../config/PluginsConfig';
import { addClassName } from '../../utils/className';
import { Container } from './Container';

interface ToolbarPluginPropsType {
  plugins?: PluginsType;
}

const classNameTag = 'toolbar-plugin';

const ToolbarPlugin = (props: ToolbarPluginPropsType) => {
  return (
    <div className={addClassName([classNameTag])}>
      <Container plugins={props.plugins} />
    </div>
  );
};

export default ToolbarPlugin;
