import { ProviderCard } from "../ProviderCard";

export default function ProviderCardExample() {
  const provider = {
    id: "openai",
    name: "OpenAI",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"],
    selectedModel: "gpt-4o",
    status: "active" as const,
    apiKey: "",
    requiresApiKey: false,
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
