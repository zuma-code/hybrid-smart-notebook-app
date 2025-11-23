import { ConceptView } from "@/components/concepts/ConceptView";

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ConceptView slug={slug} />;
}




