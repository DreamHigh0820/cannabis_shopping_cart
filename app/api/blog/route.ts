import { type NextRequest, NextResponse } from "next/server"
import { getBlogPosts, getBlogPostsByCategory } from "@/lib/db-operations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const category = searchParams.get("category")

    let posts
    if (category && category !== "All") {
      posts = await getBlogPostsByCategory(category)
    } else {
      posts = await getBlogPosts()
    }

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}