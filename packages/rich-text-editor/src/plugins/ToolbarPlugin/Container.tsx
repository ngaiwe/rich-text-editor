import { Col, Row } from 'antd';
import { PluginHandle, PluginsType, UPLOAD_IMAGE_PLUGIN_CONFIG } from '../../config/PluginsConfig';
import { AlignDropDownTool } from '../../toolbar/AlignDropDownTool';
import { BlockControlsDropDownTool } from '../../toolbar/BlockControlsDropDownTool';
import { ColorDropDownTool } from '../../toolbar/ColorDropDownTool';
import { FontDropDownTool } from '../../toolbar/FontDropDownTool';
import { FontFormatTool } from '../../toolbar/FontFormatTool';
import { FontFormatTypeEnum } from '../../toolbar/FontFormatTool/config';
import { FormatPainterTool } from '../../toolbar/FormatPainterTool';
import { InsertTool } from '../../toolbar/InsertTool';
import { UploadImageTool } from '../../toolbar/UploadImageTool';

import ToolDivider from '../../ui/ToolDivider';

interface ContainerPropsType {
  plugins?: PluginsType;
}

export const Container = (props: ContainerPropsType) => {
  return (
    <Row align="middle">
      <Col>
        <FormatPainterTool />
      </Col>
      <Col>
        <ToolDivider />
      </Col>
      <Col>
        <FontFormatTool type={FontFormatTypeEnum.reset} />
      </Col>
      <Col>
        <ToolDivider />
      </Col>
      <Col>
        <BlockControlsDropDownTool />
      </Col>
      <Col>
        <ToolDivider />
      </Col>
      <Col>
        <FontDropDownTool type="fontSize" />
      </Col>
      <Col>
        <ToolDivider />
      </Col>
      <Col>
        <FontDropDownTool type="fontSpacing" />
      </Col>
      <Col>
        <ToolDivider />
      </Col>
      <Col>
        <FontDropDownTool type="fontLineHeight" />
      </Col>
      <Col>
        <ToolDivider />
      </Col>
      <Col>
        <ColorDropDownTool type="fontColor" />
      </Col>
      <Col>
        <ToolDivider />
      </Col>
      <Col>
        <ColorDropDownTool type="fontBdColor" />
      </Col>
      <Col>
        <ToolDivider />
      </Col>
      <Col>
        <FontFormatTool type={FontFormatTypeEnum.bold} />
      </Col>
      <Col>
        <ToolDivider />
      </Col>
      <Col>
        <FontFormatTool type={FontFormatTypeEnum.italic} />
      </Col>
      <Col>
        <ToolDivider />
      </Col>
      <Col>
        <FontFormatTool type={FontFormatTypeEnum.underline} />
      </Col>
      <Col>
        <ToolDivider />
      </Col>
      <Col>
        <AlignDropDownTool />
      </Col>
      <InsertTool plugins={props.plugins} />
      {PluginHandle.hasUploadImagePlugin(props.plugins) && (
        <>
          <Col>
            <ToolDivider />
          </Col>
          <Col>
            <UploadImageTool {...props.plugins?.[UPLOAD_IMAGE_PLUGIN_CONFIG]} />
          </Col>
        </>
      )}
    </Row>
  );
};
