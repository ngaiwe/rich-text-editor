// 富文本插件对业务暴露的 Command
export function createCommand(type: string) {
  return {type}
}

export type CommandType = ReturnType<typeof createCommand>

// 富文本改变
export const EDITOR_CHANGE_COMMAND = createCommand('EDITOR_CHANGE_COMMAND')

// 插空改变
export const INSERTBLANK_CHANGE_COMMAND = createCommand(
  'INSERTBLANK_CHANGE_COMMAND'
)

// 挖空改变
export const REPLACEBLANK_CHANGE_COMMAND = createCommand(
  'REPLACEBLANK_CHANGE_COMMAND'
)
