import { chunkText, hashBuffer } from './pdfUtils';

describe('pdfUtils', () => {
  it('chunks text with overlap', () => {
    const chunks = chunkText(['one two three four five six seven eight nine ten'], 3, 1);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0].page).toBe(1);
  });

  it('hashes buffer deterministically', () => {
    const buf = Buffer.from('hello');
    const h1 = hashBuffer(buf);
    const h2 = hashBuffer(buf);
    expect(h1).toBe(h2);
  });
});
