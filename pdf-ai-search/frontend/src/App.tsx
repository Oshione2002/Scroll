import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Upload from './pages/Upload';
import Chat from './pages/Chat';
import './index.css';

const client = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={client}>
    <BrowserRouter>
      <Routes>
        <Route path="/upload" element={<Upload />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<Navigate to="/upload" />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
