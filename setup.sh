#!/bin/bash

echo "🚀 Setting up MySwap Dashboard..."

# Check if running on Linux and fix file watcher limit
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "📝 Fixing file watcher limit for Linux..."
    echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
    sudo sysctl -p
fi

echo "📦 Installing dependencies..."
npm install

echo "⚙️  Configuration needed:"
echo "1. Update your 1inch API key in .env file"
echo "2. Get your API key from: https://portal.1inch.dev/"
echo "3. Update WalletConnect project ID in src/config/wagmi.ts"
echo "4. Get project ID from: https://cloud.walletconnect.com"

echo ""
echo "✅ Setup complete! Run 'npm run dev' to start the development server."
