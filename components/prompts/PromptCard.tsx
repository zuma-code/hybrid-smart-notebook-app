"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PromptCardProps {
  prompt: Prompt;
}

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  debugging: "Debugging",
  refactoring: "Refactoring",
  learning: "Learning",
  documentation: "Documentación",
};

const CATEGORY_COLORS: Record<string, string> = {
  general: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  debugging: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  refactoring: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  learning: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  documentation: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

export function PromptCard({ prompt }: PromptCardProps) {
  // Extract preview text (first 150 characters)
  const preview = prompt.content
    ? prompt.content.replace(/<[^>]*>/g, "").substring(0, 150)
    : "Sin contenido";

  return (
    <Link href={`/prompts/${prompt.id}`}>
      <Card className="h-full transition-colors hover:bg-accent relative">
        {prompt.isFavorite && (
          <div className="absolute top-2 right-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 flex-1">{prompt.title}</CardTitle>
          </div>
          <CardDescription>
            <Badge
              variant="secondary"
              className={CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS.general}
            >
              {CATEGORY_LABELS[prompt.category] || prompt.category}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {preview}
            {prompt.content.length > 150 && "..."}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}




