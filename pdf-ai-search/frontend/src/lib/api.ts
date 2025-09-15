import axios from 'axios';

export const uploadPDFs = async (files: File[]) => {
  const form = new FormData();
  files.forEach((f) => form.append('files', f));
  await axios.post('/api/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const askQuestion = async (query: string) => {
  const res = await axios.post('/api/ask', { query });
  return res.data as { answer: string; citations: any[] };
};
