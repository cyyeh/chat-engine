import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiOpenai, SiGoogle } from "react-icons/si";
import { Brain } from "lucide-react";

export type LLMProvider = {
  id: string;
  name: string;
  models: string[];
  selectedModel: string;
  status: "active" | "inactive";
  apiKey?: string;
  requiresApiKey: boolean;
};

type ProviderCardProps = {
  provider: LLMProvider;
  onModelChange: (model: string) => void;
  onActivate: () => void;
  onApiKeyChange: (apiKey: string) => void;
};

const ProviderIcon = ({ providerId }: { providerId: string }) => {
  switch (providerId) {
    case "openai":
      return <SiOpenai className="w-5 h-5" />;
    case "anthropic":
      return <Brain className="w-5 h-5" />;
    case "gemini":
      return <SiGoogle className="w-5 h-5" />;
    default:
      return null;
  }
};

export function ProviderCard({ provider, onModelChange, onActivate, onApiKeyChange }: ProviderCardProps) {
  return (
    <Card
      className={`p-4 space-y-4 cursor-pointer hover-elevate ${
        provider.status === "active" ? "border-primary" : ""
      }`}
      onClick={onActivate}
      data-testid={`card-provider-${provider.id}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProviderIcon providerId={provider.id} />
          <h3 className="font-medium">{provider.name}</h3>
        </div>
        <Badge
          variant={provider.status === "active" ? "default" : "secondary"}
          data-testid={`badge-status-${provider.id}`}
        >
          {provider.status}
        </Badge>
      </div>
      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
        <Label htmlFor={`model-${provider.id}`}>Model</Label>
        <Select value={provider.selectedModel} onValueChange={onModelChange}>
          <SelectTrigger id={`model-${provider.id}`} data-testid={`select-model-${provider.id}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {provider.models.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {provider.requiresApiKey && (
        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
          <Label htmlFor={`apikey-${provider.id}`}>API Key</Label>
          <Input
            id={`apikey-${provider.id}`}
            type="password"
            value={provider.apiKey || ""}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="Enter your API key"
            data-testid={`input-apikey-${provider.id}`}
          />
          <p className="text-xs text-muted-foreground">
            {provider.id === "openai" && "Get your API key from platform.openai.com"}
            {provider.id === "anthropic" && "Get your API key from console.anthropic.com"}
            {provider.id === "gemini" && "Get your API key from makersuite.google.com"}
          </p>
        </div>
      )}
    </Card>
  );
}
