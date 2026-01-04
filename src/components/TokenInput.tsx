import React from 'react';
import { Key } from 'lucide-react';

interface TokenInputProps {
  token: string;
  setToken: (token: string) => void;
}

const TokenInput: React.FC<TokenInputProps> = ({ token, setToken }) => {
  return (
    <div className="mb-4">
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-4 w-4 text-gray-500" />
            </div>
            <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="GitHub Personal Access Token (Optional, for higher limits)"
                className="w-full pl-10 pr-4 py-2 bg-[#0d1117] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm placeholder-gray-600 transition-all text-gray-300"
            />
        </div>
        <p className="mt-1 text-xs text-gray-500">
            Your token is used only for fetching data and is not stored.
        </p>
    </div>
  );
};

export default TokenInput;
