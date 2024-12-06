// 工具栏分割线
import './index.less'

import {Button, ButtonProps} from 'antd'
import omit from 'lodash/omit'
import React, {useMemo} from 'react'
import {addClassName} from '../../utils/className'

export interface ToolButtonPropsType {
  active?: boolean
}

export default function ToolButton(
  props: ToolButtonPropsType & ButtonProps & React.RefAttributes<HTMLElement>
): JSX.Element {
  const originButtonProps = useMemo<ButtonProps>(
    () => omit(props, ['active']),
    [props]
  )

  return (
    <Button
      {...originButtonProps}
      className={props?.active ? `${addClassName(['ui-button-active'])}` : ''}
    >
      {props?.children}
    </Button>
  )
}
