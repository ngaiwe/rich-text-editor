import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'
import {useLexicalNodeSelection} from '@lexical/react/useLexicalNodeSelection'
import {mergeRegister} from '@lexical/utils'
import {
  $getNodeByKey,
  $getSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  CUT_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  NodeKey,
} from 'lexical'
import {useCallback, useEffect, useRef} from 'react'

import {$isInsertBlankNode} from '.'
import {
  InsertHandlePayloadTypeEnum,
  INSERT_BLANK_CHANGE_COMMAND,
} from '../../config/GlobalCommand'
import './InsertBlank.less'

export enum InsertBlankNodeHandleEnum {
  'ADD' = 'ADD',
  'REMOVE' = 'REMOVE',
}

export type InsertBlankNodeHandleType =
  | InsertBlankNodeHandleEnum.ADD
  | InsertBlankNodeHandleEnum.REMOVE

export interface InsertBlankHandlePayload {
  nodeKey: string
  status: InsertBlankNodeHandleType
}

export interface InsertBlankComponentPropsType {
  nodeKey: NodeKey
  index: number
}

const InsertBlankComponent = ({
  nodeKey,
  index,
}: InsertBlankComponentPropsType) => {
  const [editor] = useLexicalComposerContext()

  const blankRef = useRef<null | HTMLSpanElement>(null)
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)

  useEffect(() => {
    editor.dispatchCommand(INSERT_BLANK_CHANGE_COMMAND, {
      type: InsertHandlePayloadTypeEnum.ADD,
    })
  }, [editor, nodeKey])

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      const event: KeyboardEvent = payload
      event.preventDefault()

      // if (isSelected && $getSelection()?.getNodes()?.find(node => node.getKey() === nodeKey)) {
      //   editor.update(() => {
      //     const node = $getNodeByKey(nodeKey);

      //     if ($isInsertBlankNode(node)) {
      //       node.remove();
      //     }

      //     editor.dispatchCommand(INSERT_BLANK_CHANGE_COMMAND, {
      //       type: InsertHandlePayloadTypeEnum.REMOVE
      //     })
      //   })
      // } else {
      //   editor.update(() => {
      //     const node = $getNodeByKey(nodeKey)

      //     if (!node?.isAttached() && node?.isDirty()) {
      //       editor.dispatchCommand(INSERT_BLANK_CHANGE_COMMAND, {
      //         type: InsertHandlePayloadTypeEnum.REMOVE
      //       })
      //     }
      //   })
      // }

      editor.update(() => {
        if (
          isSelected &&
          $getSelection()
            ?.getNodes()
            ?.find(node => node.getKey() === nodeKey)
        ) {
          const node = $getNodeByKey(nodeKey)
          if ($isInsertBlankNode(node)) {
            node.remove()
          }
          editor.dispatchCommand(INSERT_BLANK_CHANGE_COMMAND, {
            type: InsertHandlePayloadTypeEnum.REMOVE,
          })
        } else {
          const node = $getNodeByKey(nodeKey)
          if (!node?.isAttached() && node?.isDirty()) {
            editor.dispatchCommand(INSERT_BLANK_CHANGE_COMMAND, {
              type: InsertHandlePayloadTypeEnum.REMOVE,
            })
          }
        }
      })

      return false
    },
    [editor, isSelected, nodeKey]
  )

  const onCut = useCallback(
    (payload: KeyboardEvent) => {
      const event: KeyboardEvent = payload
      event.preventDefault()
      // if (isSelected && $getSelection()?.getNodes()?.find(node => node.getKey() === nodeKey)) {
      //   editor.update(() => {
      //     const node = $getNodeByKey(nodeKey)

      //     if ($isInsertBlankNode(node)) {
      //       node.markDirty()
      //     }

      //     editor.dispatchCommand(INSERT_BLANK_CHANGE_COMMAND, {
      //       type: InsertHandlePayloadTypeEnum.CUT
      //     })
      //   })
      // }

      editor.update(() => {
        if (
          isSelected &&
          $getSelection()
            ?.getNodes()
            ?.find(node => node.getKey() === nodeKey)
        ) {
          const node = $getNodeByKey(nodeKey)
          if ($isInsertBlankNode(node)) {
            node.markDirty()
          }
          editor.dispatchCommand(INSERT_BLANK_CHANGE_COMMAND, {
            type: InsertHandlePayloadTypeEnum.CUT,
          })
        }
      })

      return false
    },
    [editor, isSelected, nodeKey]
  )

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        payload => {
          const event = payload
          if (event.target === blankRef.current) {
            if (event.shiftKey) {
              setSelected(!isSelected)
            } else {
              clearSelection()
              setSelected(true)
            }
            return true
          }

          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(CUT_COMMAND, onCut, COMMAND_PRIORITY_HIGH)
    )
  }, [clearSelection, editor, isSelected, onCut, onDelete, setSelected])

  return (
    <span
      ref={blankRef}
      className={`insertBlank ${isSelected ? 'focused' : ''}`}
    >
      {index >= 0 ? index + 1 : ''}
    </span>
  )
}

export default InsertBlankComponent
