import { getDatabase } from "./mongodb"
import type { Product, BlogPost, Admin } from "./models"
import { ObjectId } from "mongodb"

// --- Product Operations ---

export async function getProducts(): Promise<Product[]> {
  try {
    const db = await getDatabase()
    const products = await db.collection<Product>("products").find({}).toArray()
    
    // Convert _id to string for consistency
    return products.map(product => ({
      ...product,
      _id: product._id?.toString(),
    }))
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const db = await getDatabase()
    if (!ObjectId.isValid(id)) {
      return null
    }
    
    const product = await db.collection<Product>("products").findOne({ _id: new ObjectId(id) })
    if (!product) return null
    
    return {
      ...product,
      _id: product._id?.toString(),
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error)
    return null
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const db = await getDatabase()
    const products = await db.collection<Product>("products")
      .find({ category })
      .sort({ createdAt: -1 })
      .toArray()
    
    return products.map(product => ({
      ...product,
      _id: product._id?.toString(),
    }))
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
}

export async function createProduct(productData: Omit<Product, "_id">): Promise<Product> {
  try {
    const db = await getDatabase()
    
    // Add timestamps
    const productWithTimestamps = {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Add default rating if not provided
      rating: productData.rating || 4.0,
    }
    
    const result = await db.collection("products").insertOne(productWithTimestamps)
    
    return {
      ...productWithTimestamps,
      _id: result.insertedId.toString(),
    } as Product
  } catch (error) {
    console.error("Error creating product:", error)
    throw new Error("Failed to create product")
  }
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
  try {
    const db = await getDatabase()
    if (!ObjectId.isValid(id)) {
      return null
    }
    
    // Remove _id from update data and add updatedAt
    const { _id, ...dataToUpdate } = productData
    const updateData = {
      ...dataToUpdate,
      updatedAt: new Date(),
    }
    
    const result = await db
      .collection<Product>("products")
      .findOneAndUpdate(
        { _id: new ObjectId(id) }, 
        { $set: updateData }, 
        { returnDocument: "after" }
      )
    
    if (!result) return null
    
    return {
      ...result,
      _id: result._id?.toString(),
    }
  } catch (error) {
    console.error("Error updating product:", error)
    return null
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const db = await getDatabase()
    if (!ObjectId.isValid(id)) {
      return false
    }
    
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount === 1
  } catch (error) {
    console.error("Error deleting product:", error)
    return false
  }
}

// --- Admin Operations ---

export async function getAdmins(): Promise<Admin[]> {
  try {
    const db = await getDatabase()
    const admins = await db
      .collection<Admin>("admins")
      .find({}, { projection: { passwordHash: 0 } })
      .toArray()
    
    return admins.map(admin => ({
      ...admin,
      _id: admin._id?.toString(),
    }))
  } catch (error) {
    console.error("Error fetching admins:", error)
    return []
  }
}

export async function createAdmin(adminData: Omit<Admin, "_id">): Promise<Admin> {
  try {
    const db = await getDatabase()
    const result = await db.collection("admins").insertOne({
      ...adminData,
      createdAt: new Date(),
    })
    
    return {
      ...adminData,
      _id: result.insertedId.toString(),
    } as Admin
  } catch (error) {
    console.error("Error creating admin:", error)
    throw new Error("Failed to create admin")
  }
}

export async function deleteAdmin(id: string): Promise<boolean> {
  try {
    const db = await getDatabase()
    if (!ObjectId.isValid(id)) {
      return false
    }
    
    const result = await db.collection("admins").deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount === 1
  } catch (error) {
    console.error("Error deleting admin:", error)
    return false
  }
}

// --- Blog Post Operations ---

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const db = await getDatabase()
    if (!ObjectId.isValid(id)) {
      return null
    }
    
    const post = await db.collection<BlogPost>("blog_posts").findOne({ _id: new ObjectId(id) })
    if (!post) return null
    
    return {
      ...post,
      _id: post._id?.toString(),
    }
  } catch (error) {
    console.error("Error fetching blog post by ID:", error)
    return null
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const db = await getDatabase()
    const posts = await db.collection<BlogPost>("blog_posts")
      .find({ published: true })
      .sort({ date: -1 })
      .toArray()
    
    return posts.map(post => ({
      ...post,
      _id: post._id?.toString(),
    }))
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const db = await getDatabase()
    const posts = await db.collection<BlogPost>("blog_posts")
      .find({ category })
      .sort({ date: -1 })
      .toArray()
    
    return posts.map(post => ({
      ...post,
      _id: post._id?.toString(),
    }))
  } catch (error) {
    console.error("Error fetching blog posts by category:", error)
    return []
  }
}