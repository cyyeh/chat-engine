import { MessageSquare, Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full" data-testid="empty-state">
      <div className="text-center space-y-4 max-w-md px-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold flex items-center justify-center gap-2">
            Start a Conversation
            <Sparkles className="w-5 h-5 text-accent" />
          </h2>
          <p className="text-muted-foreground">
            Send a message to begin chatting with your configured LLM provider.
            Switch between OpenAI, Anthropic, and Gemini models anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
