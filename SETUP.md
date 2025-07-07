# DoughBoy Cannabis E-commerce Setup Guide

## Environment Variables Setup

Create a `.env` file in your project root with the following variables:

\`\`\`bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/doughboy_ecommerce

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Optional: Function Secret for additional security
FUNCTION_SECRET=your_random_secret_string
\`\`\`

## Step-by-Step Setup

### 1. MongoDB Setup
1. Create a MongoDB Atlas account at https://cloud.mongodb.com
2. Create a new cluster
3. Get your connection string
4. Add it to your `.env` file as `MONGODB_URI`

### 2. Telegram Bot Setup
1. Message @BotFather on Telegram
2. Create a new bot with `/newbot`
3. Get your bot token
4. Start a chat with your bot
5. Get your chat ID by messaging @userinfobot
6. Add both to your `.env` file

### 3. Initialize Database
1. Start your development server: `npm run dev`
2. Visit `/admin/init` to initialize the database
3. Click "Initialize Database" to populate with sample data

### 4. Test Telegram Integration
1. Visit `/admin/telegram` to test your bot
2. Send a test message to verify configuration

## File Structure
\`\`\`
project-root/
├── .env                    # Environment variables (DO NOT COMMIT)
├── .env.example           # Example environment file
├── .gitignore             # Make sure .env is listed here
└── ...
\`\`\`

## Security Notes
- Never commit your `.env` file to version control
- Use different credentials for development and production
- Keep your Telegram bot token secure
- Use strong passwords for MongoDB

## Deployment
For production deployment:
1. Set environment variables in your hosting provider's dashboard
2. Do not use `.env` files in production
3. Use your hosting provider's environment variable system
