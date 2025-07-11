export type ProductCategory = "flowers" | "vapes" | "edibles" | "extracts" | "pound"

export interface Product {
  _id?: string
  id: number
  code: string // e.g., XXYY##
  name: string
  category: ProductCategory
  price: number
  quantity: number // Stock quantity
  image: string
  description: string
  nose: string
  strain: string
  cost?: number // Admin-only field
  featured?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface BlogPost {
  _id?: string
  id: number
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  image: string
  category: string
  readTime: string
  featured?: boolean
  published?: boolean
  createdAt?: Date
  updatedAt?: Date
}
