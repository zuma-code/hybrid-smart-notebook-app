import { PromptView } from "@/components/prompts/PromptView";

export default async function PromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PromptView id={id} />;
}





