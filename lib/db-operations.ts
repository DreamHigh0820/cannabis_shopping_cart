import { getDatabase } from "./mongodb"
import type { Product, BlogPost } from "./models/Product"

export async function getProducts(): Promise<Product[]> {
  try {
    const db = await getDatabase()
    const products = await db.collection<Product>("products").find({}).toArray()
    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const db = await getDatabase()
    const products = await db.collection<Product>("products").find({ category }).toArray()
    return products
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const db = await getDatabase()
    const products = await db.collection<Product>("products").find({ featured: true }).limit(4).toArray()
    return products
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const db = await getDatabase()
    const posts = await db.collection<BlogPost>("blog_posts").find({ published: true }).sort({ date: -1 }).toArray()
    return posts
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  try {
    const db = await getDatabase()
    const post = await db.collection<BlogPost>("blog_posts").findOne({ id, published: true })
    return post
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const db = await getDatabase()
    const posts = await db
      .collection<BlogPost>("blog_posts")
      .find({ category, published: true })
      .sort({ date: -1 })
      .toArray()
    return posts
  } catch (error) {
    console.error("Error fetching blog posts by category:", error)
    return []
  }
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  try {
    const db = await getDatabase()
    const posts = await db
      .collection<BlogPost>("blog_posts")
      .find({ featured: true, published: true })
      .limit(3)
      .toArray()
    return posts
  } catch (error) {
    console.error("Error fetching featured blog posts:", error)
    return []
  }
}
