import KaTeX from 'katex'
import {forwardRef, useImperativeHandle, useMemo, useRef} from 'react'
import {addClassName} from '../../utils/className'
import {CLASSNAME_TAG} from './config'

export interface MathComponentRef {
  getMathKatexDom: () => void
}

interface MathComponentProps {
  mathText: string
}

const MathComponent = forwardRef<MathComponentRef, MathComponentProps>(
  (props: MathComponentProps, ref) => {
    const mathRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(
      ref,
      () => ({
        getMathKatexDom() {
          return mathRef.current
        },
      }),
      []
    )

    const {html, error} = useMemo(() => {
      try {
        const html = KaTeX.renderToString(props.mathText, {
          displayMode: false,
          errorColor: 'ff0000',
          throwOnError: false,
        })

        return {html, error: undefined}
      } catch (error) {
        if (error instanceof KaTeX.ParseError || error instanceof TypeError) {
          return {error}
        }

        throw error
      }
    }, [props.mathText]) as {
      html: string
      error: Error | undefined
    }

    return (
      <div
        className={addClassName([`${CLASSNAME_TAG}-component`])}
        ref={mathRef}
        dangerouslySetInnerHTML={{__html: error ? error?.message : html}}
      />
    )
  }
)

export default MathComponent
