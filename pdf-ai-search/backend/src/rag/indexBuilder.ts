import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import { extractTextByPage, hashBuffer, chunkText } from '../utils/pdfUtils';
import { ChunkMeta } from '../types';
import * as faiss from 'faiss-node';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const buildIndex = async (buffers: { name: string; buffer: Buffer }[], storageDir: string) => {
  const metas: ChunkMeta[] = [];
  const vectors: number[][] = [];

  for (const file of buffers) {
    const pages = await extractTextByPage(file.buffer);
    if (pages.every((p) => !p)) throw new Error('Scanned PDF not supported');
    const chunks = chunkText(pages);
    for (const chunk of chunks) {
      const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-large',
        input: chunk.text
      });
      vectors.push(embedding.data[0].embedding);
      metas.push({ file: file.name, page: chunk.page, chunkId: chunk.chunkId, text: chunk.text });
    }
  }

  const dim = vectors[0].length;
  const index = new faiss.IndexFlatL2(dim);
  index.add(vectors);
  fs.mkdirSync(storageDir, { recursive: true });
  faiss.writeIndex(index, path.join(storageDir, 'index.faiss'));
  fs.writeFileSync(path.join(storageDir, 'meta.json'), JSON.stringify(metas));
};
