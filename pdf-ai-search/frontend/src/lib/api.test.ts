import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { askQuestion } from './api';

vi.mock('axios');

describe('api', () => {
  it('askQuestion returns data', async () => {
    (axios.post as any).mockResolvedValue({ data: { answer: 'hi', citations: [] } });
    const res = await askQuestion('hi');
    expect(res.answer).toBe('hi');
  });
});
