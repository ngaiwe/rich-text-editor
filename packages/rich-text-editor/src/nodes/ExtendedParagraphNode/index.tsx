import {
  $applyNodeReplacement,
  DOMConversionMap,
  DOMConversionOutput,
  ElementFormatType,
  LexicalNode,
  ParagraphNode,
  SerializedElementNode,
  SerializedParagraphNode,
} from 'lexical';

function convertParagraphElement(element: HTMLElement): DOMConversionOutput {
  const node = $createExtenedParagraphNode();

  if (element.style) {
    node.setFormat(element.style.textAlign as ElementFormatType);
  }

  return { node };
}

export class ExtendedParagraphNode extends ParagraphNode {
  static getType(): string {
    return 'extended-paragraph';
  }

  static clone(node: ExtendedParagraphNode): ExtendedParagraphNode {
    return new ExtendedParagraphNode(node.__key);
  }

  static importDOM(): DOMConversionMap | null {
    const importers = ParagraphNode.importDOM();

    return {
      ...importers,
      p: () => ({
        conversion: convertParagraphElement,
        priority: 1,
      }),
    };
  }

  static importJSON(serializedNode: SerializedParagraphNode): ParagraphNode {
    return ParagraphNode.importJSON(serializedNode);
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: this.getType(),
      version: 1,
    };
  }
}

export function $createExtenedParagraphNode(): ExtendedParagraphNode {
  return $applyNodeReplacement(new ExtendedParagraphNode());
}

export function $isExtendedParagraphNode(
  node: LexicalNode | null | undefined,
): node is ExtendedParagraphNode {
  return node instanceof ExtendedParagraphNode;
}
