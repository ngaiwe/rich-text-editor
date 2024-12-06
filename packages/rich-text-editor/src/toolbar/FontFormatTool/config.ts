import {TextFormatType} from 'lexical'

// 扩展字体格式
export type FontFormatExpandType = 'reset'

export type FontFormatType = FontFormatExpandType | TextFormatType

// 字体格式化对应 Type 枚举
export enum FontFormatTypeEnum {
  'reset' = 'reset',
  'bold' = 'bold',
  'italic' = 'italic',
  'underline' = 'underline',
}

// 字体格式对应 style 枚举
export enum FontFormatStyleEnum {
  'underline' = 'text-decoration',
}

// 字体格式化对应 Value 枚举
export enum FontFormatTextEnum {
  'reset' = '清除格式',
  'bold' = '加粗',
  'italic' = '倾斜',
  'underline' = '下划线',
}

// 需要被禁用标题的字体格式
export const HeadingDisabledFormats: (
  | keyof typeof FontFormatTypeEnum
  | TextFormatType
)[] = [FontFormatTypeEnum.bold]
