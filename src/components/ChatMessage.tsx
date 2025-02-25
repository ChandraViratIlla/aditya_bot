import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isBot?: boolean;
}

export function ChatMessage({ content, isBot = true }: ChatMessageProps) {
  const formattedContent = content.split('\n').map((line, i) => {
    if (line.startsWith('•')) {
      return (
        <li key={i} className="ml-2 sm:ml-4 text-sm sm:text-base">
          {line.substring(1).trim()}
        </li>
      );
    }
    
    if (line.match(/^\d+\./)) {
      return (
        <li key={i} className="ml-2 sm:ml-4 list-decimal text-sm sm:text-base">
          {line.substring(line.indexOf('.') + 1).trim()}
        </li>
      );
    }
    
    if (line.match(/^[\u{1F3E2}\u{1F4DE}\u{260E}\u{1F4E7}\u{1F310}\u{1F558}]/u)) {
      return (
        <p key={i} className="flex items-start gap-1 sm:gap-2 mt-1 sm:mt-2 text-sm sm:text-base">
          <span className="text-base sm:text-lg flex-shrink-0">{line.charAt(0)}</span>
          <span>{line.substring(1).trim()}</span>
        </p>
      );
    }
    
    if (line.trim().endsWith(':')) {
      return (
        <h3 key={i} className="font-semibold text-base sm:text-lg mt-3 sm:mt-4 mb-1 sm:mb-2">
          {line}
        </h3>
      );
    }
    
    return (
      <p key={i} className="mt-0.5 sm:mt-1 text-sm sm:text-base">
        {line}
      </p>
    );
  });

  return (
    <div 
      className={cn(
        "message py-2 px-3 sm:py-3 sm:px-4 mb-2 sm:mb-3 rounded-lg max-w-[85%] break-words", 
        isBot 
          ? "bot-message bg-blue-50 mr-auto" 
          : "user-message bg-blue-100 ml-auto"
      )}
    >
      <div className="chat-text">
        {formattedContent}
      </div>
    </div>
  );
}