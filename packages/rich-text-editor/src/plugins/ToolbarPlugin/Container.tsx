import './index.less';

import { PluginsType } from '../../config/PluginsConfig';
import { AlignDropDownTool } from '../../toolbar/AlignDropDownTool';
import { BlockControlsDropDownTool } from '../../toolbar/BlockControlsDropDownTool';
import { ColorDropDownTool } from '../../toolbar/ColorDropDownTool';
import { FontDropDownTool } from '../../toolbar/FontDropDownTool';
import { FontFormatTool } from '../../toolbar/FontFormatTool';
import { FontFormatTypeEnum } from '../../toolbar/FontFormatTool/config';
import { FormatPainterTool } from '../../toolbar/FormatPainterTool';
import { InsertTool } from '../../toolbar/InsertTool';

import ToolDivider from '../../ui/ToolDivider';
import { addClassName } from '@/utils/className';
// import ToolDropDown from '@/ui/DropDown';
// import { UnorderedListOutlined } from '@ant-design/icons';

const classNameTag = 'toolbar-plugin';

interface ContainerPropsType {
  plugins?: PluginsType;
}

export const Container = (props: ContainerPropsType) => {
  return (
    <div className={addClassName([`${classNameTag}-container`])}>
      <FormatPainterTool />

      <ToolDivider />

      <FontFormatTool type={FontFormatTypeEnum.reset} />

      <ToolDivider />

      {/* 以上测试完毕 */}

      <BlockControlsDropDownTool />

      <ToolDivider />

      <FontDropDownTool type="fontSize" />

      <ToolDivider />

      <FontDropDownTool type="fontSpacing" />

      <ToolDivider />

      <FontDropDownTool type="fontLineHeight" />

      <ToolDivider />

      <ColorDropDownTool type="fontColor" />

      <ToolDivider />

      <ColorDropDownTool type="fontBdColor" />

      <ToolDivider />

      <FontFormatTool type={FontFormatTypeEnum.bold} />

      <ToolDivider />

      <FontFormatTool type={FontFormatTypeEnum.italic} />

      <ToolDivider />

      <FontFormatTool type={FontFormatTypeEnum.underline} />

      <ToolDivider />

      <AlignDropDownTool />

      <InsertTool plugins={props.plugins} />
    </div>
  );
};
