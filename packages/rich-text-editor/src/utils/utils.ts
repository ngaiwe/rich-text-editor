type Func = () => void;

export const isString = (prop: unknown): boolean => {
  return Object.prototype.toString.call(prop) === '[object String]';
};

export function mergeRegister(...func: Func[]): () => void {
  return () => {
    func.forEach(f => f());
  };
}

export const getTypeFromObject = async (
  clipboardData: DataTransfer | ClipboardItem,
  type: string,
): Promise<string> => {
  try {
    return clipboardData instanceof DataTransfer
      ? clipboardData.getData(type)
      : clipboardData instanceof ClipboardItem
        ? await (await clipboardData.getType(type)).text()
        : '';
  } catch {
    return '';
  }
};
