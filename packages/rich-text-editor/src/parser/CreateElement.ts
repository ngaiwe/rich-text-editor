import {
  ClassAttributes,
  createElement,
  InputHTMLAttributes,
  ReactNode,
} from 'react'
import {isString} from '../utils/utils'

const IgnoreChildrenProps = ['img']

type typeProp = React.FunctionComponent | string

function CreateElement(
  type: typeProp,
  props:
    | (InputHTMLAttributes<HTMLInputElement> &
        ClassAttributes<HTMLInputElement>)
    | null
    | undefined,
  children?: ReactNode[] | string
) {
  if (isString(type) && IgnoreChildrenProps.includes(type as string)) {
    return createElement(type, props)
  }

  return children?.length
    ? createElement(type, props, children)
    : createElement(type, props)
}

export {CreateElement}
