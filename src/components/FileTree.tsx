import React from 'react';
import { Folder, FileCode } from 'lucide-react';
import { TreeItem } from '../utils/github';

interface FileTreeProps {
  tree: TreeItem[];
}

const FileTree: React.FC<FileTreeProps> = ({ tree }) => {
  // Build a hierarchy for rendering
  const hierarchy = React.useMemo(() => {
    const root: any = {};
    tree.forEach(item => {
      const parts = item.path.split('/');
      let current = root;
      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = {
             name: part,
             isDir: index < parts.length - 1 || item.type === 'tree',
             children: {},
             path: item.path
          };
        }
        current = current[part].children;
      });
    });
    return root;
  }, [tree]);

  const renderTree = (node: any, depth = 0) => {
     // Sort folders first, then files
     const keys = Object.keys(node).sort((a, b) => {
        const nodeA = node[a];
        const nodeB = node[b];
        if (nodeA.isDir && !nodeB.isDir) return -1;
        if (!nodeA.isDir && nodeB.isDir) return 1;
        return a.localeCompare(b);
     });

    return (
      <ul className={`${depth > 0 ? 'ml-4 border-l border-gray-700 pl-2' : ''}`}>
        {keys.map(key => {
          const item = node[key];
          return (
            <li key={key} className="my-1">
              <div className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                {item.isDir ? (
                  <Folder className="w-4 h-4 text-blue-400" />
                ) : (
                  <FileCode className="w-4 h-4 text-gray-500" />
                )}
                <span>{item.name}</span>
              </div>
               {/* Recursion for children */}
               {Object.keys(item.children).length > 0 && renderTree(item.children, depth + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-[#161b22] border border-gray-700 rounded-lg p-4 overflow-auto h-[600px]">
      <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Files</h3>
      {renderTree(hierarchy)}
    </div>
  );
};

export default FileTree;
