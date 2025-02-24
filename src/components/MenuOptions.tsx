
import { cn } from "@/lib/utils";

interface MenuOptionsProps {
  options: { [key: string]: string };
  onSelect: (key: string) => void;
  className?: string;
}

export function MenuOptions({ options, onSelect, className }: MenuOptionsProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-2", className)}>
      {Object.entries(options).map(([key, value]) => (
        <button
          key={key}
          className="menu-button"
          onClick={() => onSelect(key)}
        >
          {value}
        </button>
      ))}
    </div>
  );
}
