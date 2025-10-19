import { useState, useEffect, useRef } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatMessage, type Message } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { SettingsPanel } from "@/components/SettingsPanel";
import { EmptyState } from "@/components/EmptyState";
import { TypingIndicator } from "@/components/TypingIndicator";
import { type LLMProvider } from "@/components/ProviderCard";
import { queryClient, apiRequest } from "@/lib/queryClient";

type Conversation = {
  id: string;
  title: string;
  lastMessage: Date;
};

export default function ChatPage() {
  const { toast } = useToast();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // Fetch conversations
  const { data: conversations = [], isLoading: loadingConversations } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  // Fetch messages for active conversation
  useEffect(() => {
    if (activeConversationId) {
      fetch(`/api/conversations/${activeConversationId}/messages`)
        .then((res) => res.json())
        .then((data) => {
          setMessages(data.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })));
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
          toast({
            title: "Error",
            description: "Failed to load messages",
            variant: "destructive",
          });
        });
    }
  }, [activeConversationId, toast]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await apiRequest("POST", "/api/conversations", { title });
      return res.json();
    },
    onSuccess: (newConversation: Conversation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setActiveConversationId(newConversation.id);
      setMessages([]);
    },
  });

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
  });

  const handleNewChat = () => {
    createConversationMutation.mutate("New Conversation");
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversationMutation.mutate(id);
    if (activeConversationId === id) {
      setActiveConversationId(null);
      setMessages([]);
    }
  };

  const handleSendMessage = async (content: string) => {
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

    // Create a new conversation if none exists
    let conversationId = activeConversationId;
    if (!conversationId) {
      try {
        const res = await apiRequest("POST", "/api/conversations", { title: content.slice(0, 50) });
        const newConversation: Conversation = await res.json();
        conversationId = newConversation.id;
        setActiveConversationId(conversationId);
        queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create conversation",
          variant: "destructive",
        });
        return;
      }
    }

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);
    setStreamingMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          message: content,
          provider: activeProvider.id,
          model: activeProvider.selectedModel,
          apiKey: activeProvider.apiKey || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let fullResponse = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                toast({
                  title: "Error",
                  description: data.error,
                  variant: "destructive",
                });
                setIsTyping(false);
                return;
              }

              if (data.content) {
                fullResponse += data.content;
                setStreamingMessage(fullResponse);
              }

              if (data.done) {
                const assistantMessage: Message = {
                  id: (Date.now() + 1).toString(),
                  role: "assistant",
                  content: fullResponse,
                  timestamp: new Date(),
                  provider: activeProvider.selectedModel,
                };
                setMessages((prev) => [...prev, assistantMessage]);
                setStreamingMessage("");
                setIsTyping(false);
                queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
              }
            } catch (parseError) {
              console.error("Failed to parse SSE data:", line, parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsTyping(false);
      setStreamingMessage("");
    }
  };

  const handleProviderModelChange = (providerId: string, model: string) => {
    setProviders(
      providers.map((p) =>
        p.id === providerId ? { ...p, selectedModel: model } : p
      )
    );
  };

  const handleProviderActivate = (providerId: string) => {
    setProviders(
      providers.map((p) => ({
        ...p,
        status: p.id === providerId ? "active" : "inactive",
      }))
    );
  };

  const handleProviderApiKeyChange = (providerId: string, apiKey: string) => {
    setProviders(
      providers.map((p) =>
        p.id === providerId ? { ...p, apiKey } : p
      )
    );
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
          activeConversationId={activeConversationId || undefined}
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
              <ScrollArea className="flex-1" ref={scrollRef}>
                {messages.length === 0 && !isTyping ? (
                  <EmptyState />
                ) : (
                  <div className="max-w-4xl mx-auto">
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    {isTyping && streamingMessage && (
                      <ChatMessage
                        message={{
                          id: "streaming",
                          role: "assistant",
                          content: streamingMessage,
                          timestamp: new Date(),
                          provider: activeProvider?.selectedModel,
                        }}
                      />
                    )}
                    {isTyping && !streamingMessage && <TypingIndicator />}
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
