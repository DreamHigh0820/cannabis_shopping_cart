export interface Product {
  _id?: string
  id: number
  name: string
  category: string
  price: number
  image: string
  rating: number
  description: string
  thc: string
  cbd: string
  strain?: string
  featured?: boolean
  inStock?: boolean
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
