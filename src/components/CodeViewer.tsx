import React, { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';

interface CodeViewerProps {
  content: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codebase_digest.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[600px] bg-[#0d1117] border border-gray-700 rounded-lg overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-[#161b22]">
        <h3 className="font-semibold text-gray-300">Digest Preview</h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm text-gray-300">
        <pre className="whitespace-pre-wrap break-all">{content}</pre>
      </div>
    </div>
  );
};

export default CodeViewer;
