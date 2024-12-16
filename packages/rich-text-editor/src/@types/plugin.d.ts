declare interface EditorPluginConfig {
  name: string;
  init: (editor: LexicalEditor) => void;
  nodes?: Array<{
    node: typeof LexicalNode;
  }>;
  toolbar?: [(editor: LexicalEditor) => void];
  options?: Record<string, unknown>;
}
