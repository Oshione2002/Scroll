import React, { useState, DragEvent } from 'react';
import { uploadPDFs } from '../lib/api';

const PDFUploader: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState('');

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type === 'application/pdf');
    setFiles(dropped);
  };

  const upload = async () => {
    if (files.length === 0) return;
    setStatus('Uploading...');
    try {
      await uploadPDFs(files);
      setStatus('Uploaded successfully');
    } catch {
      setStatus('Upload failed');
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-dashed border-2 p-8 text-center mb-4"
      >
        Drag and drop PDFs here
      </div>
      <button
        onClick={upload}
        className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!files.length}
      >
        Upload {files.length ? `(${files.length})` : ''}
      </button>
      {status && <div className="mt-2 text-sm">{status}</div>}
    </div>
  );
};

export default PDFUploader;
