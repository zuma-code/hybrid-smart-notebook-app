"use client";

import { useEffect, useState } from "react";
import { TagInput } from "./TagInput";

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
  const [loading, setLoading] = useState(false);

  // Buscar tags
  const searchTags = async (search: string): Promise<Tag[]> => {
    try {
      const res = await fetch(`/api/tags?search=${encodeURIComponent(search)}`);
      if (res.ok) {
        return await res.json();
      }
      return [];
    } catch (error) {
      console.error("Error searching tags:", error);
      return [];
    }
  };

  // Crear nuevo tag
  const createTag = async (name: string): Promise<Tag> => {
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        return await res.json();
      }
      throw new Error("Failed to create tag");
    } catch (error) {
      console.error("Error creating tag:", error);
      throw error;
    }
  };

  // Agregar tag a la nota
  const handleAddTag = async (tag: Tag) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/notes/${noteType}/${noteId}/tags`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tagId: tag.id }),
        }
      );

      if (res.ok) {
        onTagsChange([...selectedTags, tag]);
      }
    } catch (error) {
      console.error("Error adding tag to note:", error);
    } finally {
      setLoading(false);
    }
  };

  // Remover tag de la nota
  const handleRemoveTag = async (tag: Tag) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/notes/${noteType}/${noteId}/tags?tagId=${tag.id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        onTagsChange(selectedTags.filter((t) => t.id !== tag.id));
      }
    } catch (error) {
      console.error("Error removing tag from note:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = async (tags: Tag[]) => {
    // Determinar qué tags se agregaron o removieron
    const added = tags.filter(
      (t) => !selectedTags.some((st) => st.id === t.id)
    );
    const removed = selectedTags.filter(
      (st) => !tags.some((t) => t.id === st.id)
    );

    // Agregar nuevos tags
    for (const tag of added) {
      await handleAddTag(tag);
    }

    // Remover tags eliminados
    for (const tag of removed) {
      await handleRemoveTag(tag);
    }
  };

  return (
    <TagInput
      selectedTags={selectedTags}
      onTagsChange={handleTagsChange}
      onCreateTag={createTag}
      onSearchTags={searchTags}
      placeholder="Buscar o crear tag..."
      disabled={loading}
    />
  );
}






