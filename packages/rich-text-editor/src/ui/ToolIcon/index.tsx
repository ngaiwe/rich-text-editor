import Icon, {
  CustomIconComponentProps,
} from '@ant-design/icons/lib/components/Icon'
import React from 'react'
import {
  DEFAULT_ANTD_ICON_HEIGHT,
  DEFAULT_ANTD_ICON_WIDTH,
} from '../../config/AntdUiConfig'

interface ToolIconPropsType {
  component:
    | React.ComponentType<
        CustomIconComponentProps | React.SVGProps<SVGSVGElement>
      >
    | React.ForwardRefExoticComponent<CustomIconComponentProps>
}

const ToolIcon = (props: ToolIconPropsType) => (
  <Icon
    component={props.component}
    style={{
      width: `${DEFAULT_ANTD_ICON_WIDTH}px`,
      height: `${DEFAULT_ANTD_ICON_HEIGHT}px`,
    }}
  />
)

export default ToolIcon
