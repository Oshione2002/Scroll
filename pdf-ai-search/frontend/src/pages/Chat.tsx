import React, { useState } from 'react';
import ChatBubble from '../components/ChatBubble';
import { askQuestion } from '../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: any[];
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const question = input;
    setMessages((m) => [...m, { role: 'user', content: question }]);
    setInput('');
    setLoading(true);
    try {
      const { answer, citations } = await askQuestion(question);
      setMessages((m) => [...m, { role: 'assistant', content: answer, citations }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Error fetching answer.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg} />
        ))}
        {loading && <div className="text-sm text-gray-500">Loading...</div>}
      </div>
      <div className="p-4 border-t flex">
        <input
          className="flex-1 border rounded px-3 py-2 mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
