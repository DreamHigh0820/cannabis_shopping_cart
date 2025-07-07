import { NextResponse } from "next/server"

export async function GET() {
  try {
    const hasBotToken = !!process.env.TELEGRAM_BOT_TOKEN
    const hasChatId = !!process.env.TELEGRAM_CHAT_ID

    return NextResponse.json({
      hasBotToken,
      hasChatId,
      status: hasBotToken && hasChatId ? "configured" : "incomplete",
    })
  } catch (error) {
    return NextResponse.json({
      hasBotToken: false,
      hasChatId: false,
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
