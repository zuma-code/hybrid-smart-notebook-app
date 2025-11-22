"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { TagBadge } from "./TagBadge";
import { Plus } from "lucide-react";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagInputProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  onCreateTag?: (name: string) => Promise<Tag>;
  onSearchTags?: (search: string) => Promise<Tag[]>;
  placeholder?: string;
  disabled?: boolean;
}

export function TagInput({
  selectedTags,
  onTagsChange,
  onCreateTag,
  onSearchTags,
  placeholder = "Buscar o crear tag...",
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputValue && onSearchTags) {
      const timeoutId = setTimeout(async () => {
        try {
          const results = await onSearchTags(inputValue);
          // Filtrar tags ya seleccionados
          const filtered = results.filter(
            (tag) => !selectedTags.some((st) => st.id === tag.id)
          );
          setSuggestions(filtered);
        } catch (error) {
          console.error("Error searching tags:", error);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, onSearchTags, selectedTags]);

  const handleSelectTag = (tag: Tag) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
    setInputValue("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleCreateTag = async () => {
    if (!inputValue.trim() || !onCreateTag) return;

    try {
      const newTag = await onCreateTag(inputValue.trim());
      handleSelectTag(newTag);
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((t) => t.id !== tagId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSelectTag(suggestions[0]);
      } else if (onCreateTag) {
        handleCreateTag();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <TagBadge
            key={tag.id}
            tag={tag}
            onRemove={() => handleRemoveTag(tag.id)}
          />
        ))}
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full"
          />
        </PopoverTrigger>
        {(suggestions.length > 0 || (inputValue.trim() && onCreateTag)) && (
          <PopoverContent className="w-full p-2" align="start">
            <div className="space-y-1">
              {suggestions.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleSelectTag(tag)}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-accent transition-colors"
                >
                  <TagBadge tag={tag} />
                </button>
              ))}
              {inputValue.trim() && onCreateTag && (
                <button
                  type="button"
                  onClick={handleCreateTag}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-accent transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Crear "{inputValue.trim()}"</span>
                </button>
              )}
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}



