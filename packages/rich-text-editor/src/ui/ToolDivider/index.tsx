// 工具栏分割线
import {Divider} from 'antd'

export default function ToolDivider(): JSX.Element {
  return (
    <Divider
      type="vertical"
      orientation="center"
      style={{
        height: '38px',
      }}
    />
  )
}
