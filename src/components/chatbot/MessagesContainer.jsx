// Messages Container Component
import React from "react";
import { useRef,useEffect } from "react";
import MessageBubble from "./MessageBubble";
// FontAwesome CDN icons (using classes)
const Icon = ({ name, className = "w-5 h-5" }) => (
  <i className={`fas fa-${name} ${className}`}></i>
);

export default function MessagesContainer ({ messages, isLoading }){
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {isLoading && <MessageBubble isLoading={true} />}
      <div ref={messagesEndRef} />
    </div>
  );
};