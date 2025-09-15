import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  citations?: { file: string; page: number; snippet: string }[];
};

interface Props {
  message: Message;
}

const ChatBubble: React.FC<Props> = ({ message }) => {
  if (message.role === 'user') {
    return <div className="text-right">{message.content}</div>;
  }
  return (
    <div className="text-left">
      <div className="mb-2 whitespace-pre-wrap">{message.content}</div>
      {message.citations && message.citations.length > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm text-blue-600">Sources</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-4 text-sm space-y-1">
                {message.citations.map((c, i) => (
                  <li key={i}>
                    {c.file} – page {c.page}: <em>{c.snippet}</em>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default ChatBubble;
