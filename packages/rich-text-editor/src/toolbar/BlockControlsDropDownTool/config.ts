export const BlockControls = {
  normal: 'normal',
  bullet: 'bullet',
  number: 'number',
  check: 'check',
  h1: 'h1',
  h2: 'h2',
  quote: 'quote',
}

export const OPTIONS = [
  {
    label: '默认模式',
    value: BlockControls.normal,
  },
  {
    label: 'H1 标题',
    value: BlockControls.h1,
  },
  {
    label: 'H2 标题',
    value: BlockControls.h2,
  },
  {
    label: '引用文本',
    value: BlockControls.quote,
  },
  {
    label: '无序列表',
    value: BlockControls.bullet,
  },
  {
    label: '有序列表',
    value: BlockControls.number,
  },
]
