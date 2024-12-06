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
import React, {Suspense} from 'react'
import {ATTR_MATHJAX_KEY} from './config'

export interface ImagePayload {
  altText: string
  width: number
  height: number
  src: string
  key?: NodeKey
  attrMathJax?: string
  nodeKey?: string
}

export type SerializedImageNode = Spread<ImagePayload, SerializedLexicalNode>

const ImageComponent = React.lazy(() => import('./ImageComponent'))

interface ImageElementDomNodeType extends HTMLImageElement {
  [ATTR_MATHJAX_KEY]: string
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const {
      alt: altText,
      src,
      width,
      height,
      [ATTR_MATHJAX_KEY]: attrMathJax,
    } = domNode as unknown as ImageElementDomNodeType

    const node = $createImageNode({altText, height, src, width, attrMathJax})

    return {node}
  }
  return null
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string
  __altText: string
  __width: 'inherit' | number
  __height: 'inherit' | number
  __attrMathJax?: string

  static getType(): string {
    return 'image'
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__key,
      node.__attrMathJax
    )
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const {altText, height, width, src, attrMathJax} = serializedNode

    const node = $createImageNode({
      altText,
      height,
      src,
      width,
      attrMathJax,
    })

    return node
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img')

    element.setAttribute('src', this.__src)
    element.setAttribute('alt', this.__altText)
    element.setAttribute('width', this.__width.toString())
    element.setAttribute('height', this.__height.toString())

    if (this.__attrMathJax) {
      element.setAttribute('attr-mathjax', this.__attrMathJax || '')
    }

    return {
      element,
    }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    }
  }

  constructor(
    src: string,
    altText: string,
    width: 'inherit' | number,
    height: 'inherit' | number,
    key?: NodeKey,
    attrMathJax?: string
  ) {
    super(key)
    this.__src = src
    this.__altText = altText
    this.__width = width || 'inherit'
    this.__height = height || 'inherit'
    this.__attrMathJax = attrMathJax
  }

  exportJSON(): SerializedImageNode {
    const defaultJSON = {
      altText: this.getAltText(),
      height: this.__height === 'inherit' ? 0 : this.__height,
      src: this.getSrc(),
      type: 'image',
      version: 1,
      width: this.__width === 'inherit' ? 0 : this.__width,
    }

    if (this.__attrMathJax) {
      Object.assign(defaultJSON, {
        attrMathJax: this.__attrMathJax,
      })
    }

    return defaultJSON
  }

  setWidthAndHeight(
    width: 'inherit' | number,
    height: 'inherit' | number
  ): void {
    const writable = this.getWritable()
    writable.__width = width
    writable.__height = height
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    const theme = config.theme
    const className = theme.image
    if (className !== undefined) {
      span.className = className
    }
    return span
  }

  updateDOM(): false {
    return false
  }

  getSrc(): string {
    return this.__src
  }

  getAltText(): string {
    return this.__altText
  }

  getAttrMathJax(): string {
    return this.__attrMathJax || ''
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <ImageComponent
          src={this.__src}
          altText={this.__altText}
          width={Number(this.__width)}
          height={Number(this.__height)}
          nodeKey={this.getKey()}
          attrMathJax={this.__attrMathJax}
          resizable
        />
      </Suspense>
    )
  }
}

export function $createImageNode({
  key,
  width,
  height,
  src,
  altText,
  attrMathJax,
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(src, altText, width, height, key, attrMathJax)
  )
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode
}
