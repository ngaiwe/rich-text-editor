import transform from 'lodash/transform';

const UUID = 'EDUEDITOR';
const DEFAULT_STORAGE_EXPIRE_KEY = 'STORAGE_EXPIRE_KEY';
const DEFAULT_USER_USED_COLOR_MAX = 20;

const STORAGE_KEY = transform(
  {
    USER_USED_FONTCOLOR: 'USER_USED_FONTCOLOR', // 用户最近使用的字体颜色
    USER_USED_FONTBDCOLOR: 'USER_USED_FONTBDCOLOR', // 用户最近使用的背景色
  },
  (result: Record<string, string>, value, key) => {
    result[key] = `${UUID}_${value}`;
  },
);

export enum STORAGE_KEY_ENUM {
  'USER_USED_FONTCOLOR' = 'USER_USED_FONTCOLOR',
  'USER_USED_FONTBDCOLOR' = 'USER_USED_FONTBDCOLOR',
}

// 用户选择颜色参数
interface UserUsedColorParamsType {
  color: string;
  type: string; // 字体颜色 || 背景色
  expire?: number;
}

export class StorageUtils {
  private static __instance: StorageUtils | null = null;

  public static getInstance() {
    if (this.__instance == null) {
      this.__instance = new StorageUtils();
      this.__instance.__init();
    }
    return this.__instance;
  }

  private __init() {
    // 定时清除真题 storage
  }

  // 获取用户使用的字体&背景色颜色
  public getUserUsedColor(type: string): string[] | undefined {
    if (!STORAGE_KEY[type]) {
      return undefined;
    }

    const storage = window.localStorage.getItem(STORAGE_KEY[type]);

    if (!storage) {
      return undefined;
    }

    // 获取过期时间
    const timestamp = +new Date();
    const expire = JSON.parse(storage)[DEFAULT_STORAGE_EXPIRE_KEY];

    if (expire && timestamp - expire >= 0) {
      // 已过期
      window.localStorage.removeItem(STORAGE_KEY[type]);
      return undefined;
    }

    // 过期时间未设置，且未过期
    return JSON.parse(storage)?.colors;
  }

  // 设置用户使用的字体颜色
  public setUserUsedColor(params: UserUsedColorParamsType): string[] {
    if (!params.type) {
      return [];
    }

    const colors = this.getUserUsedColor(params.type) ?? [];

    if (params?.color) {
      colors.unshift(params?.color);
    }

    const storage = {
      colors: [...new Set(colors)].slice(0, DEFAULT_USER_USED_COLOR_MAX),
      [DEFAULT_STORAGE_EXPIRE_KEY]: params?.expire,
    };

    window.localStorage.setItem(STORAGE_KEY[params.type], JSON.stringify(storage));

    return colors;
  }
}
