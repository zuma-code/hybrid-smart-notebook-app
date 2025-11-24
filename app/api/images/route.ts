import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";

    let images = await prisma.image.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Filtrar por búsqueda (filename o alt)
    if (search) {
      const searchLower = search.toLowerCase();
      images = images.filter(
        (img) =>
          img.filename.toLowerCase().includes(searchLower) ||
          img.alt.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}


