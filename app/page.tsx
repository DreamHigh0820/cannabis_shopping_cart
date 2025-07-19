"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Star, Tag } from "lucide-react"
import { useEffect, useState } from "react"
import { useCart } from "@/lib/cart-context"
import ProductImage from "@/components/ProductImage"
import ProductMediaDisplay from "@/components/ProductMediaDisplay"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"

interface Product {
  _id: string
  name: string
  category: string
  price: number
  image: string
  image2?: string
  media?: string
  rating?: number
  description: string
  strain?: string
  isQP?: boolean
  qpPrice?: number
  featured?: boolean
  isOnSale?: boolean
  salePrice?: number
  nose?: string
}

interface BlogPost {
  _id: string
  title: string
  excerpt: string
  image: string
  date: string
  featured?: boolean
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<string | null>(null)

  const { state: cartState, dispatch: cartDispatch } = useCart()

  const addToCart = (product: Product) => {
    const isQPProduct = product.isQP && product.qpPrice
    let effectivePrice: number

    if (isQPProduct) {
      // For QP products, use sale price if on sale, otherwise use QP price
      effectivePrice = product.isOnSale && product.salePrice ? product.salePrice : product.qpPrice!
    } else {
      // For regular products, use sale price if on sale, otherwise use regular price
      effectivePrice = product.isOnSale && product.salePrice ? product.salePrice : product.price
    }

    const unit = isQPProduct ? 'QP' : 'LB'

    cartDispatch({
      type: "ADD_ITEM",
      payload: {
        id: product._id,
        name: product.name,
        category: product.category,
        price: effectivePrice, // Use effective price based on unit type and sale status
        image: product.image,
        quantity: 1,
        isQP: isQPProduct,
        qpPrice: product.qpPrice,
        unit: unit, // Add unit information
        isOnSale: product.isOnSale,
        salePrice: product.salePrice,
      },
    })
    console.log("product.category", product.category)
    const unitText = isQPProduct ? "QP" : product.category === 'Vape' || product.category === 'Edible' ? "PC" : "LB"
    setNotification(`${product.name} (1 ${unitText}) added to cart!`)
    setTimeout(() => setNotification(null), 3000)
  }

  // Helper function to render price with sale styling
  const renderPrice = (product: Product) => {
    const unit = (product.category === 'Vape' || product.category === 'Edible') ? 'PC:' : 'LB:'
    const isOnSale = product.isOnSale && product.salePrice
    const isQP = product.isQP && product.qpPrice

    return (
      <div className="flex flex-col justify-center align-bottom">
        {isOnSale ? (
          <>
            {isQP && <div className="flex flex-col">
              <span className="text-sm sm:text-md font-bold text-red-600">
                QP: ${product.qpPrice}
              </span>
            </div>}
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-red-600">
                {unit} ${product.salePrice}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-md font-bold line-through text-red-600">
                {unit} ${product.price}
              </span>
            </div>
          </>
        ) : (
          <>
            {isQP && <div className="flex flex-col">
              <span className="text-sm sm:text-md font-bold text-red-600">
                QP: ${product.qpPrice}
              </span>
            </div>}
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-red-600">
                {unit} ${product.price}
              </span>
            </div>
          </>
        )}
      </div>
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products
        const productsResponse = await fetch("/api/products")
        if (productsResponse.ok) {
          const allProducts = await productsResponse.json()
          const featured = allProducts.filter((product: Product) => product.featured).slice(0, 4)
          setFeaturedProducts(featured)
        }

        // Fetch featured blog posts (if you have blog API)
        try {
          const blogResponse = await fetch("/api/blog")
          if (blogResponse.ok) {
            const allPosts = await blogResponse.json()
            const featuredPosts = allPosts.filter((post: BlogPost) => post.featured).slice(0, 3)
            setBlogPosts(featuredPosts)
          }
        } catch (blogError) {
          console.log("Blog API not available, skipping blog posts")
          setBlogPosts([]) // Set empty array if blog API doesn't exist
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50">
      {/* Header */}
      <Header variant="public" />

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 bg-red-600 text-white px-4 py-2 rounded-2xl shadow-lg z-50 animate-in slide-in-from-right">
          {notification}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r  text-white from-sky-600 to-cyan-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Premium Cannabis
                <br />
                <span className="">Delivered Fresh</span>
              </h1>
              <p className="text-xl mb-8 text-red-100">
                Experience the finest selection of flowers, vapes, edibles, and extracts. Quality guaranteed,
                satisfaction delivered.
              </p>
              <div className="flex flex-row gap-4">
                <Link href="/menu">
                  <Button size="lg" className="bg-white text-red-600 hover:bg-red-50">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/menu">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-red-600 bg-transparent"
                  >
                    View Menu
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative flex justify-end">
              <ProductImage
                src="https://i.ibb.co/fZhhwLS/Apple-Gelato.webp"
                alt="Premium Cannabis Products"
                width={400}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Flower", icon: "🌸", description: "Premium indoor & outdoor strains" },
              { name: "Vape", icon: "💨", description: "Cartridges & disposable pens" },
              { name: "Edible", icon: "🍯", description: "Gummies, chocolates & more" },
              { name: "Concentrate", icon: "💎", description: "Concentrates & live rosin" },
              // { name: "Miscellaneous", icon: "🛍️", description: "Clothing & merchandise" },
            ].map((category, index) => (
              <Link href={`/menu?category=${category.name.toLowerCase()}`} key={index}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{category.icon}</div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600">Hand-picked favorites from our premium collection</p>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <Card key={product._id} className="hover:shadow-lg transition-shadow h-auto flex flex-col">
                  <CardHeader className="p-0">
                    <ProductMediaDisplay
                      product={product}
                      className="w-full h-52"
                      imageWidth={400}
                      imageHeight={144}
                    />
                  </CardHeader>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary" className="mb-2 capitalize">
                          {product.category}
                        </Badge>
                        {product.isOnSale && (
                          <Badge variant="destructive" className="mb-2 flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            Sale
                          </Badge>
                        )}
                        {product.image2 && (
                          <Badge variant="outline" className="mb-2 text-xs">
                            +Image
                          </Badge>
                        )}
                      </div>
                      {product.nose && (
                        <div className="flex text-nowrap items-center">
                          <span className="text-red-600 text-nowrap font-bold text-sm">👃 {product.nose}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 min-h-16 line-clamp-3">
                      {product.description}
                    </p>

                    {/* Fixed height pricing section */}
                    <div className="flex justify-between items-end align-bottom mb-3 flex-grow">
                      <div className="flex flex-col justify-center align-bottom">
                        {renderPrice(product)}
                      </div>
                      <div className="flex gap-2">
                        {product.isQP && (
                          <Badge variant="outline" className="text-xs">
                            QP Deal
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart button at bottom */}
                    <Button
                      size="sm"
                      className="w-full bg-red-600 hover:bg-red-700 mt-auto"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No featured products available at the moment.</p>
              <Link href="/menu">
                <Button className="bg-red-600 hover:bg-red-700">
                  Browse All Products
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      {blogPosts.length < 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Latest from Our Blog</h2>
              <p className="text-gray-600">Stay informed with the latest cannabis news and education</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <ProductImage
                      src={post.image}
                      alt={post.title}
                      width={250}
                      height={150}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                    <h3 className="font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                    <Link href={`/blog/${post._id}`} className="text-red-600 hover:text-red-700 font-medium">
                      Read More →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/blog">
                <Button variant="outline" size="lg">
                  View All Posts
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Floating Cart Summary */}
      {cartState.totalItems > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-2xl shadow-lg p-4 border z-50 max-w-sm">
          <div className="flex items-center justify-between mb-2 gap-x-2">
            <span className="font-semibold text-sm">Cart Summary</span>
            <span className="text-red-600 font-bold text-sm">${cartState.totalPrice.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-600 mb-3">{cartState.totalItems} items in cart</p>
          <Link href="/cart">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-sm py-2">View Cart</Button>
          </Link>
        </div>
      )}

      {/* Footer */}
      <Footer variant="public" />
    </div>
  )
}