import React from 'react';
import { TreeItem } from '../utils/github';
import FileTree from './FileTree';
import CodeViewer from './CodeViewer';
import Stats from './Stats';

interface DashboardProps {
  tree: TreeItem[];
  digest: string;
  repoSize: number;
  filesCount: number;
  tokens: number;
}

const Dashboard: React.FC<DashboardProps> = ({ tree, digest, repoSize, filesCount, tokens }) => {
  return (
    <div className="animate-fade-in-up">
      <Stats filesCount={filesCount} totalSize={repoSize} totalTokens={tokens} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FileTree tree={tree} />
        </div>
        <div className="lg:col-span-2">
           <CodeViewer content={digest} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
