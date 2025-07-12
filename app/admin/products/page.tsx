"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react"
import type { Product } from "@/lib/models/Product"
import BackButton from "../../../components/BackButton"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/products")
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setProducts(data.products)
        } else {
          console.error("API error fetching products:", data.message)
        }
      }
    } catch (error) {
      console.error("Failed to fetch products", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
        if (res.ok) {
          fetchProducts() // Refresh list
        } else {
          alert("Failed to delete product.")
        }
      } catch (error) {
        console.error("Failed to delete product", error)
      }
    }
  }

  return (
    <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-y-4 mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Link href="/admin/products/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Badge variant="outline">{product.code}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="capitalize">{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>${product.cost?.toFixed(2) || "N/A"}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell className="flex gap-2">
                      <Link href={`/admin/products/edit/${product._id}`}>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(product._id!)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
