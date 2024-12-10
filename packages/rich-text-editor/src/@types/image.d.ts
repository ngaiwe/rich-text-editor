// https://crm.zhihu.com/api/odin/upload_image 接口返回图片数据格式
export interface UplaodImageResponseType {
  filename: string; // 文件名
  format: string; // 格式
  full_url: string; // 图片地址
  height: number; // 原始高度
  size: number; // 图片大小
  token: string;
  width: number; // 原始宽度
}
