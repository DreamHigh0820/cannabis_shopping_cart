import { getDatabase } from "./mongodb"
import type { Product, BlogPost, Admin } from "./models"
import { ObjectId } from "mongodb"

// --- Product Operations ---

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

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDatabase()
  if (!ObjectId.isValid(id)) {
    return null
  }
  const product = await db.collection<Product>("products").findOne({ _id: new ObjectId(id) })
  return product
}

export async function createProduct(productData: Omit<Product, "_id">): Promise<Product> {
  const db = await getDatabase()
  const result = await db.collection<Omit<Product, "_id">>("products").insertOne(productData)
  const newProduct = { ...productData, _id: result.insertedId }
  return newProduct as Product
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
  const db = await getDatabase()
  if (!ObjectId.isValid(id)) {
    return null
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...dataToUpdate } = productData // Don't update the _id
  const result = await db
    .collection<Product>("products")
    .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: dataToUpdate }, { returnDocument: "after" })
  return result
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDatabase()
  if (!ObjectId.isValid(id)) {
    return false
  }
  const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount === 1
}

// --- Admin Operations ---

export async function getAdmins(): Promise<Admin[]> {
  const db = await getDatabase()
  // Exclude password hash from the result
  const admins = await db
    .collection<Admin>("admins")
    .find({}, { projection: { passwordHash: 0 } })
    .toArray()
  return admins
}

export async function createAdmin(adminData: Omit<Admin, "_id">): Promise<Admin> {
  const db = await getDatabase()
  const result = await db.collection<Omit<Admin, "_id">>("admins").insertOne(adminData)
  const newAdmin = { ...adminData, _id: result.insertedId }
  return newAdmin as Admin
}

export async function deleteAdmin(id: string): Promise<boolean> {
  const db = await getDatabase()
  const result = await db.collection("admins").deleteOne({ id: id })
  return result.deletedCount === 1
}

// --- Blog Post Operations (for completeness) ---
export async function getBlogPostById(id: string): Promise<Product | null> {
  const db = await getDatabase()
  if (!ObjectId.isValid(id)) {
    return null
  }
  const product = await db.collection<Product>("blog_posts").findOne({ _id: new ObjectId(id) })
  return product
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

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const db = await getDatabase()
    const posts = await db.collection<BlogPost>("blog_posts").find({ category }).sort({ date: -1 }).toArray()
    return posts
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

