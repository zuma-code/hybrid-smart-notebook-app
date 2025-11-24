import { ImageGallery } from "@/components/gallery/ImageGallery";

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Galería de Imágenes</h1>
        <p className="text-muted-foreground">
          Administra y visualiza todas tus imágenes
        </p>
      </div>
      <ImageGallery />
    </div>
  );
}


