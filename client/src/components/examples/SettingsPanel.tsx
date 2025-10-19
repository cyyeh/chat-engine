import { SettingsPanel } from "../SettingsPanel";

export default function SettingsPanelExample() {
  const providers = [
    {
      id: "openai",
      name: "OpenAI",
      models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"],
      selectedModel: "gpt-4o",
      status: "active" as const,
    },
    {
      id: "anthropic",
      name: "Anthropic",
      models: ["claude-3-5-sonnet", "claude-3-opus", "claude-3-haiku"],
      selectedModel: "claude-3-5-sonnet",
      status: "inactive" as const,
    },
    {
      id: "gemini",
      name: "Google Gemini",
      models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
      selectedModel: "gemini-2.0-flash",
      status: "inactive" as const,
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
      />
    </div>
  );
}
