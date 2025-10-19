import { SettingsPanel } from "../SettingsPanel";

export default function SettingsPanelExample() {
  const providers = [
    {
      id: "openai",
      name: "OpenAI",
      models: ["gpt-4.1", "gpt-4.1-mini", "gpt-4.1-nano", "gpt-5.1", "gpt-5.1-mini", "gpt-5.1-nano"],
      selectedModel: "gpt-4.1",
      status: "active" as const,
      apiKey: "",
      requiresApiKey: true,
    },
    {
      id: "anthropic",
      name: "Anthropic",
      models: ["claude-3-5-sonnet", "claude-3-opus", "claude-3-haiku"],
      selectedModel: "claude-3-5-sonnet",
      status: "inactive" as const,
      apiKey: "",
      requiresApiKey: true,
    },
    {
      id: "gemini",
      name: "Google Gemini",
      models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
      selectedModel: "gemini-2.0-flash",
      status: "inactive" as const,
      apiKey: "",
      requiresApiKey: true,
    },
  ];

  return (
    <div className="h-screen flex">
      <div className="flex-1" />
      <SettingsPanel
        isOpen={true}
        onClose={() => console.log("Close settings")}
        providers={providers}
        onProviderModelChange={(id, model) =>
          console.log("Provider model changed:", id, model)
        }
        onProviderActivate={(id) => console.log("Provider activated:", id)}
        onProviderApiKeyChange={(id, key) =>
          console.log("Provider API key changed:", id)
        }
      />
    </div>
  );
}
