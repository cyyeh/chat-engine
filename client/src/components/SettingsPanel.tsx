import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProviderCard, type LLMProvider } from "./ProviderCard";

type SettingsPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  providers: LLMProvider[];
  onProviderModelChange: (providerId: string, model: string) => void;
};

export function SettingsPanel({
  isOpen,
  onClose,
  providers,
  onProviderModelChange,
}: SettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="w-80 border-l bg-background flex flex-col" data-testid="panel-settings">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">LLM Configuration</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          data-testid="button-close-settings"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Providers
            </h3>
            <p className="text-xs text-muted-foreground">
              Configure your LLM providers and select models
            </p>
          </div>
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onModelChange={(model) =>
                onProviderModelChange(provider.id, model)
              }
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
