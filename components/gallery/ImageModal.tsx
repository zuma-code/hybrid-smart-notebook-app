"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageModalProps {
  image: {
    id: string;
    filename: string;
    path: string;
    alt: string;
    createdAt: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: () => void;
}

export function ImageModal({
  image,
  open,
  onOpenChange,
  onDelete,
}: ImageModalProps) {
  const [deleting, setDeleting] = useState(false);

  if (!image) return null;

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${image.filename}"?`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/images/${image.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        if (onDelete) {
          onDelete();
        }
        onOpenChange(false);
      } else {
        alert("Error al eliminar la imagen.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Error al eliminar la imagen.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{image.filename}</DialogTitle>
            <div className="flex gap-2">
              {onDelete && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative w-full h-[60vh] bg-muted rounded-lg overflow-hidden">
            <Image
              src={image.path}
              alt={image.alt || image.filename}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          </div>
          {image.alt && (
            <p className="text-sm text-muted-foreground">
              <strong>Alt text:</strong> {image.alt}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Subida el {new Date(image.createdAt).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

