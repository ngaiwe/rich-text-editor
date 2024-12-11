import { useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $getNodeByKey,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
} from 'lexical';

import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import { INSERT_IMAGE_COMMAND, REPLACW_IMAGE_COMMAND } from '../../config/GlobalCommand';
import { $createImageNode, ImageNode, ImagePayload } from '../../nodes/ImageNode';

export default function UploadImagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        (payload: ImagePayload) => {
          const imageNode = $createImageNode(payload);

          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        REPLACW_IMAGE_COMMAND,
        (payload: ImagePayload) => {
          const imageNode = $createImageNode(payload);

          if (payload?.nodeKey) {
            const oldNode = $getNodeByKey(payload.nodeKey);
            if (oldNode) {
              oldNode.replace(imageNode);
            }
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor]);

  return null;
}
