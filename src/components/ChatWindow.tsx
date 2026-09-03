// Fenêtre de conversation avec historique et input
import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { useAppStore } from "../store/appStore";
import type { Contact, Message } from "../types";

interface Props {
  contact: Contact;
}

// Composant Message mémoïsé pour éviter re-renders inutiles
const MessageItem = memo(({ msg }: { msg: Message }) => {
  const formattedTime = useMemo(() => {
    return new Date(msg.timestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [msg.timestamp]);

  return (
    <div
      id={`MsgContainer${msg.id}`}
      title={`MsgContainer${msg.id}`}
      className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} animate-slideIn`}
    >
      <div
        id={`MsgBubble${msg.id}`}
        title={`MsgBubble${msg.id}`}
        className={`max-w-md px-4 py-2 rounded-2xl ${
          msg.sender === "me"
            ? "bg-koon-900 text-white"
            : "bg-koon-100 text-koon-text-primary border border-koon-border-light"
        }`}
      >
        <p id={`MsgContent${msg.id}`} title={`MsgContent${msg.id}`} className="break-words">{msg.content}</p>
        <div id={`MsgMeta${msg.id}`} title={`MsgMeta${msg.id}`} className="flex items-center justify-end gap-2 mt-1">
          <span id={`MsgTime${msg.id}`} title={`MsgTime${msg.id}`} className={`text-xs ${msg.sender === "me" ? "opacity-70" : "text-koon-text-tertiary"}`}>
            {formattedTime}
          </span>
          {msg.sender === "me" && (
            <span id={`MsgStatus${msg.id}`} title={`MsgStatus${msg.id}`} className="text-xs">
              {msg.status === "sending" && (
                <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              {msg.status === "sent" && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {msg.status === "failed" && (
                <svg className="w-3 h-3 text-koon-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

MessageItem.displayName = "MessageItem";

export default function ChatWindow({ contact }: Props) {
  // Sélecteur optimisé : ne subscribe qu'aux messages
  const messages = useAppStore((state) => state.messages);
  const sendMessage = useAppStore((state) => state.sendMessage);
  
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Scroll uniquement quand le nombre de messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput("");
  }, [input, sendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <>
      {/* Header du contact */}
      <div id="ChatHeader4" title="ChatHeader4 - Chat Window Header" className="p-4 border-b border-koon-border-light flex items-center bg-koon-50">
        <div id="ContactInfo4" title="ContactInfo4 - Contact Information" className="flex-1">
          <h3 id="ContactNameHeader4" title="ContactNameHeader4 - Contact Name" className="font-medium text-koon-900">{contact.name}</h3>
          <p id="ContactPubKey4" title="ContactPubKey4 - Contact Public Key" className="text-xs text-koon-text-secondary font-mono truncate">
            {contact.publicKey.slice(0, 32)}...
          </p>
        </div>
      </div>

      {/* Zone de messages optimisée */}
      <div id="MessagesScroll4" title="MessagesScroll4 - Messages Scroll Area" className="flex-1 overflow-y-auto p-4 space-y-3 bg-koon-50">
        {messages.map((msg) => (
          <MessageItem key={msg.id} msg={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de message */}
      <div id="InputArea4" title="InputArea4 - Message Input Area" className="p-4 border-t border-koon-border-light bg-koon-50">
        <div id="InputGroup4" title="InputGroup4 - Input Group" className="flex gap-2">
          <textarea
            id="InputMsg4"
            title="InputMsg4 - Message Input Field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez un message..."
            className="flex-1 px-4 py-3 bg-koon-50 border border-koon-border-light rounded-xl focus:border-koon-900 focus:outline-none resize-none text-koon-text-primary"
            rows={1}
          />
          <button
            id="BtnSend4"
            title="BtnSend4 - Send Message Button"
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-3 bg-koon-900 hover:bg-koon-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors text-white"
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
