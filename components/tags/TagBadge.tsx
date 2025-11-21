"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagBadgeProps {
  tag: Tag;
  onRemove?: () => void;
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
}

export function TagBadge({
  tag,
  onRemove,
  variant = "default",
  size = "md",
}: TagBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium transition-colors",
        variant === "default"
          ? "bg-primary/10 text-primary hover:bg-primary/20"
          : "border border-border bg-background hover:bg-accent",
        sizeClasses[size]
      )}
      style={
        variant === "default"
          ? {
              backgroundColor: `${tag.color}20`,
              color: tag.color,
            }
          : undefined
      }
    >
      {tag.name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label={`Remove ${tag.name} tag`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

