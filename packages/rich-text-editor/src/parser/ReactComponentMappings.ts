import {FunctionComponent, isValidElement} from 'react'
import {ValueOf} from '../@types/global'

import {Element} from 'domhandler'

// 特殊标签属性枚举
export enum ZhTagTypeEnum {
  'replaceBlank' = 'replaceBlank', // 挖空
  'insertBlank' = 'insertBlank', // 插空
}

export const ReactComponentMapping = {
  [ZhTagTypeEnum.replaceBlank]: ZhTagTypeEnum.replaceBlank,
  [ZhTagTypeEnum.insertBlank]: ZhTagTypeEnum.insertBlank,
  reactImage: 'reactImage',
}

type ReactComponentMappingKeyType = keyof typeof ReactComponentMapping

type ReactComponentMappingType = Record<
  ValueOf<typeof ReactComponentMapping>,
  FunctionComponent
>

// 判断是否是 react component
export const isReactComponent = (element: unknown) => {
  if (!element) {
    return false
  }

  return (
    isValidElement(element) || (typeof element === 'function' && element?.name)
  )
}

// 挖空
const doHollowBlankStrategy = (
  zhihuTagType: string,
  reactComponentMapping: ReactComponentMappingType,
) => {
  if (
    zhihuTagType === ZhTagTypeEnum.replaceBlank ||
    zhihuTagType === 'hollowBlank'
  ) {
    const replaceBlank =
      reactComponentMapping[ReactComponentMapping.replaceBlank]

    return isReactComponent(replaceBlank) ? replaceBlank : undefined
  }

  return doInsertBlankStrategy(zhihuTagType, reactComponentMapping)
}

// 插空
const doInsertBlankStrategy = (
  zhihuTagType: string,
  reactComponentMapping: ReactComponentMappingType,
) => {
  if (zhihuTagType === ZhTagTypeEnum.insertBlank) {
    const insertBlank = reactComponentMapping[ReactComponentMapping.insertBlank]

    return isReactComponent(insertBlank) ? insertBlank : undefined
  }

  return doDefaultStrategy()
}

// 图片
const doReactImageStrategy = (
  child: Element,
  reactComponentMapping: ReactComponentMappingType,
) => {
  const reactImage = reactComponentMapping[ReactComponentMapping.reactImage]

  if (reactImage && isReactComponent(reactImage) && child.name === 'img') {
    return reactImage
  }

  return doDefaultStrategy()
}

// 默认
const doDefaultStrategy = () => {
  return undefined
}

// 策略入口
const doStrategy = (
  child: Element,
  zhihuTagType: string,
  reactComponentMapping: Record<string, FunctionComponent>,
) => {
  if (zhihuTagType) {
    return doHollowBlankStrategy(zhihuTagType, reactComponentMapping)
  }

  return doReactImageStrategy(child, reactComponentMapping)
}

export {ReactComponentMappingType, ReactComponentMappingKeyType, doStrategy}
