"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MessageCircle, Clock } from "lucide-react"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setIsSuccess(true)
        setSubmitMessage(result.message)
        // Reset form
        e.currentTarget.reset()
      } else {
        setIsSuccess(false)
        setSubmitMessage(result.message)
      }
    } catch (error) {
      setIsSuccess(false)
      setSubmitMessage("There was an error sending your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50">
      {/* Header */}
      <Header variant="public" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
            Contact Us
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Get in touch with our team. We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0" />
                  <span>Phone</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm sm:text-base text-gray-600 mb-2">Call us for immediate assistance</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600 break-all">(555) 123-4567</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">Available 24/7 for orders and support</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0" />
                  <span>Telegram</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm sm:text-base text-gray-600 mb-2">Connect with us on Telegram</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600 break-all">@doughboy_official</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">For orders, updates, and customer service</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0" />
                  <span>Email</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm sm:text-base text-gray-600 mb-2">Send us a message</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600 break-all">info@doughboy.com</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">We'll respond within 24 hours</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0" />
                  <span>Business Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-gray-600">Monday - Friday:</span>
                    <span className="text-sm sm:text-base font-medium">9:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-gray-600">Saturday:</span>
                    <span className="text-sm sm:text-base font-medium">10:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-gray-600">Sunday:</span>
                    <span className="text-sm sm:text-base font-medium">12:00 PM - 8:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      type="text" 
                      required 
                      className="mt-1 h-10 sm:h-11"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      type="text" 
                      required 
                      className="mt-1 h-10 sm:h-11"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    className="mt-1 h-10 sm:h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    className="mt-1 h-10 sm:h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                  <Input 
                    id="subject" 
                    name="subject" 
                    type="text" 
                    required 
                    className="mt-1 h-10 sm:h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    required
                    className="mt-1 resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 h-11 sm:h-12 text-sm sm:text-base font-medium" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>

                {submitMessage && (
                  <div
                    className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
                      isSuccess ? "bg-red-50 text-red-800" : "bg-red-50 text-red-800"
                    }`}
                  >
                    {submitMessage}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 lg:mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">How do I place an order?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Browse our menu, add items to your cart, and proceed to checkout. Your order will be sent to our team
                  via Telegram for confirmation.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">What are your delivery areas?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  We deliver throughout the greater metro area. Contact us to confirm if we deliver to your location.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">How long does delivery take?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Same-day delivery is available for orders placed before 6 PM. Standard delivery is 2-24 hours.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  We accept cash, Venmo, and other digital payment methods. Payment is collected upon delivery.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer variant="public" />
    </div>
  )
}