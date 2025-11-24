"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onUploadSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function ImageUpload({ onUploadSuccess, trigger }: ImageUploadProps) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("image/")) {
        setFile(droppedFile);
        if (!alt) {
          setAlt(droppedFile.name.replace(/\.[^/.]+$/, ""));
        }
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!alt) {
        setAlt(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", alt || file.name);

      const res = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setOpen(false);
        setFile(null);
        setAlt("");
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        const error = await res.json();
        alert(`Error al subir imagen: ${error.error || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir imagen.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setAlt("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const defaultTrigger = (
    <Button>
      <Upload className="mr-2 h-4 w-4" />
      Subir Imagen
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subir Imagen</DialogTitle>
          <DialogDescription>
            Sube una imagen desde tu computadora (máx. 5MB)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25",
              file && "border-primary"
            )}
          >
            {file ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-medium">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    className="h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Arrastra una imagen aquí o
                  </p>
                  <Button
                    variant="link"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm"
                  >
                    haz clic para seleccionar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, GIF, WebP (máx. 5MB)
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {file && (
            <div>
              <Label htmlFor="alt">Texto alternativo (alt)</Label>
              <Input
                id="alt"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Descripción de la imagen"
                className="mt-1"
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                handleRemoveFile();
              }}
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? "Subiendo..." : "Subir"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


