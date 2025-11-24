import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const createConceptSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().default(""),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit") || "100");

    let concepts = await prisma.concept.findMany({
      take: limit,
      orderBy: [
        { updatedAt: "desc" },
        { createdAt: "desc" },
      ],
    });

    // Filter by search term (case-insensitive)
    if (search) {
      const searchLower = search.toLowerCase();
      concepts = concepts.filter(
        (concept) =>
          concept.title.toLowerCase().includes(searchLower) ||
          concept.content.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json(concepts);
  } catch (error) {
    console.error("Error fetching concepts:", error);
    return NextResponse.json(
      { error: "Failed to fetch concepts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createConceptSchema.parse(body);

    // Generate slug from title
    const baseSlug = slugify(data.title);
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug is unique
    while (await prisma.concept.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const concept = await prisma.concept.create({
      data: {
        ...data,
        slug,
      },
    });

    return NextResponse.json(concept, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    // Handle unique constraint violation (slug)
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A concept with this title already exists" },
        { status: 409 }
      );
    }

    console.error("Error creating concept:", error);
    return NextResponse.json(
      { error: "Failed to create concept" },
      { status: 500 }
    );
  }
}





