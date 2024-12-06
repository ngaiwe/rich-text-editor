import {
  DOMConversionMap,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  TextNode,
} from 'lexical'
import {PatchStyleConversion} from './injectStyle'

export class ExtendedTextNode extends TextNode {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(text: string, key?: NodeKey) {
    super(text, key)
  }

  static getType(): string {
    return 'extended-text'
  }

  static clone(node: ExtendedTextNode): ExtendedTextNode {
    return new ExtendedTextNode(node.__text, node.__key)
  }

  static importDOM(): DOMConversionMap | null {
    const importers = TextNode.importDOM()

    return {
      ...importers,
      code: () => ({
        conversion: PatchStyleConversion(importers?.code),
        priority: 1,
      }),
      em: () => ({
        conversion: PatchStyleConversion(importers?.em),
        priority: 1,
      }),
      span: () => ({
        conversion: PatchStyleConversion(importers?.span),
        priority: 1,
      }),
      strong: () => ({
        conversion: PatchStyleConversion(importers?.strong),
        priority: 1,
      }),
      sub: () => ({
        conversion: PatchStyleConversion(importers?.sub),
        priority: 1,
      }),
      sup: () => ({
        conversion: PatchStyleConversion(importers?.sup),
        priority: 1,
      }),
    }
  }

  static importJSON(serializedNode: SerializedTextNode): TextNode {
    return TextNode.importJSON(serializedNode)
  }

  exportJSON(): SerializedTextNode {
    return {
      detail: this.getDetail(),
      format: this.getFormat(),
      mode: this.getMode(),
      style: this.getStyle(),
      text: this.getTextContent(),
      type: this.getType(),
      version: 1,
    }
  }
}

export function $isExtendedTextNode(
  node: LexicalNode | null | undefined
): node is ExtendedTextNode {
  return node instanceof ExtendedTextNode
}
