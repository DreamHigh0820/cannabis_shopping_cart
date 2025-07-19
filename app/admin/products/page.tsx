"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Edit, Trash2, Loader2, Star, Trash, Video, Music, FileX, Search, Filter, X, Tag } from "lucide-react"
import ProductImage from "@/components/ProductImage"
import type { Product } from "@/lib/models/Product"
import BackButton from "../../../components/BackButton"

interface FilterState {
  category: string
  featured: string
  qp: string
  inStock: string
  hasMedia: string
  onSale: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cleaningUp, setCleaningUp] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    featured: "all",
    qp: "all",
    inStock: "all",
    hasMedia: "all",
    onSale: "all"
  })
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

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

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))]
    return uniqueCategories.sort()
  }, [products])

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = !searchTerm ||
        product.name.toLowerCase().includes(searchLower) ||
        product.code?.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)

      // Category filter
      const matchesCategory = filters.category === "all" || product.category === filters.category

      // Featured filter
      const matchesFeatured = filters.featured === "all" ||
        (filters.featured === "yes" && product.featured) ||
        (filters.featured === "no" && !product.featured)

      // QP filter
      const matchesQP = filters.qp === "all" ||
        (filters.qp === "yes" && product.isQP) ||
        (filters.qp === "no" && !product.isQP)

      // Stock filter
      const matchesStock = filters.inStock === "all" ||
        (filters.inStock === "yes" && product.quantity > 0) ||
        (filters.inStock === "no" && product.quantity === 0)

      // Media filter
      const matchesMedia = filters.hasMedia === "all" ||
        (filters.hasMedia === "yes" && product.media) ||
        (filters.hasMedia === "no" && !product.media)

      // Sale filter
      const matchesSale = filters.onSale === "all" ||
        (filters.onSale === "yes" && product.isOnSale) ||
        (filters.onSale === "no" && !product.isOnSale)

      return matchesSearch && matchesCategory && matchesFeatured && matchesQP && matchesStock && matchesMedia && matchesSale
    })

    // Sort products
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "price":
          aValue = a.price
          bValue = b.price
          break
        case "cost":
          aValue = a.cost || 0
          bValue = b.cost || 0
          break
        case "quantity":
          aValue = a.quantity
          bValue = b.quantity
          break
        case "category":
          aValue = a.category.toLowerCase()
          bValue = b.category.toLowerCase()
          break
        case "featured":
          aValue = a.featured ? 1 : 0
          bValue = b.featured ? 1 : 0
          break
        case "salePrice":
          aValue = a.salePrice || 0
          bValue = b.salePrice || 0
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [products, searchTerm, filters, sortBy, sortOrder])

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setFilters({
      category: "all",
      featured: "all",
      qp: "all",
      inStock: "all",
      hasMedia: "all",
      onSale: "all"
    })
    setSortBy("name")
    setSortOrder("asc")
  }

  const hasActiveFilters = searchTerm ||
    Object.values(filters).some(value => value !== "all") ||
    sortBy !== "name" ||
    sortOrder !== "asc"

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

  // Helper function to render price with sale styling
  const renderPrice = (product: Product, className: string = "") => {
    if (product.isOnSale && product.salePrice) {
      return (
        <div className={`${className}`}>
          <div className="flex flex-col">
            <span className="text-gray-500 line-through text-sm">${product.price.toFixed(2)}</span>
            <span className="text-red-600 font-bold">${product.salePrice.toFixed(2)}</span>
          </div>
          <span className="text-xs text-gray-500">
            {(product.category === 'Vape' || product.category === 'Edible') ? '/PC' : '/LB'}
          </span>
        </div>
      )
    }
    else {
      return (
        <div className={`${className}`}>
          <div className="flex flex-col">
            <span className="text-sm">${product.price.toFixed(2)}</span>
          </div>
          <span className="text-xs">
            {(product.category === 'Vape' || product.category === 'Edible') ? '/PC' : '/LB'}
          </span>
        </div>
      )
    }
  }

  return (
    <div className="max-w-[1440px] min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      {/* Search and Filter Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, code, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Flower">Flower</SelectItem>
                <SelectItem value="Vape">Vape</SelectItem>
                <SelectItem value="Edible">Edible</SelectItem>
                <SelectItem value="Concentrate">Concentrate</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.featured} onValueChange={(value) => handleFilterChange("featured", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="yes">Featured Only</SelectItem>
                <SelectItem value="no">Non-Featured</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.qp} onValueChange={(value) => handleFilterChange("qp", value)}>
              <SelectTrigger>
                <SelectValue placeholder="QP Products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="yes">QP Products</SelectItem>
                <SelectItem value="no">Non-QP Products</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.onSale} onValueChange={(value) => handleFilterChange("onSale", value)}>
              <SelectTrigger>
                <SelectValue placeholder="On Sale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="yes">On Sale</SelectItem>
                <SelectItem value="no">Not On Sale</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.inStock} onValueChange={(value) => handleFilterChange("inStock", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="yes">In Stock</SelectItem>
                <SelectItem value="no">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.hasMedia} onValueChange={(value) => handleFilterChange("hasMedia", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Media" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="yes">Has Media</SelectItem>
                <SelectItem value="no">No Media</SelectItem>
              </SelectContent>
            </Select>

            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-')
              setSortBy(field)
              setSortOrder(order as "asc" | "desc")
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                <SelectItem value="salePrice-asc">Sale Price (Low to High)</SelectItem>
                <SelectItem value="salePrice-desc">Sale Price (High to Low)</SelectItem>
                <SelectItem value="quantity-asc">Stock (Low to High)</SelectItem>
                <SelectItem value="quantity-desc">Stock (High to Low)</SelectItem>
                <SelectItem value="category-asc">Category (A-Z)</SelectItem>
                <SelectItem value="featured-desc">Featured First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-sm"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All Filters
              </Button>
              <span className="text-sm text-gray-500">
                Showing {filteredProducts.length} of {products.length} products
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            All Products ({filteredProducts.length}{filteredProducts.length !== products.length && ` of ${products.length}`})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              {products.length === 0 ? (
                <>
                  <p className="text-gray-500 mb-4">No products found.</p>
                  <Link href="/admin/products/new">
                    <Button>Add Your First Product</Button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-gray-500 mb-4">No products match your current filters.</p>
                  <Button variant="outline" onClick={clearAllFilters}>
                    Clear Filters
                  </Button>
                </>
              )}
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
                      <TableHead className="w-32">Price</TableHead>
                      <TableHead className="w-20">Cost</TableHead>
                      <TableHead className="w-20">Stock</TableHead>
                      <TableHead className="w-16 text-center">QP</TableHead>
                      <TableHead className="w-24">QP Price</TableHead>
                      <TableHead className="w-20 text-center">Sale</TableHead>
                      <TableHead className="w-20 text-center">Featured</TableHead>
                      <TableHead className="w-36 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
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
                          {renderPrice(product)}
                        </TableCell>
                        <TableCell>${product.cost?.toFixed(2) || "N/A"}</TableCell>
                        <TableCell>
                          <span className={product.quantity === 0 || product.quantity === null ? "text-red-500 font-medium" : ""}>
                            {product.quantity === null ? '0' : product.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={product.isQP ? "default" : "secondary"} className="text-xs">
                            {product.isQP ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {(product.isQP && product.qpPrice) ?
                            (<div className="flex flex-col">
                              <span className="text-sm">
                                ${product.qpPrice.toFixed(2)}
                                <span className="text-xs">/QP</span>
                              </span>
                            </div>
                            ) : (
                              "N/A"
                            )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={product.isOnSale ? "destructive" : "secondary"} className="text-xs">
                            {product.isOnSale ? "Yes" : "No"}
                          </Badge>
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
                {filteredProducts.map((product) => (
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
                                {product.code && <Badge variant="outline" className="text-xs">{product.code}</Badge>}
                                <Badge variant="secondary" className="text-xs capitalize">{product.category}</Badge>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 ml-2">
                              {/* {product.featured && (
                                <Badge className="bg-yellow-500 text-white text-xs">Featured</Badge>
                              )} */}
                              {product.nose && (
                                <div className="flex items-center">
                                  <span className="text-red-600 font-bold text-sm">👃 {product.nose}</span>
                                </div>
                              )}
                              {product.isQP && (
                                <Badge variant="default" className="text-xs">QP</Badge>
                              )}
                              {product.isOnSale && (
                                <Badge variant="destructive" className="text-xs flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  Sale
                                </Badge>
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
                              {product.isQP ? (
                                // For QP products, always show regular LB price (no sale styling)
                                <span className="font-medium">${product.price.toFixed(2)}/LB</span>
                              ) : (
                                // For non-QP products, show sale styling on price
                                product.isOnSale && product.salePrice ? (
                                  <div className="flex flex-col">
                                    <span className="text-gray-500 line-through text-sm">
                                      ${product.price.toFixed(2)}/{(product.category === 'Vape' || product.category === 'Edible') ? 'PC' : 'LB'}
                                    </span>
                                    <span className="text-red-600 font-bold">
                                      ${product.salePrice.toFixed(2)}/{(product.category === 'Vape' || product.category === 'Edible') ? 'PC' : 'LB'}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="font-medium">
                                    ${product.price.toFixed(2)}/{(product.category === 'Vape' || product.category === 'Edible') ? 'PC' : 'LB'}
                                  </span>
                                )
                              )}
                            </div>
                            <div>
                              <span className="text-gray-500">Stock: </span>
                              <span className={product.quantity === 0 || product.quantity === null ? "text-red-500 font-medium" : ""}>
                                {product.quantity === null ? '0' : product.quantity}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">QP Price: </span>
                              {product.qpPrice ? (
                                product.isQP && product.isOnSale && product.salePrice ? (
                                  <div className="flex flex-col">
                                    <span className="text-gray-500 line-through text-sm">
                                      ${product.qpPrice.toFixed(2)}/QP
                                    </span>
                                    <span className="text-red-600 font-bold">
                                      ${product.salePrice.toFixed(2)}/QP
                                    </span>
                                  </div>
                                ) : (
                                  <span className="font-medium">${product.qpPrice.toFixed(2)}/QP</span>
                                )
                              ) : (
                                <span className="font-medium">N/A</span>
                              )}
                            </div>
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
                            </Button>
                            <Link href={`/admin/products/edit/${product._id}`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </Link>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(product._id!)}
                            >
                              <Trash2 className="h-3 w-3" />
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