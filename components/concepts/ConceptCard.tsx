"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
// Helper function to format relative time
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "hace unos segundos";
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  return `hace ${days} ${days === 1 ? "día" : "días"}`;
}

interface Concept {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface ConceptCardProps {
  concept: Concept;
}

export function ConceptCard({ concept }: ConceptCardProps) {
  // Extract preview text (first 150 characters)
  const preview = concept.content
    ? concept.content.replace(/<[^>]*>/g, "").substring(0, 150)
    : "Sin contenido";

  const updatedAt = new Date(concept.updatedAt);
  const timeAgo = formatTimeAgo(updatedAt);

  return (
    <Link href={`/concepts/${concept.slug}`}>
      <Card className="h-full transition-colors hover:bg-accent">
        <CardHeader>
          <CardTitle className="line-clamp-2">{concept.title}</CardTitle>
          <CardDescription>
            Actualizado {timeAgo}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {preview}
            {concept.content.length > 150 && "..."}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

