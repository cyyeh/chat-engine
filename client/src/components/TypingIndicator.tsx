import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-4 px-4 py-6 bg-card/50" data-testid="typing-indicator">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-accent text-accent-foreground">
          <Bot className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-75" />
        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-150" />
      </div>
    </div>
  );
}
