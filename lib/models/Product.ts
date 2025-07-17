// /lib/models/Product.ts
export interface Product {
  _id?: string
  code: string
  name: string
  category: "Flower" | "Vape" | "Edible" | "Concentrate"
  price: number
  quantity: number
  cost?: number
  image: string
  media: string // Required media field for videos/audio
  description: string
  nose?: string
  strain: "Indica" | "Sativa" | "Hybrid"
  isQP: boolean
  featured?: boolean
  qpPrice?: number
  rating?: number
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
