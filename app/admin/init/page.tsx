"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BackButton from "../../../components/BackButton"

export default function InitPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const initializeDatabase = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/init-db", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setResult(`✅ Success: ${data.message}`)
      } else {
        setResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl min-h-screen mx-auto lg:px-8 sm:px-6 px-4 py-8">
      <div className="max-w-md mx-auto">
        <BackButton to="/admin" />
        <Card>
          <CardHeader>
            <CardTitle>Database Initialization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Click the button below to initialize your MongoDB database with sample products and blog posts.
            </p>

            <Button onClick={initializeDatabase} disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
              {loading ? "Initializing..." : "Initialize Database"}
            </Button>

            {result && (
              <div className="p-3 rounded-lg bg-gray-100">
                <p className="text-sm">{result}</p>
              </div>
            )}

            {/* <div className="text-xs text-gray-500 space-y-1 pt-4 border-t">
              <p>
                <strong>Environment Setup:</strong>
              </p>
              <p>Make sure your .env file contains:</p>
              <code className="block bg-gray-100 p-2 rounded text-xs">
                MONGODB_URI=your_mongodb_connection_string
                <br />
                TELEGRAM_BOT_TOKEN=your_bot_token
                <br />
                TELEGRAM_CHAT_ID=your_chat_id
              </code>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
