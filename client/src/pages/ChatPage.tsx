import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppSidebar, type Conversation } from "@/components/app-sidebar";
import { ChatMessage, type Message } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { SettingsPanel } from "@/components/SettingsPanel";
import { EmptyState } from "@/components/EmptyState";
import { TypingIndicator } from "@/components/TypingIndicator";
import { type LLMProvider } from "@/components/ProviderCard";

export default function ChatPage() {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "New Conversation",
      lastMessage: new Date(),
    },
  ]);
  const [activeConversationId, setActiveConversationId] = useState<string>("1");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [providers, setProviders] = useState<LLMProvider[]>([
    {
      id: "openai",
      name: "OpenAI",
      models: ["gpt-4.1", "gpt-4.1-mini", "gpt-4.1-nano", "gpt-5.1", "gpt-5.1-mini", "gpt-5.1-nano"],
      selectedModel: "gpt-4.1",
      status: "active",
      apiKey: "",
      requiresApiKey: true,
    },
    {
      id: "anthropic",
      name: "Anthropic",
      models: ["claude-3-5-sonnet", "claude-3-opus", "claude-3-haiku"],
      selectedModel: "claude-3-5-sonnet",
      status: "inactive",
      apiKey: "",
      requiresApiKey: true,
    },
    {
      id: "gemini",
      name: "Google Gemini",
      models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
      selectedModel: "gemini-2.0-flash",
      status: "inactive",
      apiKey: "",
      requiresApiKey: true,
    },
  ]);

  const activeProvider = providers.find((p) => p.status === "active");

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newConversation: Conversation = {
      id: newId,
      title: "New Conversation",
      lastMessage: new Date(),
    };
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newId);
    setMessages([]);
    console.log("New chat created");
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setMessages([]);
    console.log("Selected conversation:", id);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(conversations.filter((c) => c.id !== id));
    if (activeConversationId === id && conversations.length > 1) {
      const nextConversation = conversations.find((c) => c.id !== id);
      if (nextConversation) {
        setActiveConversationId(nextConversation.id);
      }
    }
    console.log("Deleted conversation:", id);
  };

  const handleSendMessage = (content: string) => {
    if (!activeProvider) {
      toast({
        title: "No Provider Selected",
        description: "Please select an LLM provider in settings.",
        variant: "destructive",
      });
      return;
    }

    if (activeProvider.requiresApiKey && !activeProvider.apiKey?.trim()) {
      toast({
        title: "API Key Required",
        description: `Please enter your ${activeProvider.name} API key in settings.`,
        variant: "destructive",
      });
      setSettingsOpen(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);

    if (messages.length === 0 && conversations.length > 0) {
      const updatedConversations = conversations.map((c) =>
        c.id === activeConversationId
          ? { ...c, title: content.slice(0, 50) }
          : c
      );
      setConversations(updatedConversations);
    }

    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `This is a demo response from ${activeProvider?.name || "the AI"}. In the full application, this will connect to the actual LLM API and stream responses in real-time.`,
        timestamp: new Date(),
        provider: activeProvider?.selectedModel,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);

    console.log("Message sent:", content);
  };

  const handleProviderModelChange = (providerId: string, model: string) => {
    setProviders(
      providers.map((p) =>
        p.id === providerId ? { ...p, selectedModel: model } : p
      )
    );
    console.log("Provider model changed:", providerId, model);
  };

  const handleProviderActivate = (providerId: string) => {
    setProviders(
      providers.map((p) => ({
        ...p,
        status: p.id === providerId ? "active" : "inactive",
      }))
    );
    console.log("Provider activated:", providerId);
  };

  const handleProviderApiKeyChange = (providerId: string, apiKey: string) => {
    setProviders(
      providers.map((p) =>
        p.id === providerId ? { ...p, apiKey } : p
      )
    );
    console.log("Provider API key changed:", providerId);
  };

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex h-screen w-full">
        <AppSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-3 border-b bg-background">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              {activeProvider && (
                <div className="text-sm text-muted-foreground">
                  {activeProvider.name} • {activeProvider.selectedModel}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSettingsOpen(!settingsOpen)}
                data-testid="button-open-settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </header>
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden">
              <ScrollArea className="flex-1">
                {messages.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="max-w-4xl mx-auto">
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    {isTyping && <TypingIndicator />}
                  </div>
                )}
              </ScrollArea>
              <ChatInput onSend={handleSendMessage} disabled={isTyping} />
            </div>
            <SettingsPanel
              isOpen={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              providers={providers}
              onProviderModelChange={handleProviderModelChange}
              onProviderActivate={handleProviderActivate}
              onProviderApiKeyChange={handleProviderApiKeyChange}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
