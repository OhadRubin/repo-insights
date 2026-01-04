export interface TreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

export const extractOwnerRepo = (url: string): { owner: string; repo: string } | null => {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] };
    }
  } catch (e) {
    // try handling non-url strings like "owner/repo"
    const parts = url.split('/');
    if (parts.length === 2) {
      return { owner: parts[0], repo: parts[1] };
    }
  }
  return null;
};

export const fetchRepoTree = async (
  owner: string,
  repo: string,
  token?: string
): Promise<TreeItem[]> => {
  // First get the default branch
  const branchHeaders: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) {
    branchHeaders.Authorization = `Bearer ${token}`;
  }

  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: branchHeaders,
  });

  if (!repoRes.ok) {
    throw new Error(
      repoRes.status === 404
        ? 'Repository not found'
        : repoRes.status === 403
        ? 'Rate limit exceeded'
        : 'Failed to fetch repository details'
    );
  }

  const repoData = await repoRes.json();
  const defaultBranch = repoData.default_branch;

  // Now fetch the tree recursively
  const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`;
  const treeRes = await fetch(treeUrl, { headers: branchHeaders });

  if (!treeRes.ok) {
    throw new Error('Failed to fetch repository tree');
  }

  const treeData = await treeRes.json();
  if (treeData.truncated) {
    // Optionally handle truncation warning
    console.warn('Tree is truncated');
  }

  return treeData.tree;
};

export const fetchFileContent = async (url: string, token?: string): Promise<string> => {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3.raw', // Request raw content directly
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error('Failed to fetch file content');
  }
  return res.text();
};
