import {useEffect, useState} from 'react'

import {
  GridSelection,
  LexicalEditor,
  NodeSelection,
  RangeSelection,
} from 'lexical'
import ContextMenuOption from './ContextMemuOption'
import DefaultOptions from './DefaultOptions'
import TableOptions, {isTableNode} from './TableOptions'

export default function useOptions(
  activeEditor: LexicalEditor,
  editorSelection:
    | RangeSelection
    | NodeSelection
    | GridSelection
    | null
    | undefined
) {
  const [options, setOptions] = useState<ContextMenuOption[]>([])

  useEffect(() => {
    activeEditor.update(() => {
      if (isTableNode(activeEditor, editorSelection)) {
        setOptions(TableOptions(activeEditor))
      } else {
        setOptions(DefaultOptions(activeEditor))
      }
    })
  }, [activeEditor, editorSelection])

  return options
}
