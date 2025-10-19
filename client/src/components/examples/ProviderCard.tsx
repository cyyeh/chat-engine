import { ProviderCard } from "../ProviderCard";

export default function ProviderCardExample() {
  const provider = {
    id: "openai",
    name: "OpenAI",
    models: ["gpt-4.1", "gpt-4.1-mini", "gpt-4.1-nano", "gpt-5.1", "gpt-5.1-mini", "gpt-5.1-nano"],
    selectedModel: "gpt-4.1",
    status: "active" as const,
    apiKey: "",
    requiresApiKey: true,
  };

  return (
    <div className="p-4 max-w-md">
      <ProviderCard
        provider={provider}
        onModelChange={(model) => console.log("Model changed:", model)}
        onActivate={() => console.log("Provider activated")}
        onApiKeyChange={(key) => console.log("API key changed")}
      />
    </div>
  );
}
