import { type NextRequest, NextResponse } from "next/server"
import { telegramService } from "@/lib/telegram-service"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" })
    }

    const success = await telegramService.sendMessage({ text: message })

    if (success) {
      return NextResponse.json({ success: true, message: "Message sent successfully" })
    } else {
      return NextResponse.json({ success: false, error: "Failed to send message" })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
