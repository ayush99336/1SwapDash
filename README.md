# MySwap Dashboard

A modern DeFi dashboard for viewing token balances and executing best-rate swaps using the 1inch API.

## Features

- 🔗 **Wallet Connection**: Connect with MetaMask, WalletConnect, and other popular wallets using RainbowKit
- 💰 **Token Balances**: View ETH and ERC-20 token balances with USD values
- 🔄 **Token Swaps**: Execute swaps with best rates from 1inch aggregation
- 📊 **Swap History**: Track your transaction history with links to Etherscan
- 🎨 **Modern UI**: Beautiful, responsive interface built with Tailwind CSS

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Wallet Integration**: wagmi + RainbowKit + viem
- **Styling**: Tailwind CSS
- **API**: 1inch Swap & Balance APIs
- **State Management**: React hooks + Context

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Update `.env` with your API keys:
```env
VITE_1INCH_API_URL=https://api.1inch.dev
VITE_1INCH_API_KEY=your_1inch_api_key_here
VITE_CHAIN_ID=1
```

Get your 1inch API key from: https://portal.1inch.dev/

### 3. Update WalletConnect Project ID
In `src/config/wagmi.ts`, replace `YOUR_PROJECT_ID` with your project ID from https://cloud.walletconnect.com

### 4. Run Development Server
```bash
# Fix file watcher limit (Linux only)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Start dev server
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── WalletConnector.tsx     # RainbowKit wallet connection
│   ├── BalanceList.tsx         # Display token balances
│   ├── TokenSelector.tsx       # Token search & selection
│   ├── SwapForm.tsx           # Swap interface with quotes
│   ├── SwapHistory.tsx        # Transaction history
│   └── shared/                # Reusable UI components
├── hooks/
│   ├── useBalances.ts         # Fetch wallet balances
│   ├── useQuote.ts            # Get swap quotes
│   └── useSwap.ts             # Execute swaps
├── utils/
│   ├── api.ts                 # 1inch API wrappers
│   └── tokens.ts              # Token utilities & constants
├── config/
│   └── wagmi.ts               # Wallet configuration
└── App.tsx                    # Main application layout
```

## API Integration

### 1inch APIs Used:
- **Balance API**: Get wallet token balances
- **Swap API**: Get quotes and execute swaps
- **Token API**: Fetch supported tokens list

### Key Features:
- Automatic slippage protection
- Gas estimation
- Multi-chain support (configurable)
- Real-time quote updates

## Deployment

The application is ready for deployment on Vercel, Netlify, or any static hosting service. Make sure to set the environment variables in your hosting platform's dashboard.

## Demo

1. **Connect Wallet**: Use the connect button to link your wallet
2. **View Balances**: See your ETH and token balances with USD values
3. **Swap Tokens**: Select tokens, enter amount, get quotes, and execute swaps
4. **Track History**: Monitor your swap transactions with Etherscan links

## Troubleshooting

### File Watcher Limit (Linux)
If you get ENOSPC errors:
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Configuration
- Update your 1inch API key in `.env`
- Set your WalletConnect project ID in `src/config/wagmi.ts`
- Ensure you're on the correct network (mainnet/testnet)
