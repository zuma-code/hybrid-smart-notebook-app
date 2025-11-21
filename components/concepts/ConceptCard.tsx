"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen } from "lucide-react";

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
  return (
    <Link href={`/concepts/${concept.slug}`}>
      <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">{concept.title}</CardTitle>
          </div>
          <CardDescription>
            {concept.content
              ? `${concept.content.substring(0, 150)}${concept.content.length > 150 ? "..." : ""}`
              : "Sin contenido"}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

