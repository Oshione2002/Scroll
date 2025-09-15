import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import * as faiss from 'faiss-node';
import { ChunkMeta } from '../types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const ask = async (query: string, topK = 6) => {
  const current = fs.readFileSync(path.join('storage', 'current'), 'utf8');
  const dir = path.join('storage', current.trim());
  const metas: ChunkMeta[] = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'));
  const index = faiss.readIndex(path.join(dir, 'index.faiss'));

  const qEmbed = await openai.embeddings.create({ model: 'text-embedding-3-large', input: query });
  const result = index.search([qEmbed.data[0].embedding], topK);
  const labels = result.labels[0];
  const contextChunks: { meta: ChunkMeta; idx: number }[] = [];
  labels.forEach((label: number, i: number) => {
    if (label >= 0) contextChunks.push({ meta: metas[label], idx: i + 1 });
  });
  if (contextChunks.length === 0) {
    return { answer: 'No relevant content found.', citations: [] };
  }
  const context = contextChunks
    .map((c) => `[${c.idx}] (${c.meta.file} p${c.meta.page}) ${c.meta.text}`)
    .join('\n');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'Use only the provided context to answer. Cite sources using [number]. If none, say "No relevant content found."'
      },
      { role: 'user', content: `Context:\n${context}\n\nQuestion: ${query}` }
    ],
    temperature: 0
  });

  const answer = completion.choices[0].message?.content || '';
  const used = Array.from(answer.matchAll(/\[(\d+)\]/g)).map((m) => Number(m[1]));
  const uniq = Array.from(new Set(used));
  const citations = uniq.map((n) => {
    const found = contextChunks.find((c) => c.idx === n);
    return found
      ? { file: found.meta.file, page: found.meta.page, snippet: found.meta.text.slice(0, 200) }
      : null;
  }).filter(Boolean) as { file: string; page: number; snippet: string }[];

  return { answer, citations };
};
