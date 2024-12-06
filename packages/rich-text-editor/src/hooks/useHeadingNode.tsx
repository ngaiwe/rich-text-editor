import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'
import {$isHeadingNode} from '@lexical/rich-text'
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import {useEffect, useState} from 'react'

const useHeadingNode = () => {
  const [editor] = useLexicalComposerContext()
  // 当前选中的节点是否是标题节点
  const [isHeadingNode, setiIsHeadingNode] = useState(false)

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const element = selection.anchor.getNode()
          const parentNode = element.getParentOrThrow()
          setiIsHeadingNode($isHeadingNode(parentNode))
        }
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [editor])

  return [isHeadingNode]
}

export default useHeadingNode
