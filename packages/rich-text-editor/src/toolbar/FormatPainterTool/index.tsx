// 工作栏 - 格式刷控件
import {FormatPainterOutlined} from '@ant-design/icons'
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list'
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'
import {
  $getNearestBlockElementAncestorOrThrow,
  mergeRegister,
} from '@lexical/utils'
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  ElementFormatType,
} from 'lexical'
import React, {useCallback, useEffect, useState} from 'react'
import {DEFAULT_ANTD_COMPONENT_SIZE} from '../../config/AntdUiConfig'
import {CLICK_OUTSIDE_ROOT_COMMAND} from '../../config/GlobalCommand'
import {$isExtendedTextNode} from '../../nodes/ExtendedTextNode'
import ToolButton from '../../ui/ToolButton'
import {BlockControls} from '../BlockControlsDropDownTool/config'

const FormatPainterTool = () => {
  const [editor] = useLexicalComposerContext()

  const [active, setActive] = useState(false)
  const [formateType, setFormateType] = useState<ElementFormatType>('')
  const [textFormate, setTextFormate] = useState<number>(0)
  const [style, setStyle] = useState<string>('')
  const [blockTyoe, setBlockType] = useState('')

  useEffect(() => {
    if (active) {
      return undefined
    }

    setFormateType('')
    setTextFormate(0)
    setStyle('')
    setBlockType('')
  }, [active])

  const touchButtonCallback = useCallback(
    (event: React.MouseEvent) => {
      // 复制格式
      event?.preventDefault()
      event?.stopPropagation()

      editor.update(() => {
        // 点击格式刷复制格式
        const selection = $getSelection()

        if (!$isRangeSelection(selection)) {
          return false
        }

        const {focus, anchor} = selection

        if (focus?.getNode?.()?.canBeEmpty?.()) {
          return false
        }

        const sourceNode = selection.isBackward()
          ? focus?.getNode()
          : anchor?.getNode()

        const neareParagrapNode = $getNearestBlockElementAncestorOrThrow(
          focus?.getNode()
        )
        setFormateType(neareParagrapNode.getFormatType())

        const topParagrapNode = sourceNode.getTopLevelElementOrThrow()
        if ($isListNode(topParagrapNode)) {
          setBlockType(topParagrapNode.getListType())
        }

        // 复制 style 格式
        setStyle(sourceNode.getStyle())

        // 复制字体格式
        setTextFormate(sourceNode.__format)

        setActive(true)
      })
    },
    [editor]
  )

  // 更新有序 / 无序格式
  const updateBlockControl = useCallback(() => {
    switch (blockTyoe) {
      case BlockControls.bullet:
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        break
      case BlockControls.number:
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        break
      default:
        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }, [blockTyoe, editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_OUTSIDE_ROOT_COMMAND,
        payload => {
          active && !payload && setActive(payload)
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload, activeEditor) => {
          if (!active) {
            return false
          }

          // 粘贴有序/无序格式
          updateBlockControl()

          activeEditor.update(() => {
            const selection = $getSelection()

            if (!$isRangeSelection(selection)) {
              return false
            }

            const nodes = selection.extract()

            if (selection.isCollapsed()) {
              // 未选中任何节点状态，粘贴段落格式
              const paragrapNode = $getNearestBlockElementAncestorOrThrow(
                selection.focus?.getNode()
              )
              paragrapNode?.setFormat(formateType)
            } else {
              nodes.forEach(node => {
                if ($isExtendedTextNode(node) || $isTextNode(node)) {
                  node?.setFormat(textFormate)
                  node?.setStyle(style)

                  const parent = node.getParent()
                  const status =
                    parent?.getFirstChild?.()?.is?.(nodes[0]) &&
                    parent?.getLastChild?.()?.is?.(nodes[nodes.length - 1])

                  if (status) {
                    parent?.setFormat?.(formateType)
                  }

                  return false
                }

                node?.setFormat?.(formateType)
              })
            }

            setActive(false)
          })

          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [
    active,
    blockTyoe,
    editor,
    formateType,
    style,
    textFormate,
    updateBlockControl,
  ])

  return (
    <div>
      <ToolButton
        active={active}
        type="text"
        size={DEFAULT_ANTD_COMPONENT_SIZE}
        disabled={!editor.isEditable()}
        onClick={active ? () => setActive(false) : touchButtonCallback}
      >
        <FormatPainterOutlined />
      </ToolButton>
    </div>
  )
}

export {FormatPainterTool}
