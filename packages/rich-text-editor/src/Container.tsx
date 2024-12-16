import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { useCallback, useContext, useEffect } from 'react';

import TableCellResizerPlugin from './plugins/TableCellResizerPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';

import ContentEditable from './ui/ContentEditable';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { EditorState, LexicalEditor } from 'lexical';
import { EDITOR_CHANGE_COMMAND } from './config/EditorCommand';
import { EMPTY_HTMLSTRING } from './config/GlobalConstant';
import { EditorContext } from './context/EditorContext';
import { EditorConfigType } from './Editor';
import { ListenerType } from './EditorReducer';
import { EditorParser } from './parser';
import ContextMenuPlugin from './plugins/ContextMenuPlugin';
import { TabIndentationPlugin } from './plugins/TabIndentationPlugin';
import TableModalPlugin from './plugins/TableModalPlugin';
import { addClassName } from './utils/className';

const classNameTag = 'container';

export interface EditorChangeParamsType {
  htmlString: string;
}

interface EditorPropsType {
  config?: EditorConfigType;
  plugins?: EditorPluginConfig[];
  onChange?: ListenerType;
}

const EditorContainer = (props: EditorPropsType) => {
  const { config } = props;
  const [editor] = useLexicalComposerContext();
  const { dispatchCommandsMap } = useContext(EditorContext);

  useEffect(() => {
    editor.setEditable(config?.editable ?? true);
  }, [editor, config]);

  const onChange = useCallback(
    (editorState: EditorState, editor: LexicalEditor) => {
      editor.update(() => {
        if (!dispatchCommandsMap) {
          return;
        }

        const htmlString = EditorParser.getInstance().parserLexicalDomTreeToHTMLString(editor);

        const params = {
          htmlString: htmlString === EMPTY_HTMLSTRING ? '' : htmlString,
        };

        dispatchCommandsMap({
          type: 'DISPATCH',
          payload: {
            command: EDITOR_CHANGE_COMMAND,
            params: params,
          },
        });

        props?.onChange?.(params);
      });
    },
    [dispatchCommandsMap, props],
  );

  return (
    <>
      {/* 顶部工具栏 */}
      <ToolbarPlugin plugins={config?.plugins} />

      <AutoFocusPlugin />
      <ClearEditorPlugin />
      <HistoryPlugin />
      <TabIndentationPlugin />

      {/* 富文本内容区 */}
      <RichTextPlugin
        contentEditable={
          <div className={addClassName([`${classNameTag}-scroller`])}>
            <div className={addClassName([`${classNameTag}-scroller-content`])}>
              <ContentEditable />
            </div>
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
        placeholder={null}
      />

      <ListPlugin />
      <TablePlugin />
      <TableModalPlugin />
      <TableCellResizerPlugin />

      {/* change 插件 */}
      <OnChangePlugin onChange={onChange} />

      {/* 右键菜单插件 */}
      <ContextMenuPlugin />
    </>
  );
};

export { EditorContainer };
