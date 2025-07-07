"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Calendar, User, ArrowLeft, Share2, ShoppingCart, MessageCircle } from "lucide-react"
import type { BlogPost } from "@/lib/models/Product"

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        // Fetch the specific blog post
        const postResponse = await fetch(`/api/blog/${params.id}`)
        if (!postResponse.ok) {
          throw new Error("Blog post not found")
        }
        const post = await postResponse.json()
        setBlogPost(post)

        // Fetch related posts (same category, excluding current post)
        const allPostsResponse = await fetch("/api/blog")
        const allPosts = await allPostsResponse.json()
        const related = allPosts.filter((p: BlogPost) => p.category === post.category && p.id !== post.id).slice(0, 3)
        setRelatedPosts(related)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load blog post")
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPost()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The requested blog post could not be found."}</p>
          <Link href="/blog">
            <Button className="bg-green-600 hover:bg-green-700">Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <Link href="/" className="text-2xl font-bold text-gray-900">
                DoughBoy
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-green-600">
                Home
              </Link>
              <Link href="/menu" className="text-gray-700 hover:text-green-600">
                Menu
              </Link>
              <Link href="/blog" className="text-gray-900 hover:text-green-600 font-medium">
                Blog
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-green-600">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-green-600">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Link href="/cart">
                <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart (0)
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="md:hidden">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/blog">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Badge>{blogPost.category}</Badge>
            <span className="text-sm text-gray-500">{blogPost.readTime}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{blogPost.title}</h1>
          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{blogPost.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{blogPost.author}</span>
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <Image
            src={blogPost.image || "/placeholder.svg"}
            alt={blogPost.title}
            width={800}
            height={400}
            className="w-full h-64 md:h-96 object-cover rounded-lg"
          />
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
        </div>

        {relatedPosts.length > 0 && (
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <div className="p-0">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2">
                      {post.category}
                    </Badge>
                    <h3 className="font-semibold mb-2 hover:text-green-600">
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </h3>
                    <Link href={`/blog/${post.id}`}>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Card className="mt-12 bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for the latest cannabis education and product updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Button className="bg-green-600 hover:bg-green-700">Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
