import {Rule} from 'antd/es/form'
import mapValues from 'lodash/mapValues'

interface defaultFormConfigTypf {
  [key: string]: {
    defaultValue: number
    rules: Rule[]
  }
}

export const DEFAULT_FORM_ID = 'BasicTable'

export const DEFAULT_FORM_CONFIG: defaultFormConfigTypf = {
  rows: {
    defaultValue: 5,
    rules: [
      {required: true, message: '请输入行数'},
      {min: 1, message: '不得小于 1 行', type: 'number'},
    ],
  },
  columns: {
    defaultValue: 5,
    rules: [
      {required: true, message: '请输入列数'},
      {min: 1, message: '不得小于 1 列', type: 'number'},
    ],
  },
}

export const DEFAULT_FORM_VALUE = mapValues(
  DEFAULT_FORM_CONFIG,
  'defaultValue'
) as unknown as number[]
