import React from 'react';
import PDFUploader from '../components/PDFUploader';

const Upload: React.FC = () => (
  <div className="p-8 max-w-3xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Upload PDFs</h1>
    <PDFUploader />
  </div>
);

export default Upload;
