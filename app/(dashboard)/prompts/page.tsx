import { PromptVault } from "@/components/prompts/PromptVault";

export default function PromptsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prompt Vault</h1>
        <p className="text-muted-foreground">
          Tu repositorio de prompts de Cursor y chats
        </p>
      </div>
      <PromptVault />
    </div>
  );
}

