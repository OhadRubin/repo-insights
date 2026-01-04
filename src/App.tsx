import React, { useState } from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import { extractOwnerRepo, fetchRepoTree, fetchFileContent, TreeItem } from './utils/github';
import { generateDirectoryStructure, formatFileContent } from './utils/converter';
import { estimateTokens } from './utils/tokenizer';

const BINARY_EXTENSIONS = [
  'png', 'jpg', 'jpeg', 'gif', 'bmp', 'ico', 'svg', 'webp',
  'pdf', 'exe', 'dll', 'so', 'dylib', 'bin', 'zip', 'tar', 'gz', '7z',
  'mp3', 'mp4', 'wav', 'avi', 'mov', 'mkv',
  'ttf', 'otf', 'woff', 'woff2', 'eot',
  'pyc', 'class', 'pkl', 'db', 'sqlite'
];

const IGNORED_FILES = [
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'go.sum', 'Cargo.lock'
];

const isBinaryOrIgnored = (path: string) => {
  const filename = path.split('/').pop() || '';
  if (IGNORED_FILES.includes(filename)) return true;
  if (filename.startsWith('.')) return false; // keep config files
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext && BINARY_EXTENSIONS.includes(ext)) return true;
  return false;
};

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    tree: TreeItem[];
    digest: string;
    repoSize: number;
    filesCount: number;
    tokens: number;
  } | null>(null);

  const handleAnalyze = async (url: string, token: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const repoInfo = extractOwnerRepo(url);
      if (!repoInfo) {
        throw new Error('Invalid GitHub URL');
      }

      const { owner, repo } = repoInfo;
      const tree = await fetchRepoTree(owner, repo, token || undefined);
      
      const structure = generateDirectoryStructure(tree);
      let contentDigest = structure + '\n\n';
      
      const filesToFetch = tree.filter(item => item.type === 'blob' && !isBinaryOrIgnored(item.path));
      let totalSize = 0;
      
      // Fetch files in chunks to avoid rate limits
      const CHUNK_SIZE = 5;
      for (let i = 0; i < filesToFetch.length; i += CHUNK_SIZE) {
        const chunk = filesToFetch.slice(i, i + CHUNK_SIZE);
        const results = await Promise.all(
          chunk.map(async (file) => {
             try {
                // Use the raw url directly? No, raw url needs to be constructed or fetched via API blob
                // Tree api gives us 'url' which is the API url for the blob.
                // But we want raw content. 
                // Alternatively, use `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${file.path}`
                // But we don't strictly know defaultBranch here easily unless we passed it or deduced it.
                // fetchRepoTree did fetch default branch.
                // Let's use the blob API url provided in the tree, with the header Accept: application/vnd.github.v3.raw
                
                const content = await fetchFileContent(file.url, token || undefined);
                return { path: file.path, content };
             } catch (e) {
                 console.warn(`Failed to fetch ${file.path}`, e);
                 return { path: file.path, content: `Error fetching content: ${e}` };
             }
          })
        );
        
        for (const { path, content } of results) {
            contentDigest += formatFileContent(path, content);
            totalSize += content.length; // Approximate size in bytes (chars)
        }
      }

      const tokens = estimateTokens(contentDigest);

      setData({
        tree,
        digest: contentDigest,
        repoSize: totalSize,
        filesCount: filesToFetch.length,
        tokens
      });

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {!data ? (
        <Hero onAnalyze={handleAnalyze} loading={loading} />
      ) : (
        <>
            <div className="flex justify-between items-center mb-6">
                <button 
                    onClick={() => setData(null)}
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
                >
                    &larr; Analyze another repo
                </button>
            </div>
            <Dashboard 
                tree={data.tree} 
                digest={data.digest} 
                repoSize={data.repoSize} 
                filesCount={data.filesCount} 
                tokens={data.tokens} 
            />
        </>
      )}
      
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500/90 text-white px-6 py-4 rounded-lg shadow-xl backdrop-blur-md animate-fade-in-up">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
            <button onClick={() => setError(null)} className="absolute top-2 right-2 text-white/80 hover:text-white">
                &times;
            </button>
        </div>
      )}
    </Layout>
  );
}

export default App;
