import { TreeItem } from './github';

export const generateDirectoryStructure = (tree: TreeItem[]): string => {
  const lines: string[] = [];
  lines.push('Directory Structure:');
  
  // Sort items: directories first, then files. Alphabetical within each.
  // We need to build a hierarchy to print it nicely, or just print paths.
  // Gitingest usually prints paths or a tree. Let's do a simple tree-like print using paths for now
  // or actually, standard tree command output is nicer.
  // For simplicity and speed in this version, let's just list the paths indented, or use a simple logic.
  
  // Let's implement a simple visual tree generator.
  const root: any = {};
  
  tree.forEach(item => {
    const parts = item.path.split('/');
    let current = root;
    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = index === parts.length - 1 ? (item.type === 'tree' ? {} : null) : {};
      }
      current = current[part];
    });
  });

  const printTree = (node: any, prefix = '', isLast = true): string => {
    let output = '';
    const keys = Object.keys(node).sort((a, b) => {
      // Directories first
        const aIsDir = node[a] !== null;
        const bIsDir = node[b] !== null;
        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;
        return a.localeCompare(b);
    });

    keys.forEach((key, index) => {
      const isLastItem = index === keys.length - 1;
      const marker = isLastItem ? '└── ' : '├── ';
      const subPrefix = isLastItem ? '    ' : '│   ';
      
      output += `${prefix}${marker}${key}\n`;
      
      if (node[key] !== null) {
        output += printTree(node[key], `${prefix}${subPrefix}`, isLastItem);
      }
    });
    return output;
  };

  return lines[0] + '\n' + printTree(root);
};

export const formatFileContent = (path: string, content: string): string => {
  return `\n================================================\nFile: ${path}\n================================================\n${content}\n`;
};
