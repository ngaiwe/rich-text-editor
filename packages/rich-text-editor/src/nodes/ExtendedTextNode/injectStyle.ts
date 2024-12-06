import {
  $isTextNode,
  DOMConversion,
  DOMConversionOutput,
  LexicalNode,
} from 'lexical'
import kebabCase from 'lodash/kebabCase'

const formatNodeStyle = (styleValue: CSSStyleDeclaration) => {
  return Object.entries(styleValue)
    .map(([key, value]) => {
      return value ? `${kebabCase(key)}: ${value}` : null
    })
    .filter(value => value != null)
    .join('; ')
}

const forChildCallback = ({
  originalOutput,
  lexicalNode,
  parent,
  styleString,
}: {
  originalOutput: DOMConversionOutput
  lexicalNode: LexicalNode
  parent: LexicalNode | null | undefined
  styleString: string
}) => {
  const originalForChild = originalOutput?.forChild ?? (x => x)
  const result = originalForChild(lexicalNode, parent)

  if ($isTextNode(result)) {
    if (styleString.length) {
      return result.setStyle(styleString)
    }

    return result
  }

  return lexicalNode
}

export function PatchStyleConversion(
  originalDOMConverter?: (node: HTMLElement) => DOMConversion | null
): (node: HTMLElement) => DOMConversionOutput | null {
  return node => {
    const original = originalDOMConverter?.(node)

    if (!original) {
      return null
    }

    const originalOutput = original.conversion(node)

    if (!originalOutput) {
      return originalOutput
    }

    const styleString = formatNodeStyle(node?.style ?? {})

    return {
      ...originalOutput,
      forChild: (lexicalNode, parent) =>
        forChildCallback({
          originalOutput,
          lexicalNode,
          parent,
          styleString,
        }),
    }
  }
}
