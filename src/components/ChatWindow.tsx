// Fenêtre de conversation avec historique et input
import { useState, useEffect, useRef } from "react";
import { useAppStore } from "../store/appStore";
import type { Contact } from "../types";

interface Props {
  contact: Contact;
}

export default function ChatWindow({ contact }: Props) {
  const { messages, sendMessage } = useAppStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Header du contact */}
      <div className="p-4 border-b border-koon-800 flex items-center">
        <div className="flex-1">
          <h3 className="font-medium">{contact.name}</h3>
          <p className="text-xs text-koon-muted font-mono truncate">
            {contact.publicKey.slice(0, 32)}...
          </p>
        </div>
      </div>

      {/* Zone de messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} animate-slideIn`}
          >
            <div
              className={`max-w-md px-4 py-2 rounded-2xl ${
                msg.sender === "me"
                  ? "bg-koon-accent text-white"
                  : "bg-koon-800 text-white"
              }`}
            >
              <p className="break-words">{msg.content}</p>
              <div className="flex items-center justify-end gap-2 mt-1">
                <span className="text-xs opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {msg.sender === "me" && (
                  <span className="text-xs">
                    {msg.status === "sending" && "⏳"}
                    {msg.status === "sent" && "✓✓"}
                    {msg.status === "failed" && "❌"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de message */}
      <div className="p-4 border-t border-koon-800">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez un message..."
            className="flex-1 px-4 py-3 bg-koon-900 border border-koon-700 rounded-xl focus:border-koon-accent focus:outline-none resize-none"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-3 bg-koon-accent hover:bg-koon-accent2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
