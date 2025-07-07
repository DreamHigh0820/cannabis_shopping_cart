import { type NextRequest, NextResponse } from "next/server"
import { telegramService } from "@/lib/telegram-service"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    const { firstName, lastName, email, phone, subject, message } = formData

    const fullName = `${firstName} ${lastName}`.trim()

    // Send to Telegram
    await telegramService.sendContactFormSubmission(fullName, email, subject, message)

    // Here you could also save to database if needed
    console.log("📧 Contact form submission:", {
      name: fullName,
      email,
      phone,
      subject,
      message,
    })

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
    })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      {
        success: false,
        message: "There was an error sending your message. Please try again.",
      },
      { status: 500 },
    )
  }
}
