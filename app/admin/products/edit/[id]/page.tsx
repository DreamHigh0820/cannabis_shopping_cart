"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import ProductForm from "../../ProductForm"
import BackButton from "../../../../../components/BackButton"
import { Loader2 } from "lucide-react"
import type { Product } from "@/lib/models/Product"

export default function EditProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProduct(data.product)
          } else {
            console.error("API Error:", data.message)
          }
          setLoading(false)
        })
        .catch((err) => {
          console.error("Fetch Error:", err)
          setLoading(false)
        })
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8">
        <BackButton />
        <h1 className="text-2xl font-bold">Product not found.</h1>
      </div>
    )
  }

  return (
    <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <ProductForm product={product} isEditing={true} />
    </div>
  )
}
