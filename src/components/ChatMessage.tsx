import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isBot?: boolean;
}

export function ChatMessage({ content, isBot = true }: ChatMessageProps) {
  const formattedContent = content.split('\n').map((line, i) => {
    if (line.startsWith('•')) {
      return (
        <li key={i} className="ml-4 text-sm sm:text-base list-disc">
          {line.substring(1).trim()}
        </li>
      );
    }
    if (line.match(/^\d+\./)) {
      return (
        <li key={i} className="ml-4 text-sm sm:text-base list-decimal">
          {line.substring(line.indexOf('.') + 1).trim()}
        </li>
      );
    }
    if (line.match(/^[\u{1F3E2}\u{1F4DE}\u{260E}\u{1F4E7}\u{1F310}\u{1F558}]/u)) {
      return (
        <p key={i} className="flex items-start gap-2 mt-2 text-sm sm:text-base">
          <span className="text-lg flex-shrink-0">{line.charAt(0)}</span>
          <span>{line.substring(1).trim()}</span>
        </p>
      );
    }
    if (line.trim().endsWith(':')) {
      return (
        <h3 key={i} className="font-semibold text-base sm:text-lg mt-4 mb-2">
          {line}
        </h3>
      );
    }
    return (
      <p key={i} className="mt-1 text-sm sm:text-base">
        {line}
      </p>
    );
  });

  return (
    <div 
      className={cn(
        "message py-3 px-4 mb-3 rounded-lg max-w-[90%] break-words shadow-sm", 
        isBot 
          ? "bot-message bg-blue-50 text-gray-800 mr-auto" 
          : "user-message bg-blue-100 text-gray-700 ml-auto"
      )}
    >
      <div className="chat-text">
        {formattedContent}
      </div>
    </div>
  );
}