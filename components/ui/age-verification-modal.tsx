"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"

export function AgeVerificationModal() {
  const [isVerified, setIsVerified] = useState(true) // Default to true to avoid SSR issues

  useEffect(() => {
    const ageVerified = localStorage.getItem("ageVerified") === "true"
    setIsVerified(ageVerified)
  }, [])

  const handleVerification = (verified: boolean) => {
    if (verified) {
      localStorage.setItem("ageVerified", "true")
      setIsVerified(true)
    } else {
      // Redirect or show a message for users who are not 21+
      window.location.href = "https://www.google.com/search?q=age+restricted"
    }
  }

  if (isVerified) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="w-full max-w-md m-4">
        <CardHeader className="text-center">
          <Leaf className="mx-auto h-12 w-12 text-green-600" />
          <CardTitle className="text-2xl">Age Verification</CardTitle>
          <CardDescription>You must be 21 years or older to enter this site.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-700">Please confirm that you are at least 21 years old.</p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="w-full sm:w-auto" onClick={() => handleVerification(true)}>
            I am 21 or older
          </Button>
          <Button
            className="w-full sm:w-auto bg-transparent"
            variant="outline"
            onClick={() => handleVerification(false)}
          >
            Exit
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}