import React from 'react';
import { FileText, Database, Layers } from 'lucide-react';

interface StatsProps {
  filesCount: number;
  totalSize: number; // in bytes
  totalTokens: number;
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) return (tokens / 1000000).toFixed(1) + 'M';
    if (tokens >= 1000) return (tokens / 1000).toFixed(1) + 'k';
    return tokens.toString();
};

const Stats: React.FC<StatsProps> = ({ filesCount, totalSize, totalTokens }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-[#161b22] border border-gray-700 p-4 rounded-lg flex items-center gap-4">
        <div className="p-3 bg-blue-500/10 rounded-full">
            <FileText className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <p className="text-gray-400 text-sm">Files</p>
          <p className="text-xl font-bold text-white">{filesCount}</p>
        </div>
      </div>
      
      <div className="bg-[#161b22] border border-gray-700 p-4 rounded-lg flex items-center gap-4">
        <div className="p-3 bg-purple-500/10 rounded-full">
            <Database className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <p className="text-gray-400 text-sm">Size</p>
          <p className="text-xl font-bold text-white">{formatBytes(totalSize)}</p>
        </div>
      </div>

       <div className="bg-[#161b22] border border-gray-700 p-4 rounded-lg flex items-center gap-4">
        <div className="p-3 bg-green-500/10 rounded-full">
            <Layers className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <p className="text-gray-400 text-sm">Tokens (Est.)</p>
          <p className="text-xl font-bold text-white">{formatTokens(totalTokens)}</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
