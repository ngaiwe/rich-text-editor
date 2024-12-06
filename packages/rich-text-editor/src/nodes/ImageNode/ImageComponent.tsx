import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import './ImageNode.less'

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'
import {useLexicalNodeSelection} from '@lexical/react/useLexicalNodeSelection'
import {mergeRegister} from '@lexical/utils'
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'

import type {
  GridSelection,
  LexicalEditor,
  NodeKey,
  NodeSelection,
  RangeSelection,
} from 'lexical'

import {$isImageNode} from '.'
import ImageResizer from '../../ui/ImageResizer'
import {EDIT_TYPE_ENUM} from './config'
import EditLayer from './EditLayer'
import LazyImage from './LazyImage'

export default function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  resizable,
  attrMathJax,
}: {
  altText: string
  height: number
  nodeKey: NodeKey
  src: string
  width: number
  resizable?: boolean
  attrMathJax?: string
}): JSX.Element {
  const imageRef = useRef<null | HTMLImageElement>(null)
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const [editor] = useLexicalComposerContext()
  const [selection, setSelection] = useState<
    RangeSelection | NodeSelection | GridSelection | null
  >(null)
  const activeEditorRef = useRef<LexicalEditor | null>(null)

  const maxWidth = useMemo(() => {
    return Number(editor?.getRootElement?.()?.clientWidth) - 28 * 2
  }, [editor])

  const maxHeight = useMemo(() => {
    return width > maxWidth ? (height / width) * maxWidth : height
  }, [height, maxWidth, width])

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      editor.update(() => {
        if (isSelected && $isNodeSelection($getSelection())) {
          const event: KeyboardEvent = payload
          event.preventDefault()

          const node = $getNodeByKey(nodeKey)
          if ($isImageNode(node)) {
            node.remove()
          }
        }
      })

      return false
    },
    [editor, isSelected, nodeKey]
  )

  useEffect(() => {
    let isMounted = true
    const unregister = mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()))
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        payload => {
          const event = payload

          if (isResizing) {
            return true
          }

          if (event.target === imageRef.current) {
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
        DRAGSTART_COMMAND,
        event => {
          if (event.target === imageRef.current) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault()
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
      )
    )

    return () => {
      isMounted = false
      unregister()
    }
  }, [
    clearSelection,
    editor,
    isResizing,
    isSelected,
    nodeKey,
    onDelete,
    setSelected,
  ])

  const draggable = isSelected && $isNodeSelection(selection) && !isResizing
  const isFocused = isSelected || isResizing

  const isShowEditLayer = useMemo(() => {
    return isFocused && attrMathJax
  }, [isFocused, attrMathJax])

  const EditType = useMemo(() => {
    if (attrMathJax) {
      return EDIT_TYPE_ENUM.MATHJAX
    }

    return EDIT_TYPE_ENUM.NORMAL
  }, [attrMathJax])

  const onResizeEnd = (
    nextWidth: 'inherit' | number,
    nextHeight: 'inherit' | number
  ) => {
    // Delay hiding the resize bars for click case
    setTimeout(() => {
      setIsResizing(false)
    }, 200)

    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isImageNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight)
      }
    })
  }

  const onResizeStart = () => {
    setIsResizing(true)
  }

  return (
    <Suspense fallback={null}>
      <>
        <div draggable={draggable}>
          <LazyImage
            className={
              isFocused
                ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}`
                : null
            }
            src={src}
            altText={altText}
            imageRef={imageRef}
            width={width}
            height={height}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            attrMathJax={attrMathJax}
          />
          {isShowEditLayer && (
            <EditLayer
              type={EditType}
              attrMathJax={attrMathJax}
              nodeKey={nodeKey}
            />
          )}
        </div>
        {resizable && $isNodeSelection(selection) && isFocused && (
          <ImageResizer
            editor={editor}
            imageRef={imageRef}
            maxWidth={maxWidth}
            onResizeStart={onResizeStart}
            onResizeEnd={onResizeEnd}
          />
        )}
      </>
    </Suspense>
  )
}
