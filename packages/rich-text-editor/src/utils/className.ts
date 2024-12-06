// 编辑器默认 className 标识
export const CLASSNAMETAG = 'eduEditor'

// className 统一添加方法
// addClassName(['up', 'down]) => "eduEditor-up eduEditor-down"
export function addClassName(
  classNames: string[] = [],
  classNameTag: string = CLASSNAMETAG,
) {
  if (!classNames?.length) {
    return ''
  }

  return classNames.map(name => `${classNameTag}_${name}`).join(' ')
}

// 默认主题前缀
const CLASSNAMETHEMETAG = 'eduEditorTheme'
// 统一主题 classname 方法
// addClassNameTheme('text-underline') => "EditorTheme__text-underline"
export function addClassNameTheme(
  className: string,
  classNameTag: string = CLASSNAMETHEMETAG,
) {
  if (!className) {
    return ''
  }

  return `${CLASSNAMETHEMETAG}__${className}`
}
