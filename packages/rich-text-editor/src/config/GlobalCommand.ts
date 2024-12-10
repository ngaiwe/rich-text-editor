import { createCommand, LexicalCommand } from 'lexical';
import { ImagePayload } from '../nodes/ImageNode';
import { InsertBlankPayload } from '../nodes/InsertBlankNode';
import { ReplaceBlankNodeHandleEnum } from '../nodes/ReplaceBlankNode/ReplaceBlankComponent';
import { TablePluginCommandType } from '../plugins/TableModalPlugin';

// 点击事件超出内容区
export const CLICK_OUTSIDE_ROOT_COMMAND: LexicalCommand<boolean> = createCommand(
  'CLICK_OUTSIDE_ROOT_COMMAND',
);

// image node 参数
export type InsertImagePayload = Readonly<ImagePayload>;
// 图片插入 command
export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND');
// 图片替换 command
export const REPLACW_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand('REPLACW_IMAGE_COMMAND');

// 插空 node 参数
export enum InsertHandlePayloadTypeEnum {
  'ADD' = 'ADD',
  'REMOVE' = 'REMOVE',
  'CUT' = 'CUT',
}
// 插空改变发布订阅参数
export interface InsertBlankChangePayloadType {
  type: InsertHandlePayloadTypeEnum;
}
// 插空 command
export const INSERT_BLANK_COMMAND: LexicalCommand<InsertBlankPayload> =
  createCommand('INSERT_BLANK_COMMAND');
// 插空增加 | 删除等操作
export const INSERT_BLANK_CHANGE_COMMAND: LexicalCommand<InsertBlankChangePayloadType> =
  createCommand('INSERT_BLANK_CHANGE_COMMAND');

// 挖空 node 参数
export interface ReplaceBlankNodePayload {
  nodeKey: string;
  text?: string;
  status: ReplaceBlankNodeHandleEnum;
}
// 挖空 command
export const REPLACE_BLANK_COMMAND: LexicalCommand<undefined> =
  createCommand('REPLACE_BLANK_COMMAND');
export const REPLACE_BLANK_CHANGE_COMMAND: LexicalCommand<undefined> = createCommand(
  'REPLACE_BLANK_CHANGE_COMMAND',
);

// 插入表格 Command
export const EDU_INSERT_TABLE_COMMAND: LexicalCommand<TablePluginCommandType> = createCommand(
  'EDU_INSERT_TABLE_COMMAND',
);

export interface INSERT_MATHJAX_MODAL_PARAMS {
  attrMathJax?: string;
  nodeKey?: string;
}
// 插入数学公式 Command
export const EDU_INSERT_MATHJAX_MODAL_COMMAND: LexicalCommand<INSERT_MATHJAX_MODAL_PARAMS> =
  createCommand('EDU_INSERT_MATHJAX_MODAL_COMMAND');

export interface ReplaceBlankNodePayload {
  nodeKey: string;
  text?: string;
  status: ReplaceBlankNodeHandleEnum;
}

export interface FormatPayload {
  formats?: string[];
}

// 清除格式 command
export const CLEAR_FORMATTING: LexicalCommand<FormatPayload | undefined> =
  createCommand('CLEAR_FORMATTING');
