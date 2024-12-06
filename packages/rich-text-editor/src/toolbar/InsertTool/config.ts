import {PluginHandle, PluginsType} from '../../config/PluginsConfig'

// 挖空 | 图片
export enum InsertTypeEnum {
  'none' = 'none', // 默认空
  'table' = 'table', // 表格
  'replaceBlank' = 'replaceBlank', // 挖空
  'insertBlank' = 'insertBlank', // 插空
  'mathJax' = 'mathJax', // 数学公式
}

const placeholder = {
  label: '+ 插入',
  value: InsertTypeEnum.none,
}

// select options
const options = [
  {
    label: '简单表格',
    value: InsertTypeEnum.table,
  },
  {
    label: '插空',
    value: InsertTypeEnum.insertBlank,
  },
  {
    label: '挖空',
    value: InsertTypeEnum.replaceBlank,
  },
  {
    label: '数学公式',
    value: InsertTypeEnum.mathJax,
  },
]

const WhitePlugins = [InsertTypeEnum.table]

const optionHandle = (
  option: typeof placeholder,
  plugins?: PluginsType
): boolean => {
  switch (option.value) {
    case InsertTypeEnum.insertBlank:
      return PluginHandle.hasInsertBlankPlugin(plugins)
    case InsertTypeEnum.replaceBlank:
      return PluginHandle.hasReplaceBlankPlugin(plugins)
    case InsertTypeEnum.mathJax:
      return PluginHandle.hasMathJaxPlugin(plugins)
    default:
      return WhitePlugins.includes(option.value)
  }
}

export const initInsertOptions = (plugins?: PluginsType) => {
  const pluginKeys = plugins ? Object.keys(plugins) : []
  if (!pluginKeys?.length) {
    return []
  }

  let result = [...options.filter(option => optionHandle(option, plugins))]

  if (result?.length) {
    result.unshift(placeholder)
  } else {
    result = []
  }

  return result
}
