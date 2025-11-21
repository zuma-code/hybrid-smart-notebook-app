import { ConceptView } from "@/components/concepts/ConceptView";
import { notFound } from "next/navigation";

async function getConcept(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/concepts/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching concept:", error);
    return null;
  }
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const concept = await getConcept(slug);

  if (!concept) {
    notFound();
  }

  return <ConceptView concept={concept} />;
}

