import type {EditorThemeClasses} from 'lexical'

import './EditorTheme.less'

import {addClassNameTheme} from '../utils/className'

const theme: EditorThemeClasses = {
  text: {
    bold: addClassNameTheme('text-bold'),
    italic: addClassNameTheme('text-italic'),
    underline: addClassNameTheme('text-underline'),
    underlineStrikethrough: addClassNameTheme('text-underline-strikethrough'),
  },
  list: {
    listitem: addClassNameTheme('list_item'),
    listitemChecked: addClassNameTheme('list_item_checked'),
    listitemUnchecked: addClassNameTheme('list_item_unchecked'),
    nested: {
      listitem: addClassNameTheme('nested_list_item'),
    },
    olDepth: [
      addClassNameTheme('ol1'),
      addClassNameTheme('ol2'),
      addClassNameTheme('ol3'),
      addClassNameTheme('ol4'),
      addClassNameTheme('ol5'),
    ],
    ul: addClassNameTheme('ul'),
  },
  heading: {
    h1: addClassNameTheme('h1'),
    h2: addClassNameTheme('h2'),
  },
  quote: addClassNameTheme('quote'),
  ltr: addClassNameTheme('ltr'),
  rtl: addClassNameTheme('rtl'),
  paragraph: addClassNameTheme('paragraph'),
  table: addClassNameTheme('table'),
  tableAddColumns: addClassNameTheme('table_add_columns'),
  tableAddRows: addClassNameTheme('table_add_rows'),
  tableCell: addClassNameTheme('table_cell'),
  tableCellActionButton: addClassNameTheme('table_cell_action_button'),
  tableCellActionButtonContainer: addClassNameTheme(
    'table_cell_action_button_container',
  ),
  tableCellEditing: addClassNameTheme('table_cell_editing'),
  tableCellHeader: addClassNameTheme('table_cell_header'),
  tableCellPrimarySelected: addClassNameTheme('table_cell_primary_selected'),
  tableCellResizer: addClassNameTheme('table_cell_resizer'),
  tableCellSelected: addClassNameTheme('table_cell_selected'),
  tableCellSortedIndicator: addClassNameTheme('table_cell_sorted_indicator'),
  tableResizeRuler: addClassNameTheme('table_cell_resize_ruler'),
  tableSelected: addClassNameTheme('table_selected'),
  tableSelection: addClassNameTheme('table_selection'),
  image: addClassNameTheme('image'),
  indent: addClassNameTheme('indent'),
  insertBlank: addClassNameTheme('insertBlank'),
  replaceBlank: addClassNameTheme('replaceBlank'),
}

export default theme
