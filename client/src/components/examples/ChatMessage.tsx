import { ChatMessage } from "../ChatMessage";

export default function ChatMessageExample() {
  const userMessage = {
    id: "1",
    role: "user" as const,
    content: "Can you explain how React hooks work?",
    timestamp: new Date(),
  };

  const assistantMessage = {
    id: "2",
    role: "assistant" as const,
    content: `React Hooks are functions that let you "hook into" React state and lifecycle features from function components. Here's a quick example:

\`\`\`javascript
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  }, [count]);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Click me
    </button>
  );
}
\`\`\`

The most common hooks are **useState** and **useEffect**.`,
    timestamp: new Date(),
    provider: "GPT-4o",
  };

  return (
    <div className="space-y-0">
      <ChatMessage message={userMessage} />
      <ChatMessage message={assistantMessage} />
    </div>
  );
}
