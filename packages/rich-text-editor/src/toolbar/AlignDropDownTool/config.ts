export const AlignMap = new Map([
  ['left', '左对齐'],
  ['center', '居中对齐'],
  ['right', '右对齐'],
])

export const DEFAULT_ALIGN_TYPE = 'left'

export const AlignType = new Set(AlignMap.keys())

export const OPTIONS = [...AlignMap.entries()].map(
  ([key, value]: string[]) => ({
    label: value,
    value: key,
  })
)
