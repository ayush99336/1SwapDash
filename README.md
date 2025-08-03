# 1SwapDash - Advanced DeFi Dashboard

A comprehensive multi-chain DeFi dashboard with full 1inch API integration, portfolio analytics, and advanced trading features.

## ✨ Key Features

### 🔗 **Multi-Chain Wallet Integration**
- Connect with MetaMask, WalletConnect, Coinbase Wallet, and more via RainbowKit
- Support for Ethereum, BSC, Polygon, Arbitrum, Optimism, Base, and Linea
- Automatic network switching and detection
- Real-time balance updates across all chains

### 💰 **Portfolio Management**
- **Real-time Balance Tracking**: View ETH and ERC-20 token balances with live USD values
- **Portfolio Analytics**: Comprehensive portfolio overview with protocol breakdown
- **Interactive Charts**: Portfolio value charts with multiple timeframes using Recharts
- **CSV Export**: Download detailed portfolio reports
- **Multi-chain Aggregation**: Unified view across all supported networks

### 🔄 **Advanced Trading**
- **Classic Swaps**: Best-rate token swaps via 1inch aggregation
- **Fusion Trading**: Advanced order types with better pricing
- **Liquidity Sources**: Access to 100+ DEXs and liquidity providers
- **Gas Optimization**: Intelligent gas estimation and optimization
- **MEV Protection**: Built-in protection against MEV attacks

### 📊 **Analytics & Insights**
- **Market Analysis**: Real-time spot prices and market data
- **Transaction History**: Detailed swap history with Etherscan links
- **Price Charts**: Token price charts and trends
- **Protocol Breakdown**: See your holdings across different DeFi protocols
- **Performance Tracking**: Track portfolio performance over time

### 🎨 **Modern User Experience**
- **shadcn/ui Components**: Modern, accessible UI components
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark/Light Mode**: Adaptive theming
- **Real-time Updates**: Live data without manual refresh
- **Interactive Charts**: Rich data visualization with Recharts

## 🛠 Tech Stack

### Core Technologies
- **Frontend**: React 18 + TypeScript + Vite
- **Wallet Integration**: wagmi v2 + RainbowKit + viem
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts for interactive data visualization
- **State Management**: React hooks + Zustand (for complex state)

### APIs & Integrations
- **1inch Classic Swap API**: Token swaps and quotes
- **1inch Portfolio API v4/v5**: Portfolio analytics and reporting
- **1inch Fusion API**: Advanced trading features
- **1inch Spot Price API**: Real-time price data
- **1inch History API**: Transaction tracking
- **1inch Charts API**: Price charts and market data
- **1inch NFT API**: NFT portfolio tracking
- **1inch Domains API**: ENS and domain services

### Infrastructure
- **Build Tool**: Vite with HMR and hot reload
- **Type Safety**: Full TypeScript coverage
- **API Proxy**: Vite proxy for CORS handling
- **Environment**: Secure environment variable management

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file with your API keys:
```env
VITE_1INCH_API_URL=https://api.1inch.dev
VITE_1INCH_API_KEY=your_1inch_api_key_here
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

**Get API Keys:**
- 1inch API key: https://portal.1inch.dev/
- WalletConnect Project ID: https://cloud.walletconnect.com

### 3. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
npm run preview  # Preview production build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── AdvancedDashboard.tsx     # Main portfolio dashboard with charts
│   ├── WalletConnector.tsx       # RainbowKit wallet connection
│   ├── BalanceList.tsx          # Token balance display
│   ├── SwapForm.tsx             # Token swap interface
│   ├── SwapHistory.tsx          # Transaction history
│   ├── NetworkStatus.tsx        # Network information
│   ├── FusionTrading.tsx        # Advanced Fusion trading
│   ├── MarketAnalytics.tsx      # Market data and analytics
│   └── ui/                      # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       └── loading-spinner.tsx
├── hooks/
│   ├── usePortfolio.ts          # Portfolio data and analytics
│   ├── useBalances.ts           # Wallet balance fetching
│   ├── useSwap.ts               # Swap execution
│   ├── useQuote.ts              # Price quotes
│   ├── useFusion.ts             # Fusion trading
│   ├── useSpotPrice.ts          # Real-time prices
│   ├── useHistory.ts            # Transaction history
│   └── useCharts.ts             # Chart data
├── utils/
│   ├── portfolio.ts             # Portfolio API utilities
│   ├── swap.ts                  # Swap API utilities
│   ├── fusion.ts                # Fusion API utilities
│   ├── spotPrice.ts             # Price API utilities
│   ├── history.ts               # History API utilities
│   ├── charts.ts                # Charts API utilities
│   ├── nft.ts                   # NFT API utilities
│   ├── domains.ts               # Domains API utilities
│   ├── balance.ts               # Balance API utilities
│   └── tokens.ts                # Token metadata
├── config/
│   └── wagmi.ts                 # Wallet and chain configuration
├── types/
│   └── index.ts                 # TypeScript type definitions
└── App.tsx                      # Main application component
```

## 🔌 API Integration

### 1inch APIs Implemented

#### Core Trading APIs
- **Classic Swap API v6.1**: Token swaps with best rates
- **Fusion API**: Advanced order types and MEV protection
- **Liquidity Sources API**: Access to 100+ DEX protocols

#### Portfolio & Analytics APIs
- **Portfolio API v4**: Current portfolio value and breakdown
- **Portfolio API v5**: Advanced analytics and CSV reports
- **Chart API v5.0**: Portfolio value charts with multiple timeframes
- **Spot Price API**: Real-time token prices
- **History API v2.0**: Transaction history and tracking

#### Advanced Features
- **NFT API**: NFT portfolio tracking (ready for integration)
- **Domains API**: ENS and domain services
- **Orderbook API**: Order book data for advanced trading
- **Web3 RPC API**: Direct blockchain interaction
- **Traces API**: Transaction trace analysis

### Supported Networks
- **Ethereum** (Chain ID: 1)
- **BSC** (Chain ID: 56)
- **Polygon** (Chain ID: 137)
- **Arbitrum** (Chain ID: 42161)
- **Optimism** (Chain ID: 10)
- **Base** (Chain ID: 8453)
- **Linea** (Chain ID: 59144)

### Key Features
- Automatic network detection and switching
- Real-time balance updates
- Gas optimization and estimation
- Slippage protection
- MEV protection via Fusion
- Multi-chain portfolio aggregation

## 📱 Usage Guide

### Getting Started
1. **Connect Your Wallet**: Click "Connect Wallet" and choose your preferred wallet
2. **Switch Networks**: Use your wallet to switch between supported chains
3. **View Portfolio**: Navigate to the Portfolio tab to see your holdings

### Portfolio Dashboard
- **Overview**: See total portfolio value and 24h change
- **Protocol Breakdown**: View holdings across different DeFi protocols
- **Interactive Charts**: Analyze portfolio performance with Area/Line charts
- **Time Ranges**: Switch between 1D, 1W, 1M, 3M, 1Y, and 3Y views
- **CSV Export**: Download detailed portfolio reports

### Trading Features
- **Token Swaps**: 
  - Select tokens from the dropdown
  - Enter amount to swap
  - Review quote and gas estimation
  - Execute swap with one click
- **Fusion Trading**: Access advanced order types for better pricing
- **Market Analysis**: View real-time prices and market data

### Transaction History
- **Swap History**: Track all your transactions
- **Etherscan Links**: Click to view transactions on block explorer
- **Status Tracking**: See pending, successful, and failed transactions

### Multi-Chain Support
- **Automatic Detection**: App detects your wallet's current network
- **Seamless Switching**: Switch networks directly from your wallet
- **Unified Portfolio**: View holdings across all supported chains

## 🚀 Deployment

### Supported Platforms
The application is ready for deployment on:
- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**
- **Any static hosting service**

### Environment Variables
Set these environment variables in your hosting platform:
```env
VITE_1INCH_API_URL=https://api.1inch.dev
VITE_1INCH_API_KEY=your_1inch_api_key_here
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with automatic builds on push

## 🔧 Development

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (if configured)
- **Vite**: Fast development and build

### Adding New Features
1. **New API Endpoints**: Add to `src/utils/` directory
2. **New Hooks**: Create in `src/hooks/` directory
3. **New Components**: Add to `src/components/` directory
4. **Types**: Define in `src/types/index.ts`

### Testing
- Test wallet connection on different networks
- Verify API responses with different addresses
- Test responsive design on mobile devices

## 🔍 Troubleshooting

### Common Issues

#### API Key Issues
```bash
# Check if API key is properly set
echo $VITE_1INCH_API_KEY
```
- Ensure API key is active on 1inch portal
- Check API key permissions and rate limits

#### Network Issues
- Ensure wallet is connected to supported network
- Check if network is properly configured in `wagmi.ts`
- Verify RPC endpoints are working

#### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Linux File Watcher Limit
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Performance Optimization
- API responses are cached for better performance
- Vite proxy handles CORS and injects API keys securely
- Recharts provides smooth chart interactions
- Components are optimized with React.memo where needed

## 📊 Features Overview

### Dashboard Tabs
1. **Portfolio**: Complete portfolio analytics with charts
2. **Balances**: Token balance overview across chains
3. **Swap**: Token trading with best rates
4. **History**: Transaction history tracking
5. **Fusion**: Advanced trading features
6. **Analytics**: Market data and insights

### Advanced Features
- **Multi-timeframe Charts**: 1D, 1W, 1M, 3M, 1Y, 3Y
- **Chart Types**: Area and Line charts with smooth animations
- **Protocol Analytics**: See holdings breakdown by DeFi protocol
- **CSV Export**: Download portfolio data for analysis
- **Real-time Updates**: Live balance and price updates
- **Gas Optimization**: Intelligent gas estimation
- **MEV Protection**: Built-in MEV protection via Fusion

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/1SwapDash.git`
3. Install dependencies: `npm install`
4. Create environment file: Copy `.env.example` to `.env`
5. Start development server: `npm run dev`

### Pull Request Process
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test thoroughly
3. Commit with descriptive messages
4. Push to your fork and create pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **1inch**: For providing comprehensive DeFi APIs
- **wagmi**: For excellent wallet integration
- **RainbowKit**: For beautiful wallet connection UI
- **shadcn/ui**: For modern UI components
- **Recharts**: For interactive chart components
