import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Shield, Clock, Heart, Users, ShoppingCart, MessageCircle } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Quality Assurance",
      description: "Every product is lab-tested and carefully curated to ensure the highest quality standards.",
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "Fast Delivery",
      description: "Same-day delivery available with discrete packaging and professional service.",
    },
    {
      icon: <Heart className="h-8 w-8 text-green-600" />,
      title: "Customer Care",
      description: "Our team is dedicated to providing exceptional customer service and support.",
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Community Focus",
      description: "We're committed to supporting our local community and cannabis education.",
    },
  ]

  const team = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      image: "/images/team-alex.png",
      bio: "Cannabis industry veteran with 10+ years of experience in cultivation and retail.",
    },
    {
      name: "Maria Rodriguez",
      role: "Head of Quality",
      image: "/images/team-maria.png",
      bio: "Former lab technician specializing in cannabis testing and product development.",
    },
    {
      name: "David Chen",
      role: "Customer Success",
      image: "/images/team-david.png",
      bio: "Passionate about cannabis education and helping customers find their perfect products.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About DoughBoy</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Your trusted partner in premium cannabis delivery, committed to quality, education, and exceptional service.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6">
                Founded in 2020, DoughBoy began as a passion project to bring premium cannabis products directly to our
                community. We recognized the need for a trusted, reliable source that prioritizes quality, education,
                and customer satisfaction above all else.
              </p>
              <p className="text-gray-600 mb-6">
                What started as a small operation has grown into a comprehensive cannabis delivery service, but our core
                values remain the same: providing the highest quality products, exceptional customer service, and
                contributing to cannabis education and awareness.
              </p>
              <p className="text-gray-600">
                Today, we serve hundreds of satisfied customers throughout the region, maintaining our commitment to
                excellence with every order. Our team consists of cannabis enthusiasts, industry professionals, and
                dedicated customer service representatives who share our passion for this incredible plant.
              </p>
            </div>
            <div>
              <Image
                src="/placeholder.svg"
                alt="Our Story"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">What drives us every day</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4">{value.icon}</div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The people behind DoughBoy</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Image
                    // src={member.image || "/placeholder.svg"}
                    src={"/placeholder-user.jpg"}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <p className="text-green-600 font-medium">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <p className="text-green-100">Happy Customers</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <p className="text-green-100">Premium Products</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99%</div>
              <p className="text-green-100">Satisfaction Rate</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p className="text-green-100">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience the DoughBoy Difference?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers who trust us for their cannabis needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Shop Our Menu
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Get In Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
