"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TagInput } from "./TagInput";
import { TagBadge } from "./TagBadge";
import { Check, X } from "lucide-react";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagSelectorProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  noteType: "DailyNote" | "Concept" | "Prompt";
  noteId: string;
}

export function TagSelector({
  selectedTags,
  onTagsChange,
  noteType,
  noteId,
}: TagSelectorProps) {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchAllTags();
  }, []);

  useEffect(() => {
    if (noteId) {
      fetchNoteTags();
    }
  }, [noteId, noteType]);

  const fetchAllTags = async () => {
    try {
      const res = await fetch("/api/tags");
      if (res.ok) {
        const tags = await res.json();
        setAllTags(tags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNoteTags = async () => {
    try {
      // This would need a new API endpoint to get tags for a specific note
      // For now, we'll rely on the selectedTags prop
    } catch (error) {
      console.error("Error fetching note tags:", error);
    }
  };

  const handleTagToggle = async (tag: Tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id);

    if (isSelected) {
      // Remove tag
      try {
        await fetch(
          `/api/note-tags?noteType=${noteType}&noteId=${noteId}&tagId=${tag.id}`,
          { method: "DELETE" }
        );
        onTagsChange(selectedTags.filter((t) => t.id !== tag.id));
      } catch (error) {
        console.error("Error removing tag:", error);
      }
    } else {
      // Add tag
      try {
        const res = await fetch("/api/note-tags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            noteType,
            noteId,
            tagId: tag.id,
          }),
        });

        if (res.ok) {
          onTagsChange([...selectedTags, tag]);
        }
      } catch (error) {
        console.error("Error adding tag:", error);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <TagBadge key={tag.id} tag={tag} />
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            {selectedTags.length > 0 ? "Editar Tags" : "Agregar Tags"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Tags disponibles</h4>
              <div className="space-y-1 max-h-60 overflow-auto">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Cargando...</p>
                ) : allTags.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No hay tags disponibles
                  </p>
                ) : (
                  allTags.map((tag) => {
                    const isSelected = selectedTags.some((t) => t.id === tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent transition-colors text-sm"
                      >
                        {isSelected ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                        <TagBadge tag={tag} variant="outline" size="sm" />
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Crear nuevo tag</h4>
              <TagInput
                selectedTags={selectedTags}
                onTagsChange={(tags) => {
                  onTagsChange(tags);
                  fetchAllTags(); // Refresh list
                }}
                placeholder="Escribe y presiona Enter..."
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

