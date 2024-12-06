import {DefaultOptionType} from 'antd/es/select'
import {InsertTypeEnum} from './config'
// import { $getSelection, $isNodeSelection, $isRangeSelection } from 'lexical'

const insertBlankDecision = (option: DefaultOptionType) => {
  // react 18 版本使用有问题，暂时下掉插空 disabled 功能
  // const selection = $getSelection()

  const rangeDisabled = false
  const nodeDisabled = false

  // if ($isRangeSelection(selection)) {
  //   rangeDisabled = Boolean(selection.getTextContent() || !selection?.isCollapsed())
  // }

  // if ($isNodeSelection(selection)) {
  //   nodeDisabled = selection.getNodes().some(node => node.isSelected(selection))
  // }

  return Object.assign({}, option, {
    disabled: rangeDisabled || nodeDisabled,
  })
}

export const decision = (options: DefaultOptionType[]): DefaultOptionType[] => {
  return options.map(option => {
    switch (option.value) {
      case InsertTypeEnum.insertBlank:
        return insertBlankDecision(option)
      default:
        return option
    }
  })
}
