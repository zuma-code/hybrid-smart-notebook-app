import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { prisma } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Buscar imagen en BD
    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Eliminar archivo físico
    const filepath = join(process.cwd(), "public", image.path);
    if (existsSync(filepath)) {
      await unlink(filepath);
    }

    // Eliminar de BD
    await prisma.image.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}

