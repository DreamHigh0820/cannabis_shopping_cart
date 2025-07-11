import { type NextRequest, NextResponse } from "next/server"
import { getBlogPostById } from "@/lib/db-operations"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await getBlogPostById(params.id)

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}
