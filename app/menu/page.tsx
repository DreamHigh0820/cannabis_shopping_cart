"use client"

import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Plus, Minus, Filter } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import ProductImage from "@/components/ProductImage"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"

interface Product {
  _id: string
  name: string
  category: string
  price: number
  image: string
  rating?: number
  description: string
  strain?: string
  isQP?: boolean
  qpPrice?: number
}

export default function MenuPage() {
  const [sortBy, setSortBy] = useState("name")
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: string]: number }>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all")
  const { state: cartState, dispatch: cartDispatch } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        // API now returns array directly
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter(
    (product) => selectedCategory === "all" || product.category.toLowerCase() === selectedCategory.toLowerCase(),
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, itemsPerPage])

  React.useEffect(() => {
    const category = searchParams.get("category")
    if (category) {
      setSelectedCategory(category)
    }
  }, [searchParams])

  const updateQuantity = (productId: string, change: number) => {
    setSelectedQuantities((prev) => {
      const currentQty = prev[productId] || 1
      const newQty = Math.max(1, currentQty + change)
      return { ...prev, [productId]: newQty }
    })
  }

  const addToCart = (product: Product) => {
    const quantity = selectedQuantities[product._id] || 1
    const isQPProduct = product.isQP && product.qpPrice
    const effectivePrice = isQPProduct ? product.qpPrice : product.price
    const unit = isQPProduct ? 'QP' : 'lb'
    
    cartDispatch({
      type: "ADD_ITEM",
      payload: {
        id: product._id,
        name: product.name,
        category: product.category,
        price: effectivePrice, // Use the effective price based on unit type
        image: product.image,
        quantity: quantity,
        isQP: isQPProduct,
        qpPrice: product.qpPrice,
        unit: unit, // Add unit information
      },
    })

    setSelectedQuantities((prev) => ({ ...prev, [product._id]: 1 }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-sky-50 to-cyan-50">
      {/* Header */}
      <Header variant="public" />

      <div className="min-h-[calc(100vh-496px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Our Menu</h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600">Premium cannabis products for every preference</p>
        </div>

        {/* Filters and Sort Controls */}
        <div className="flex flex-col space-y-4 sm:space-y-0 md:flex-row sm:gap-4 mb-6 sm:mb-8 sm:justify-between">
          {/* Left side filters */}
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Filter className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="flower">Flower</SelectItem>
                  <SelectItem value="vape">Vape</SelectItem>
                  <SelectItem value="edible">Edible</SelectItem>
                  <SelectItem value="concentrate">Concentrate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-sm text-gray-500 flex-shrink-0">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right side pagination control */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-sm text-gray-500 flex-shrink-0 hidden sm:inline">Show:</span>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="24">24</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500 flex-shrink-0 hidden sm:inline">per page</span>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-gray-600">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedProducts.length)} of{" "}
            {sortedProducts.length} products
            {selectedCategory !== "all" && (
              <span className="ml-2">
                in <span className="font-medium capitalize">{selectedCategory}</span>
              </span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {paginatedProducts.map((product) => {
            const selectedQty = selectedQuantities[product._id] || 1
            return (
              <Card key={product._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="mb-2 capitalize text-xs">
                      {product.category}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600 ml-1">{product.rating || 4.0}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base line-clamp-2">{product.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 min-h-16 sm:min-h-20 line-clamp-3 sm:line-clamp-4">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex flex-col min-h-[3rem] justify-center">
                      <span className="text-lg sm:text-xl font-bold text-red-600">
                        LB: ${product.price}
                      </span>
                      <span className="text-sm text-gray-500 min-h-[1.25rem]">
                        {product.isQP && product.qpPrice ? `QP: ${product.qpPrice}` : ''}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => updateQuantity(product._id, -1)}
                        className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2"
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <div className="flex flex-col items-center">
                        <span className="font-medium w-6 sm:w-8 text-center text-sm sm:text-base">{selectedQty}</span>
                        <span className="text-xs text-gray-500">
                          {product.isQP ? 'QP' : 'lb'}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => updateQuantity(product._id, 1)}
                        className="h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-red-600 hover:bg-red-700 text-xs sm:text-sm"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-6 sm:mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 sm:px-4 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>

            {/* Desktop pagination - show all pages */}
            <div className="hidden sm:flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={`page-${page}`}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className={currentPage === page ? "bg-red-600 hover:bg-red-700" : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>

            {/* Mobile pagination - show current page info */}
            <div className="sm:hidden flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {currentPage} of {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-4 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
            </Button>
          </div>
        )}

        {/* Floating Cart Summary */}
        {cartState.totalItems > 0 && (
          <div className="fixed bottom-4 right-4 left-4 sm:left-auto bg-white rounded-2xl shadow-lg p-3 sm:p-4 border max-w-sm sm:max-w-none mx-auto sm:mx-0">
            <div className="flex items-center justify-between mb-2 gap-x-2">
              <span className="font-semibold text-sm sm:text-base">Cart Summary</span>
              <span className="text-red-600 font-bold text-sm sm:text-base">${cartState.totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">{cartState.totalItems} items in cart</p>
            <Link href="/cart">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-sm py-2">View Cart</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer variant="public" />
    </div>
  )
}