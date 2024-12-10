import { addClassNameTheme } from '../utils/className';

// 图片上传最大尺寸
export const MAX_IMAGE_SIZE = 1024 * 1024 * 5;
export const MAX_IMAGE_SIZE_TEXT = '5M';
export const IMAGE_TYPE_WHITE = ['image/png', 'image/jpg', 'image/jpeg'];

// 自定义组件表示Key
export const CUSTOMIZE_ATTRIBUTE_TYPE = 'zh-tag-type';

// 默认空标签
export const EMPTY_HTMLSTRING = `<p class="${addClassNameTheme('paragraph')}"><br></p>`;
