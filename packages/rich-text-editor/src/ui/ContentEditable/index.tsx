// 富文本内容区
import './index.less'

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'
import {ContentEditable as LexicalContentEditable} from '@lexical/react/LexicalContentEditable'
import {useCallback, useEffect, useRef} from 'react'
import {DEFAULT_FONT_SIZE} from '../../config/DefaultStyleConfig'
import {CLICK_OUTSIDE_ROOT_COMMAND} from '../../config/GlobalCommand'
import {addClassName} from '../../utils/className'

const classNameTag = 'contentEditable'
const defaultStyle = {
  fontSize: DEFAULT_FONT_SIZE,
}

const ContentEditable = () => {
  const [editor] = useLexicalComposerContext()
  const rootRef = useRef<HTMLDivElement | null>(null)

  const clickOutsideHandle = useCallback(
    (event: Event) => {
      if (rootRef.current) {
        editor.dispatchCommand(
          CLICK_OUTSIDE_ROOT_COMMAND,
          rootRef.current?.contains(event.target as Node),
        )
      }
    },
    [editor, rootRef],
  )

  useEffect(() => {
    window.addEventListener('click', clickOutsideHandle, false)

    return () => {
      window.removeEventListener('click', clickOutsideHandle, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={rootRef} className={addClassName([`${classNameTag}-root`])}>
      <LexicalContentEditable
        className={addClassName([`${classNameTag}-content`])}
        style={defaultStyle}
      />
    </div>
  )
}

export default ContentEditable
