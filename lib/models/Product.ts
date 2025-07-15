export interface Product {
  _id?: string // MongoDB ObjectId as string
  code: string // e.g., XXYY##
  name: string
  category: string
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
  isQP?: boolean
  qpPrice?: number
  rating?: number // Add rating for the menu page
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
