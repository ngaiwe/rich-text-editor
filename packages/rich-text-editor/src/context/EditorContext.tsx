import React, {createContext, useReducer} from 'react'
import {CommandReducer, CommandStateType} from '../EditorReducer'

export interface EditorContextType {
  commandsMap: CommandStateType
  dispatchCommandsMap: React.Dispatch<
    React.ReducerAction<typeof CommandReducer>
  >
}

export interface EditorContextPropsType {
  children?: JSX.Element
}

export const EditorContext = createContext<Partial<EditorContextType>>({})

export const EditorContextPrivider = (props: EditorContextPropsType) => {
  const [commandsMap, dispatchCommandsMap] = useReducer(
    CommandReducer,
    new Map(),
  )

  return (
    <EditorContext.Provider
      value={{
        commandsMap,
        dispatchCommandsMap,
      }}
    >
      {props.children}
    </EditorContext.Provider>
  )
}
