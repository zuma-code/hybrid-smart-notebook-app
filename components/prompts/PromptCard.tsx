"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TagBadge } from "@/components/tags/TagBadge";
import { Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: Array<{ tag: Tag }>;
}

interface PromptCardProps {
  prompt: Prompt;
}

const categoryColors: Record<string, string> = {
  general: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  debugging: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  refactoring: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  learning: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  documentation: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  testing: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

const categoryLabels: Record<string, string> = {
  general: "General",
  debugging: "Debugging",
  refactoring: "Refactoring",
  learning: "Learning",
  documentation: "Documentation",
  testing: "Testing",
};

export function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Link href={`/prompts/${prompt.id}`}>
      <Card className="hover:bg-accent transition-colors cursor-pointer h-full flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {prompt.isFavorite && (
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                )}
                <CardTitle className="text-lg">{prompt.title}</CardTitle>
              </div>
              <span
                className={cn(
                  "inline-block text-xs px-2 py-0.5 rounded-full font-medium",
                  categoryColors[prompt.category] || categoryColors.general
                )}
              >
                {categoryLabels[prompt.category] || prompt.category}
              </span>
            </div>
          </div>
          <CardDescription className="line-clamp-3">
            {prompt.content.substring(0, 150)}
            {prompt.content.length > 150 ? "..." : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-auto">
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {prompt.tags.slice(0, 3).map(({ tag }) => (
                <TagBadge key={tag.id} tag={tag} size="sm" />
              ))}
              {prompt.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{prompt.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

