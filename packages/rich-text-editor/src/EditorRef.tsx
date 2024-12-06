// 富文本 Ref 代理容器
import {forwardRef, useContext, useImperativeHandle} from 'react'
import {CommandType} from './config/EditorCommand'
import {EditorContext} from './context/EditorContext'
import {ListenerType} from './EditorReducer'

export type RegisterCommandType = (
  command: CommandType,
  listener: ListenerType,
) => () => void

export interface EditorRefProxyContainerPropsType {
  children?: JSX.Element
}

export interface EditorRefProxyContainerType {
  registerCommand: RegisterCommandType
}

export const EditorRefProxyContainer = forwardRef<
  EditorRefProxyContainerType,
  EditorRefProxyContainerPropsType
>((props, ref) => {
  const {commandsMap, dispatchCommandsMap} = useContext(EditorContext)

  useImperativeHandle(
    ref,
    () => ({
      registerCommand(command, listener) {
        if (commandsMap && dispatchCommandsMap) {
          dispatchCommandsMap({
            type: 'REGISTER',
            payload: {
              command,
              listener,
            },
          })
        }

        return () => {
          if (commandsMap) {
            commandsMap.get(command)?.delete(listener)
          }
        }
      },
    }),
    [commandsMap],
  )

  return <>{props.children}</>
})
