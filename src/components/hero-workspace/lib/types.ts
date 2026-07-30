import type { ReactNode } from "react";

export type FileNode = {
  type: "file";
  name: string;
  path: string;
  language?: "jsx" | "js" | "json";
  source?: string;
};

export type FolderNode = {
  type: "folder";
  name: string;
  path: string;
  children: TreeNode[];
};

export type TreeNode = FileNode | FolderNode;

export type TerminalLine = {
  id: number;
  kind: "prompt" | "output";
  node: ReactNode;
};

export type CommandContext = {
  openFile: (path: string) => void;
  clearTerminal: () => void;
  scrollTo: (id: string) => void;
  navigate: (to: string) => void;
  print: (node: ReactNode) => void;
  filesByName: Record<string, FileNode>;
  commandNames: string[];
};

export type Command = {
  name: string;
  description: string;
  hidden?: boolean;
  run: (args: string[], ctx: CommandContext) => void;
};