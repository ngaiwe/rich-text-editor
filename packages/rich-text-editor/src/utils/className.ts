// 编辑器默认 className 标识
export const CLASSNAMETAG = 'editor';

// className 统一添加方法
// addClassName(['up', 'down]) => "editor-up editor-down"
export function addClassName(
  classNames: Array<string | undefined> = [],
  classNameTag: string = CLASSNAMETAG,
) {
  if (!classNames?.length) {
    return '';
  }

  return classNames
    .filter(name => name)
    .map(name => `${classNameTag}_${name}`)
    .join(' ');
}

// 默认主题前缀
const CLASSNAMETHEMETAG = 'editorTheme';
// 统一主题 classname 方法
// addClassNameTheme('text-underline') => "EditorTheme__text-underline"
export function addClassNameTheme(className: string, classNameTag: string = CLASSNAMETHEMETAG) {
  if (!className) {
    return '';
  }

  return `${CLASSNAMETHEMETAG}__${className}`;
}
