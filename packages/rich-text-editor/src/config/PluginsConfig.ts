import {UploadPropsType} from '../toolbar/UploadImageTool'

// 插空
export const INSERT_BLANK_PLUGIN_CONFIG = 'INSERT_BLANK_PLUGIN_CONFIG'
// 挖空
export const REPLACE_BLANK_PLUGIN_CONFIG = 'REPLACE_BLANK_PLUGIN_CONFIG'
// 图片上传
export const UPLOAD_IMAGE_PLUGIN_CONFIG = 'UPLOAD_IMAGE_PLUGIN_CONFIG'
// 调试插件
export const TREE_VIEW_DEBUG_PLUGIN_CONFIG = 'TREE_VIEW_DEBUG_PLUGIN_CONFIG'
// 数学公式插件
export const MATH_JAX_PLUGIN_CONFIG = 'MATH_JAX_PLUGIN_CONFIG'

export interface PluginsType {
  [UPLOAD_IMAGE_PLUGIN_CONFIG]?: UploadPropsType
  [INSERT_BLANK_PLUGIN_CONFIG]?: unknown
  [REPLACE_BLANK_PLUGIN_CONFIG]?: unknown
  [TREE_VIEW_DEBUG_PLUGIN_CONFIG]?: unknown
  [MATH_JAX_PLUGIN_CONFIG]?: unknown
}

const isExist = (name: string, plugins?: PluginsType) => {
  const pluginKeys = plugins ? Object.keys(plugins) : []
  if (!pluginKeys?.length) {
    return false
  }

  return pluginKeys.some(plugin => plugin === name)
}

const hasMakeBlankPlugin = (plugins?: PluginsType) => {
  return (
    isExist(INSERT_BLANK_PLUGIN_CONFIG, plugins) ||
    isExist(REPLACE_BLANK_PLUGIN_CONFIG, plugins)
  )
}

const hasInsertBlankPlugin = (plugins?: PluginsType) => {
  return isExist(INSERT_BLANK_PLUGIN_CONFIG, plugins)
}

const hasReplaceBlankPlugin = (plugins?: PluginsType) => {
  return isExist(REPLACE_BLANK_PLUGIN_CONFIG, plugins)
}

const hasUploadImagePlugin = (plugins?: PluginsType) => {
  return isExist(UPLOAD_IMAGE_PLUGIN_CONFIG, plugins)
}

const hasTreeViedDebugPlugin = (plugins?: PluginsType) => {
  return isExist(TREE_VIEW_DEBUG_PLUGIN_CONFIG, plugins)
}

const hasMathJaxPlugin = (plugins?: PluginsType) => {
  return isExist(MATH_JAX_PLUGIN_CONFIG, plugins)
}

export const PluginHandle = {
  hasMakeBlankPlugin,
  hasUploadImagePlugin,
  hasInsertBlankPlugin,
  hasReplaceBlankPlugin,
  hasTreeViedDebugPlugin,
  hasMathJaxPlugin,
}

export const Plugins = {
  INSERT_BLANK_PLUGIN_CONFIG,
  REPLACE_BLANK_PLUGIN_CONFIG,
  UPLOAD_IMAGE_PLUGIN_CONFIG,
  TREE_VIEW_DEBUG_PLUGIN_CONFIG,
  MATH_JAX_PLUGIN_CONFIG,
}
