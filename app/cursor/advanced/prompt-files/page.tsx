"use client";

import { readStreamableValue } from "ai/rsc";
import { useState, useRef } from "react";
import { Message, continueConversation } from "./actions";

export default function PromptFiles() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSend = async () => {
    const fileContents = files.length > 0 
      ? `\n\nAttached files:\n${files.map(f => `- ${f.name}`).join('\n')}`
      : '';
    
    const userMessage = { 
      role: "user" as const, 
      content: input + fileContents 
    };
    
    const { messages, newMessage } = await continueConversation([
      ...conversation, 
      userMessage
    ]);

    let textContent = "";
    for await (const delta of readStreamableValue(newMessage)) {
      textContent = `${textContent}${delta}`;
      setConversation([...messages, { role: "assistant", content: textContent }]);
    }
    setInput("");
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Prompt Files</h1>

      <div className="mb-4 h-[60vh] overflow-y-auto space-y-2">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded ${
              message.role === "user" ? "bg-blue-100 text-gray-500" : "bg-green-100 text-gray-500"
            }`}
          >
            <strong className="capitalize">{message.role}:</strong>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          className="block w-full text-sm text-gray-500 mb-2
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-grow border rounded p-2"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
