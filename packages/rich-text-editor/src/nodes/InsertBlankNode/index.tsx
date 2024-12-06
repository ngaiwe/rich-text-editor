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

const InsertBlankNodeZhTagType = 'insertBlank'

export interface InsertBlankPayload {
  key?: NodeKey
  index?: number
}

export type SerializedBlankNode = Spread<
  InsertBlankPayload,
  SerializedLexicalNode
>

// 插空组件
const InsertBlankComponent = React.lazy(() => import('./InsertBlankComponent'))

function convertBlankElement(domNode: Node): null | DOMConversionOutput {
  const node = $createInsertBlankNode({})

  return {node}
}

export class InsertBlankNode extends DecoratorNode<JSX.Element> {
  private __serialIndex: number = -1

  static getType(): string {
    return InsertBlankNodeZhTagType
  }

  static clone(node: InsertBlankNode): InsertBlankNode {
    return new InsertBlankNode(node.__key, node.__serialIndex)
  }

  static importJSON(serializedNode: SerializedBlankNode): InsertBlankNode {
    const node = $createInsertBlankNode({})

    return node
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span')

    element.setAttribute(CUSTOMIZE_ATTRIBUTE_TYPE, InsertBlankNodeZhTagType)

    return {
      element,
    }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (node: Node) => {
        const status =
          node instanceof HTMLSpanElement &&
          node.getAttribute(CUSTOMIZE_ATTRIBUTE_TYPE) ===
            InsertBlankNodeZhTagType

        if (!status) {
          return null
        }

        return {
          conversion: convertBlankElement,
          priority: 2,
        }
      },
    }
  }

  public constructor(key?: NodeKey, index?: number) {
    super(key)

    if (typeof index === 'number' && index >= 0) {
      this.__serialIndex = index
    }
  }

  exportJSON(): SerializedBlankNode {
    return {
      type: InsertBlankNodeZhTagType,
      version: 1,
    }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    const theme = config.theme
    const className = theme.insertBlank
    if (className !== undefined) {
      span.className = className
    }
    return span
  }

  updateDOM(): false {
    return false
  }

  updateIndex(index: number) {
    const self = this.getWritable()
    self.__serialIndex = index
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <InsertBlankComponent
          nodeKey={this.getKey()}
          index={this.__serialIndex}
        />
      </Suspense>
    )
  }
}

export function $createInsertBlankNode({
  key,
}: InsertBlankPayload): InsertBlankNode {
  return $applyNodeReplacement(new InsertBlankNode(key))
}

export function $isInsertBlankNode(
  node: LexicalNode | null | undefined
): node is InsertBlankNode {
  return node instanceof InsertBlankNode
}
