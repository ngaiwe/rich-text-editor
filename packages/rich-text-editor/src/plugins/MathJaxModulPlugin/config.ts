import {Rule} from 'antd/es/form'
import mapValues from 'lodash/mapValues'

export const CLASSNAME_TAG = 'mathjax-modul-plugin'

interface defaultFormConfigTypf {
  [key: string]: {
    defaultValue: string
    rules: Rule[]
  }
}

export const DEFAULT_FORM_ID = 'BasicMathModal'

export const DEFAULT_FORM_CONFIG: defaultFormConfigTypf = {
  mathText: {
    defaultValue: '',
    rules: [{required: true, message: '请输入公式'}],
  },
}

export const DEFAULT_FORM_VALUE = mapValues(
  DEFAULT_FORM_CONFIG,
  'defaultValue'
) as unknown as number[]
