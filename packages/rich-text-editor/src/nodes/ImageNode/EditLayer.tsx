import {EDU_INSERT_MATHJAX_MODAL_COMMAND} from '@/config/GlobalCommand'
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'
import {useCallback} from 'react'
import {EDIT_TYPE_ENUM} from './config'

interface EditLayerPropsType {
  type: string
  attrMathJax?: string
  nodeKey: string
}

export default function EditLayer(props: EditLayerPropsType) {
  const [editor] = useLexicalComposerContext()

  const Edit = useCallback(() => {
    switch (props.type) {
      case EDIT_TYPE_ENUM.MATHJAX:
        editor.dispatchCommand(EDU_INSERT_MATHJAX_MODAL_COMMAND, {
          attrMathJax: props.attrMathJax,
          nodeKey: props.nodeKey,
        })
        break
      default:
        break
    }
  }, [editor, props])

  return (
    <div className="ImageNode__editLayer">
      <span onClick={Edit}>编辑</span>
    </div>
  )
}
