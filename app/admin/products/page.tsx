"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Edit, Trash2, Loader2, Star, Trash, Video, Music, FileX } from "lucide-react"
import ProductImage from "@/components/ProductImage"
import type { Product } from "@/lib/models/Product"
import BackButton from "../../../components/BackButton"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cleaningUp, setCleaningUp] = useState(false)

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
      } else {
        console.error("Failed to fetch products - Response not OK:", res.status)
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

  const handleToggleFeatured = async (productId: string, currentFeaturedStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/featured`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeaturedStatus })
      })
      
      if (response.ok) {
        fetchProducts() // Refresh the list
      } else {
        alert('Failed to update featured status')
      }
    } catch (error) {
      console.error('Error updating featured status:', error)
      alert('Failed to update featured status')
    }
  }

  const handleCleanupImages = async () => {
    if (!confirm("This will delete all unused images from the server. Are you sure?")) {
      return
    }

    setCleaningUp(true)
    try {
      const response = await fetch('/api/admin/cleanup-images', {
        method: 'POST'
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert(`Cleanup completed!\n${result.message}`)
      } else {
        alert('Failed to cleanup images: ' + result.message)
      }
    } catch (error) {
      console.error('Error cleaning up images:', error)
      alert('Failed to cleanup images')
    } finally {
      setCleaningUp(false)
    }
  }

  const getMediaIcon = (mediaUrl?: string) => {
    if (!mediaUrl) return <FileX className="h-4 w-4 text-gray-300" />
    
    if (mediaUrl.includes('video') || mediaUrl.includes('.mp4') || mediaUrl.includes('.avi') || mediaUrl.includes('.mov')) {
      return <Video className="h-4 w-4 text-blue-500" />
    } else if (mediaUrl.includes('audio') || mediaUrl.includes('.mp3') || mediaUrl.includes('.wav') || mediaUrl.includes('.ogg')) {
      return <Music className="h-4 w-4 text-green-500" />
    }
    return <FileX className="h-4 w-4 text-gray-300" />
  }

  const getMediaFileName = (mediaUrl?: string) => {
    if (!mediaUrl) return "No Media"
    const urlParts = mediaUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]
    return fileName.length > 15 ? fileName.substring(0, 15) + "..." : fileName
  }

  return (
    <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton to="/admin" />
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-y-4 mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <div className="flex gap-2">
          <Link href="/admin/products/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </Link>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No products found.</p>
              <Link href="/admin/products/new">
                <Button>Add Your First Product</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Image</TableHead>
                      <TableHead className="w-20">Media</TableHead>
                      <TableHead className="w-24">Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="w-24">Category</TableHead>
                      <TableHead className="w-24">Price</TableHead>
                      <TableHead className="w-20">Cost</TableHead>
                      <TableHead className="w-20">Stock</TableHead>
                      <TableHead className="w-16 text-center">QP</TableHead>
                      <TableHead className="w-24">QP Price</TableHead>
                      <TableHead className="w-20 text-center">Featured</TableHead>
                      <TableHead className="w-36 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                            <ProductImage
                              src={product.image}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col items-center gap-1">
                            {getMediaIcon(product.media)}
                            <span className="text-xs text-gray-500">
                              {getMediaFileName(product.media)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{product.code ? (product.code) : ("N/A")}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="capitalize">{product.category}</TableCell>
                        <TableCell>
                          ${product.price.toFixed(2)}
                          {!product.isQP && <span className="text-xs text-gray-500">/LB</span>}
                        </TableCell>
                        <TableCell>${product.cost?.toFixed(2) || "N/A"}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={product.isQP ? "default" : "secondary"} className="text-xs">
                            {product.isQP ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {product.qpPrice ? (
                            <span>
                              ${product.qpPrice.toFixed(2)}
                              <span className="text-xs text-gray-500">/QP</span>
                            </span>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Badge variant={product.featured ? "default" : "secondary"} className="text-xs">
                              {product.featured ? "Yes" : "No"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant={product.featured ? "default" : "outline"}
                              size="icon"
                              onClick={() => handleToggleFeatured(product._id!, product.featured || false)}
                              className={`h-8 w-8 ${product.featured ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "hover:bg-yellow-50"}`}
                              title={product.featured ? "Remove from featured" : "Add to featured"}
                            >
                              <Star className={`h-3 w-3 ${product.featured ? 'fill-white' : ''}`} />
                            </Button>
                            <Link href={`/admin/products/edit/${product._id}`}>
                              <Button variant="outline" size="icon" className="h-8 w-8" title="Edit product">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </Link>
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleDelete(product._id!)}
                              title="Delete product"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {products.map((product) => (
                  <Card key={product._id} className="border">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <ProductImage
                            src={product.image}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium text-base truncate">{product.name}</h3>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">{product.code}</Badge>
                                <Badge variant="secondary" className="text-xs capitalize">{product.category}</Badge>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 ml-2">
                              {product.featured && (
                                <Badge className="bg-yellow-500 text-white text-xs">Featured</Badge>
                              )}
                              {product.isQP && (
                                <Badge variant="default" className="text-xs">QP</Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* Media Info */}
                          {product.media && (
                            <div className="flex items-center gap-2 mb-2">
                              {getMediaIcon(product.media)}
                              <span className="text-xs text-gray-600">
                                Media: {getMediaFileName(product.media)}
                              </span>
                            </div>
                          )}
                          
                          {/* Pricing Info */}
                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">Price: </span>
                              <span className="font-medium">
                                ${product.price.toFixed(2)}
                                {!product.isQP && <span className="text-xs text-gray-500">/LB</span>}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Stock: </span>
                              <span className="font-medium">{product.quantity}</span>
                            </div>
                            {product.qpPrice && (
                              <div>
                                <span className="text-gray-500">QP Price: </span>
                                <span className="font-medium">${product.qpPrice.toFixed(2)}/QP</span>
                              </div>
                            )}
                            <div>
                              <span className="text-gray-500">Cost: </span>
                              <span className="font-medium">${product.cost?.toFixed(2) || "N/A"}</span>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 flex-wrap justify-end">
                            <Button
                              variant={product.featured ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleToggleFeatured(product._id!, product.featured || false)}
                              className={`${product.featured ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "hover:bg-yellow-50"}`}
                            >
                              <Star className={`h-3 w-3 ${product.featured ? 'fill-white' : ''}`} />
                              {/* {product.featured ? "Featured" : "Feature"} */}
                            </Button>
                            <Link href={`/admin/products/edit/${product._id}`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                                {/* Edit */}
                              </Button>
                            </Link>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDelete(product._id!)}
                            >
                              <Trash2 className="h-3 w-3" />
                              {/* Delete */}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}