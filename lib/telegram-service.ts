interface TelegramMessage {
  text: string
  chatId?: string
  parseMode?: "HTML" | "Markdown"
}

class TelegramService {
  private botToken: string | undefined
  private defaultChatId: string | undefined

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN
    this.defaultChatId = process.env.TELEGRAM_CHAT_ID
  }

  async sendMessage({ text, chatId, parseMode = "HTML" }: TelegramMessage): Promise<boolean> {
    if (!this.botToken) {
      console.log("📱 Telegram Demo:", text)
      return true
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId || this.defaultChatId,
          text,
          parse_mode: parseMode,
          disable_web_page_preview: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Telegram API Error:", errorData)
        return false
      }

      return true
    } catch (error) {
      console.error("Error sending Telegram message:", error)
      return false
    }
  }

  async sendOrderConfirmation(orderNumber: string, customerName: string): Promise<boolean> {
    const message = `
✅ <b>ORDER CONFIRMED</b>

Order #${orderNumber} has been confirmed!
Customer: ${customerName}

We'll prepare your order and contact you shortly for delivery coordination.
    `.trim()

    return this.sendMessage({ text: message })
  }

  async sendDeliveryUpdate(orderNumber: string, status: string, estimatedTime?: string): Promise<boolean> {
    const message = `
🚚 <b>DELIVERY UPDATE</b>

Order #${orderNumber}
Status: <b>${status}</b>
${estimatedTime ? `Estimated delivery: ${estimatedTime}` : ""}

Thank you for your patience!
    `.trim()

    return this.sendMessage({ text: message })
  }

  async sendContactFormSubmission(name: string, email: string, subject: string, message: string): Promise<boolean> {
    const telegramMessage = `
📧 <b>NEW CONTACT FORM SUBMISSION</b>

<b>Name:</b> ${name}
<b>Email:</b> ${email}
<b>Subject:</b> ${subject}

<b>Message:</b>
${message}

━━━━━━━━━━━━━━━━━━━━
Please respond to customer inquiry
    `.trim()

    return this.sendMessage({ text: telegramMessage })
  }
}

export const telegramService = new TelegramService()
