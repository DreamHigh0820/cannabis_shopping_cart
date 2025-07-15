"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BlogPost } from "@/lib/models"
import { Calendar, User, ArrowRight } from "lucide-react"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [visiblePosts, setVisiblePosts] = useState(6)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch("/api/blog")
        const data = await response.json()
        setBlogPosts(data)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  const categories = ["All", "Education", "Strains", "Edibles", "Concentrates", "Wellness", "Tips"]

  const filteredPosts =
    selectedCategory === "All" ? blogPosts : blogPosts.filter((post) => post.category === selectedCategory)

  const displayedPosts = filteredPosts.slice(0, visiblePosts)
  const hasMorePosts = visiblePosts < filteredPosts.length

  const loadMorePosts = () => {
    setVisiblePosts((prev) => prev + 6)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setVisiblePosts(6)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading blog posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header variant="public" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cannabis Blog</h1>
          <p className="text-xl text-gray-600">Education, insights, and updates from the cannabis world</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category, index) => (
            <Badge
              key={index}
              variant={category === selectedCategory ? "default" : "outline"}
              className={`cursor-pointer hover:bg-green-100 ${category === selectedCategory ? "bg-green-600 hover:bg-green-700" : ""
                }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="text-center mb-8">
          <p className="text-gray-600">
            Showing {displayedPosts.length} of {filteredPosts.length} articles
            {selectedCategory !== "All" && (
              <span className="ml-2">
                in <span className="font-medium">{selectedCategory}</span>
              </span>
            )}
          </p>
        </div>

        {displayedPosts.length > 0 && (
          <Card className="mb-12 hover:shadow-lg transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:order-2">
                <Image
                  // src={displayedPosts[0].image || "/placeholder.svg"}
                  src={"https://i.ibb.co/fZhhwLS/Apple-Gelato.webp"}
                  alt={displayedPosts[0].title}
                  width={500}
                  height={300}
                  className="w-full h-64 lg:h-full object-cover rounded-lg"
                />
              </div>
              <div className="lg:order-1 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Badge>{displayedPosts[0].category}</Badge>
                  <span className="text-sm text-gray-500">Featured Post</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">{displayedPosts[0].title}</h2>
                <p className="text-gray-600 mb-4">{displayedPosts[0].excerpt}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{displayedPosts[0].date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{displayedPosts[0].author}</span>
                  </div>
                  <span>{displayedPosts[0].readTime}</span>
                </div>
                <Link href={`/blog/${displayedPosts[0].id}`}>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Read More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {displayedPosts.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPosts.slice(1).map((post, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <Image
                    // src={post.image || "/placeholder.svg"}
                    src={"https://i.ibb.co/fZhhwLS/Apple-Gelato.webp"}
                    alt={post.title}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="outline">{post.category}</Badge>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  <CardTitle className="text-xl mb-3 hover:text-green-600">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </CardTitle>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                  <Link href={`/blog/${post.id}`}>
                    <Button variant="outline" className="w-full hover:bg-green-50 bg-transparent">
                      Read More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {displayedPosts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
            <p className="text-gray-500">Try selecting a different category.</p>
          </div>
        )}

        {hasMorePosts && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" onClick={loadMorePosts}>
              Load More Articles ({filteredPosts.length - visiblePosts} remaining)
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer variant="public" />
    </div>
  )
}
