import fs from 'fs';
import crypto from 'crypto';
import pdf from 'pdf-parse';

export const hashBuffer = (buffer: Buffer) =>
  crypto.createHash('sha256').update(buffer).digest('hex');

export const extractTextByPage = async (buffer: Buffer): Promise<string[]> => {
  const data = await pdf(buffer);
  const pages = data.text.split('\f');
  return pages.map((p: string) => p.trim());
};

export const chunkText = (
  pages: string[],
  chunkSize = 800,
  overlap = 150
): { text: string; page: number; chunkId: string }[] => {
  const chunks: { text: string; page: number; chunkId: string }[] = [];
  let id = 0;
  for (let i = 0; i < pages.length; i++) {
    const words = pages[i].split(/\s+/);
    for (let start = 0; start < words.length; start += chunkSize - overlap) {
      const chunkWords = words.slice(start, start + chunkSize);
      chunks.push({ text: chunkWords.join(' '), page: i + 1, chunkId: `c${id++}` });
    }
  }
  return chunks;
};
