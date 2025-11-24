"use client";

import { SearchResult, highlightText } from "@/lib/search";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, BookOpen, MessageSquare, Image as ImageIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

interface SearchResultsProps {
  results: SearchResult[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  query: string;
}

const TYPE_LABELS: Record<string, string> = {
  DailyNote: "Nota diaria",
  Concept: "Concepto",
  Prompt: "Prompt",
  Image: "Imagen",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  DailyNote: <Calendar className="h-4 w-4" />,
  Concept: <BookOpen className="h-4 w-4" />,
  Prompt: <MessageSquare className="h-4 w-4" />,
  Image: <ImageIcon className="h-4 w-4" />,
};

export function SearchResults({
  results,
  selectedIndex,
  onSelect,
  query,
}: SearchResultsProps) {
  // Este componente solo se renderiza cuando hay resultados
  if (results.length === 0) {
    return null;
  }

  // Agrupar por tipo
  const grouped = results.reduce((acc, result, index) => {
    const type = result.item.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push({ ...result, originalIndex: index });
    return acc;
  }, {} as Record<string, Array<SearchResult & { originalIndex: number }>>);

  return (
    <div className="max-h-[60vh] overflow-y-auto">
      {Object.entries(grouped).map(([type, items]) => (
        <div key={type} className="mb-4">
          <div className="mb-2 flex items-center gap-2 px-2 text-xs font-semibold text-muted-foreground uppercase">
            {TYPE_ICONS[type]}
            <span>{TYPE_LABELS[type]}</span>
            <span className="text-muted-foreground/70">({items.length})</span>
          </div>
          <div className="space-y-1">
            {items.map((result) => {
              const index = result.originalIndex;
              const isSelected = index === selectedIndex;
              const titleMatch = result.matches?.find((m) => m.key === "title");
              const contentMatch = result.matches?.find((m) => m.key === "content");

              return (
                <Link
                  key={result.item.id}
                  href={result.item.url}
                  onClick={(e) => {
                    if (isSelected) {
                      e.preventDefault();
                      // La navegación se manejará automáticamente con el Link
                    }
                  }}
                >
                  <Card
                    className={cn(
                      "cursor-pointer transition-colors",
                      isSelected
                        ? "bg-accent border-primary"
                        : "hover:bg-accent/50"
                    )}
                    onMouseEnter={() => onSelect(index)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-muted-foreground">
                          {TYPE_ICONS[type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-sm font-medium truncate"
                            dangerouslySetInnerHTML={{
                              __html: titleMatch
                                ? highlightText(result.item.title, [titleMatch])
                                : result.item.title,
                            }}
                          />
                          {result.item.content && (
                            <div
                              className="mt-1 text-xs text-muted-foreground line-clamp-2"
                              dangerouslySetInnerHTML={{
                                __html: contentMatch
                                  ? highlightText(
                                      result.item.content.substring(0, 100),
                                      [contentMatch]
                                    )
                                  : result.item.content.substring(0, 100),
                              }}
                            />
                          )}
                          {result.item.date && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              {formatDate(new Date(result.item.date).toISOString().split("T")[0])}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

