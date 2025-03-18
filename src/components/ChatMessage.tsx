// src/components/ChatMessage.tsx
import React, { useState, useEffect } from "react";
import "./ChatMessage.css";

export interface ChatMessageProps {
  content: string;
  isBot: boolean;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ content, isBot, className }) => {
  const [isTyping, setIsTyping] = useState(isBot);
  const [displayedContent, setDisplayedContent] = useState("");

  const parseContent = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    return lines.map((line, index) => {
      const formattedLine = line.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
      return (
        <p key={index} className="message-line" dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  useEffect(() => {
    if (!isBot || !isTyping) return;

    const typingSpeed = 30;
    let currentIndex = 0;
    const fullContent = content;

    const typingInterval = setInterval(() => {
      if (currentIndex < fullContent.length) {
        setDisplayedContent(fullContent.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [isBot, content, isTyping]);

  return (
    <div
      className={`${
        isBot ? "bot-message" : "user-message"
      } ${isTyping ? "typing" : ""} ${className || ""}`}
    >
      {isTyping ? (
        <div className="flex items-center">
          <span>{parseContent(displayedContent)}</span>
          <span className="typing-indicator ml-2">...</span>
        </div>
      ) : (
        parseContent(content)
      )}
    </div>
  );
};