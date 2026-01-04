// Simple approximation or wrapper around a library if we were fully server-side.
// Since we are client side, we can use a lightweight approach.
// 1 token ~= 4 chars is a common rule of thumb for English text.
import { encode } from 'gpt-tokenizer';

export const estimateTokens = (text: string): number => {
    if (!text) return 0;
    try {
        return encode(text).length;
    } catch (e) {
        console.warn("Tokenizer failed, falling back to char count", e);
        return Math.ceil(text.length / 4);
    }
};
