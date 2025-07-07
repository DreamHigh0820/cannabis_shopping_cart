import { NextResponse } from "next/server"
import { telegramService } from "@/lib/telegram-service"

export async function POST() {
  try {
    const testMessage = `
🤖 <b>TEST MESSAGE</b>

This is a test message from your DoughBoy Telegram bot!

✅ Bot is working correctly
🕐 Sent at: ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━
Your Telegram integration is ready! 🚀
    `.trim()

    const success = await telegramService.sendMessage({ text: testMessage })

    if (success) {
      return NextResponse.json({ success: true, message: "Test message sent successfully" })
    } else {
      return NextResponse.json({ success: false, error: "Failed to send test message" })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
