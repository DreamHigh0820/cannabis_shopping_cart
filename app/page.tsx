"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { useCart } from "@/lib/cart-context"
import { Product, BlogPost } from "@/lib/models"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<string | null>(null)

  const { state: cartState, dispatch: cartDispatch } = useCart()

  const addToCart = (product: any) => {
    cartDispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        quantity: 1,
      },
    })

    setNotification(`${product.name} added to cart!`)
    setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products
        const productsResponse = await fetch("/api/products")
        const allProducts = await productsResponse.json()
        const featured = allProducts.filter((product: Product) => product.featured).slice(0, 4)
        setFeaturedProducts(featured)

        // Fetch featured blog posts
        const blogResponse = await fetch("/api/blog")
        const allPosts = await blogResponse.json()
        const featuredPosts = allPosts.filter((post: BlogPost) => post.featured).slice(0, 3)
        setBlogPosts(featuredPosts)
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <Header variant="public" />

      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-right">
          {notification}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Premium Cannabis
                <br />
                <span className="text-green-200">Delivered Fresh</span>
              </h1>
              <p className="text-xl mb-8 text-green-100">
                Experience the finest selection of flowers, vapes, edibles, and extracts. Quality guaranteed,
                satisfaction delivered.
              </p>
              <div className="flex flex-row gap-4">
                <Link href="/menu">
                  <Button size="lg" className="bg-white text-green-600 hover:bg-green-50">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/menu">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
                  >
                    View Menu
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                // src="/placeholder.svg"
                src="https://i.ibb.co/fZhhwLS/Apple-Gelato.webp"
                alt="Premium Cannabis Products"
                width={400}
                height={400}
                className="rounded-lg shadow-2xl"
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
              { name: "Flowers", icon: "🌸", description: "Premium indoor & outdoor strains" },
              { name: "Vapes", icon: "💨", description: "Cartridges & disposable pens" },
              { name: "Edibles", icon: "🍯", description: "Gummies, chocolates & more" },
              { name: "Extracts", icon: "💎", description: "Concentrates & live rosin" },
            ].map((category) => (
              <Link href={`/menu?category=${category.name.toLowerCase()}`} key={category.name}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <Image
                    // src={product.image || "https://i.ibb.co/fZhhwLS/Apple-Gelato.webp"}
                    src={"https://i.ibb.co/fZhhwLS/Apple-Gelato.webp"}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-48 object-cover rounded-t-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 4} // Load first 4 images with priority
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="mb-2">
                      {product.category}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {/* <span className="text-sm text-gray-600 ml-1">{product.rating}</span> */}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-6 min-h-20 line-clamp-4">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">${product.price}</span>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => addToCart(product)}>
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest from Our Blog</h2>
            <p className="text-gray-600">Stay informed with the latest cannabis news and education</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <Image
                    // src={post.image || "https://i.ibb.co/fZhhwLS/Apple-Gelato.webp"}
                    src={"https://i.ibb.co/fZhhwLS/Apple-Gelato.webp"}
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
                  {/* <Link href={`/blog/${post.id}`} className="text-green-600 hover:text-green-700 font-medium"> */}
                  <Link href={`/`} className="text-green-600 hover:text-green-700 font-medium">
                    Read More →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            {/* <Link href="/blog"> */}
            <Link href="/">
              <Button variant="outline" size="lg">
                View All Posts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Cart Summary */}
      {cartState.totalItems > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border z-50">
          <div className="flex items-center justify-between mb-2 gap-x-1">
            <span className="font-semibold">Cart Summary</span>
            <span className="text-green-600 font-bold">${cartState.totalPrice.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{cartState.totalItems} items in cart</p>
          <Link href="/cart">
            <Button className="w-full bg-green-600 hover:bg-green-700">View Cart</Button>
          </Link>
        </div>
      )}

      {/* Footer */}
      <Footer variant="public" />
    </div>
  )
}
