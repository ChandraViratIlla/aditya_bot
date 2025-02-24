
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isBot?: boolean;
}

export function ChatMessage({ content, isBot = true }: ChatMessageProps) {
  const formattedContent = content.split('\n').map((line, i) => {
    if (line.startsWith('•')) {
      return <li key={i} className="ml-4">{line.substring(1).trim()}</li>;
    }
    if (line.match(/^\d+\./)) {
      return <li key={i} className="ml-4 list-decimal">{line.substring(line.indexOf('.') + 1).trim()}</li>;
    }
    if (line.match(/^[🏢📞☎️📧🌐🕘]/)) {
      return (
        <p key={i} className="flex items-start gap-2 mt-2">
          <span className="text-lg">{line.charAt(0)}</span>
          <span>{line.substring(1).trim()}</span>
        </p>
      );
    }
    if (line.trim().endsWith(':')) {
      return <h3 key={i} className="font-semibold text-lg mt-4 mb-2">{line}</h3>;
    }
    return <p key={i} className="mt-1">{line}</p>;
  });

  return (
    <div className={cn("message", isBot ? "bot-message" : "user-message")}>
      <div className="chat-text">
        {formattedContent}
      </div>
    </div>
  );
}
