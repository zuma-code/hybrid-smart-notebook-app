"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ImageIcon } from "lucide-react";
import Image from "next/image";
import { ImageModal } from "./ImageModal";
import { ImageUpload } from "./ImageUpload";
import { Skeleton } from "@/components/ui/skeleton";

interface Image {
  id: string;
  filename: string;
  path: string;
  alt: string;
  createdAt: string;
}

export function ImageGallery() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchImages = async () => {
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
    fetchImages();
  }, [search]);

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const handleDelete = () => {
    fetchImages();
    setModalOpen(false);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar imágenes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <ImageUpload onUploadSuccess={fetchImages} />
      </div>

      {images.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {search
                ? "No se encontraron imágenes"
                : "No hay imágenes aún"}
            </p>
            {!search && <ImageUpload onUploadSuccess={fetchImages} />}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <Card
              key={image.id}
              className="cursor-pointer hover:bg-accent transition-colors overflow-hidden"
              onClick={() => handleImageClick(image)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-square w-full bg-muted">
                  <Image
                    src={image.path}
                    alt={image.alt || image.filename}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium truncate">
                    {image.filename}
                  </p>
                  {image.alt && (
                    <p className="text-xs text-muted-foreground truncate">
                      {image.alt}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ImageModal
        image={selectedImage}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onDelete={handleDelete}
      />
    </div>
  );
}

