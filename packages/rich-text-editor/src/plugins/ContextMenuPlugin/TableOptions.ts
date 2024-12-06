import {
  $isRangeSelection,
  GridSelection,
  LexicalEditor,
  NodeSelection,
  RangeSelection,
} from 'lexical'
import ContextMenuOption from './ContextMemuOption'
// eslint-disable-next-line camelcase
import {
  $deleteTableColumn__EXPERIMENTAL,
  $deleteTableRow__EXPERIMENTAL,
  $getTableCellNodeFromLexicalNode,
  $insertTableColumn__EXPERIMENTAL,
  $insertTableRow__EXPERIMENTAL,
} from '@lexical/table'

export function isTableNode(
  activeEditor: LexicalEditor,
  editorSelection:
    | RangeSelection
    | NodeSelection
    | GridSelection
    | null
    | undefined
) {
  if ($isRangeSelection(editorSelection)) {
    const tableCellNodeFromSelection = $getTableCellNodeFromLexicalNode(
      editorSelection.anchor.getNode()
    )

    if (tableCellNodeFromSelection == null) {
      return false
    }

    const tableCellParentNodeDOM = activeEditor.getElementByKey(
      tableCellNodeFromSelection.getKey()
    )

    if (tableCellParentNodeDOM === null) {
      return false
    }

    return true
  }

  return false
}

export default (editor: LexicalEditor) => [
  new ContextMenuOption('在上方插一行', {
    onSelect: _node => {
      editor.update(() => {
        $insertTableRow__EXPERIMENTAL(false)
      })
    },
  }),
  new ContextMenuOption('在下方插一行', {
    onSelect: _node => {
      editor.update(() => {
        $insertTableRow__EXPERIMENTAL(true)
      })
    },
  }),
  new ContextMenuOption('在左边插一列', {
    onSelect: _node => {
      editor.update(() => {
        $insertTableColumn__EXPERIMENTAL(false)
      })
    },
  }),
  new ContextMenuOption('在右边插一列', {
    onSelect: _node => {
      editor.update(() => {
        $insertTableColumn__EXPERIMENTAL(true)
      })
    },
  }),
  new ContextMenuOption('删除当前行', {
    onSelect: _node => {
      editor.update(() => {
        $deleteTableRow__EXPERIMENTAL()
      })
    },
  }),
  new ContextMenuOption('删除当前列', {
    onSelect: _node => {
      editor.update(() => {
        $deleteTableColumn__EXPERIMENTAL()
      })
    },
  }),
]
