import { Reducer } from 'react';
import { CommandType } from './config/EditorCommand';

export type ListenerType = (params: Record<string, unknown>) => void;

export type CommandStateType = Map<CommandType, Set<ListenerType>>;

export interface RegisterActionType {
  type: 'REGISTER';
  payload: {
    command: CommandType;
    listener: ListenerType;
  };
}

export interface DispatchActionType {
  type: 'DISPATCH';
  payload: {
    command: CommandType;
    params: Record<string, unknown>;
  };
}

export type CommandActionsType = RegisterActionType | DispatchActionType;

export const CommandReducer: Reducer<CommandStateType, CommandActionsType> = (
  state,
  action,
): CommandStateType => {
  const { command } = action.payload;

  const result: CommandStateType = new Map(state);

  switch (action.type) {
    case 'REGISTER':
      // 注册 command
      if (!result.has(command)) {
        result.set(command, new Set());
      }

      result.get(command)?.add(action.payload.listener);

      return result;
    case 'DISPATCH':
      // 触发回调
      if (!result.has(command)) {
        return state;
      }

      result.get(command)?.forEach(listener => listener(action.payload.params));
      return state;
    default:
      return state;
  }
};
