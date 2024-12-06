import React, {Suspense} from 'react'

import {
  $applyNodeReplacement,
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical'
import {CUSTOMIZE_ATTRIBUTE_TYPE} from '../../config/GlobalConstant'

const ReplaceBlankNodeZhTagType = 'replaceBlank'

export interface ReplaceBlankPayload {
  key?: NodeKey
  text: string
}

export type SerializedBlankNode = Spread<
  ReplaceBlankPayload,
  SerializedLexicalNode
>

// 挖空组件
const ReplaceBlankComponent = React.lazy(
  () => import('./ReplaceBlankComponent')
)

function convertReplaceBlankElement(
  domNode: HTMLSpanElement
): null | DOMConversionOutput {
  const node = $createReplaceBlankNode({
    text: domNode?.innerHTML,
  })

  return {node}
}

export class ReplaceBlankNode extends DecoratorNode<JSX.Element> {
  __text: string = ''

  static getType(): string {
    return ReplaceBlankNodeZhTagType
  }

  static clone(node: ReplaceBlankNode): ReplaceBlankNode {
    return new ReplaceBlankNode(node.__text, node.__key)
  }

  static importJSON(serializedNode: SerializedBlankNode): ReplaceBlankNode {
    const {text} = serializedNode

    const node = $createReplaceBlankNode({
      text,
    })

    return node
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span')

    element.setAttribute(CUSTOMIZE_ATTRIBUTE_TYPE, ReplaceBlankNodeZhTagType)
    element.innerHTML = this.__text

    return {
      element,
    }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (node: Node) => {
        const status =
          node instanceof HTMLSpanElement &&
          (node.getAttribute(CUSTOMIZE_ATTRIBUTE_TYPE) ===
            ReplaceBlankNodeZhTagType ||
            node.getAttribute(CUSTOMIZE_ATTRIBUTE_TYPE) === 'hollowBlank')

        if (!status) {
          return null
        }

        return {
          conversion: convertReplaceBlankElement,
          priority: 2,
        }
      },
    }
  }

  public constructor(text: string, key?: NodeKey) {
    super(key)

    this.__text = text
  }

  getText() {
    return this.__text
  }

  exportJSON(): SerializedBlankNode {
    return {
      type: ReplaceBlankNodeZhTagType,
      text: this.__text ?? '',
      version: 1,
    }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    const theme = config.theme
    const className = theme.replaceBlank
    if (className !== undefined) {
      span.className = className
    }
    return span
  }

  updateDOM(): false {
    return false
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <ReplaceBlankComponent nodeKey={this.getKey()} text={this.__text} />
      </Suspense>
    )
  }
}

export function $createReplaceBlankNode({
  key,
  text,
}: ReplaceBlankPayload): ReplaceBlankNode {
  return $applyNodeReplacement(new ReplaceBlankNode(text, key))
}

export function $isReplaceBlankNode(
  node: LexicalNode | null | undefined
): node is ReplaceBlankNode {
  return node instanceof ReplaceBlankNode
}
