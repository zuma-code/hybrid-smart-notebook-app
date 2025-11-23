"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface Image {
  id: string;
  filename: string;
  path: string;
  alt: string;
  createdAt: string;
}

interface ImagePickerProps {
  onSelect: (imagePath: string, alt: string) => void;
  trigger?: React.ReactNode;
}

export function ImagePicker({ onSelect, trigger }: ImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchImages = async () => {
    setLoading(true);
    try {
      const url = search
        ? `/api/images?search=${encodeURIComponent(search)}`
        : "/api/images";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchImages();
    }
  }, [open, search]);

  const handleSelect = (image: Image) => {
    onSelect(image.path, image.alt || image.filename);
    setOpen(false);
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <ImageIcon className="mr-2 h-4 w-4" />
      Insertar Imagen
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Seleccionar Imagen</DialogTitle>
          <DialogDescription>
            Elige una imagen de tu galería para insertar
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar imágenes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {search
                    ? "No se encontraron imágenes"
                    : "No hay imágenes en tu galería"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-3 max-h-[60vh] overflow-y-auto">
              {images.map((image) => (
                <Card
                  key={image.id}
                  className="cursor-pointer hover:bg-accent transition-colors overflow-hidden"
                  onClick={() => handleSelect(image)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-video w-full bg-muted">
                      <Image
                        src={image.path}
                        alt={image.alt || image.filename}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-sm font-medium truncate">
                        {image.filename}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

