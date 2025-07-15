"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import BackButton from "../../../components/BackButton"

export default function TelegramAdminPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [envStatus, setEnvStatus] = useState({ botToken: false, chatId: false })

  useEffect(() => {
    // Check environment variables by making a test call
    const checkEnvVars = async () => {
      try {
        const response = await fetch("/api/telegram/status")
        const data = await response.json()
        setEnvStatus({
          botToken: data.hasBotToken,
          chatId: data.hasChatId,
        })
      } catch (error) {
        console.error("Error checking env vars:", error)
      }
    }

    checkEnvVars()
  }, [])

  const sendTestMessage = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/telegram/test", {
        method: "POST",
      })

      const data = await response.json()
      setResult(data.success ? "✅ Test message sent!" : `❌ Error: ${data.error}`)
    } catch (error) {
      setResult(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const sendCustomMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const formData = new FormData(e.currentTarget)
    const message = formData.get("message")

    try {
      const response = await fetch("/api/telegram/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      const data = await response.json()
      setResult(data.success ? "✅ Message sent!" : `❌ Error: ${data.error}`)

      if (data.success && e.currentTarget) {
        e.currentTarget.reset()
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <BackButton to="/admin" />
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Telegram Admin Dashboard</h1>
          <p className="text-gray-600">Manage Telegram notifications and messages</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Test Connection */}
          <Card>
            <CardHeader>
              <CardTitle>Test Connection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Test your Telegram bot connection by sending a test message.</p>
              <Button onClick={sendTestMessage} disabled={loading} className="w-full">
                {loading ? "Sending..." : "Send Test Message"}
              </Button>
            </CardContent>
          </Card>

          {/* Send Custom Message */}
          <Card>
            <CardHeader>
              <CardTitle>Send Custom Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={sendCustomMessage} className="space-y-4">
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" placeholder="Enter your message..." rows={4} required />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Result Display */}
        {result && (
          <Card>
            <CardContent className="p-4">
              <p className="text-center">{result}</p>
            </CardContent>
          </Card>
        )}

        {/* Configuration Info */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Bot Token Status</Label>
                <p className={`text-sm ${envStatus.botToken ? "text-green-600" : "text-red-600"}`}>
                  {envStatus.botToken ? "✅ Configured" : "❌ Not configured"}
                </p>
              </div>
              <div>
                <Label>Chat ID Status</Label>
                <p className={`text-sm ${envStatus.chatId ? "text-green-600" : "text-red-600"}`}>
                  {envStatus.chatId ? "✅ Configured" : "❌ Not configured"}
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>
                <strong>Setup Instructions:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Create a bot with @BotFather on Telegram</li>
                <li>Get your bot token</li>
                <li>Start a chat with your bot and get your chat ID</li>
                <li>Add both to your .env file</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
