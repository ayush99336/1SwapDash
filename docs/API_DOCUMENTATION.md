# API Documentation

This document outlines all the 1inch APIs implemented in the 1SwapDash application.

## 🔗 Base Configuration

### API Base URL
```
https://api.1inch.dev
```

### Authentication
All API requests require an API key in the Authorization header:
```
Authorization: Bearer YOUR_API_KEY
```

## 📊 Portfolio APIs

### Portfolio Overview (v4)
**Endpoint**: `/portfolio/portfolio/v4/overview/erc20/current_value`

**Parameters**:
- `addresses`: Wallet address(es)
- `chain_id`: Network chain ID
- `use_cache`: Boolean for caching (default: true)

**Response**: Current portfolio value and token breakdown

**Implementation**: `src/utils/portfolio.ts` → `getPortfolioOverview()`

### Portfolio Chart (v5.0)
**Endpoint**: `/portfolio/portfolio/v5.0/general/chart`

**Parameters**:
- `addresses`: Wallet address(es)
- `chain_id`: Network chain ID
- `timerange`: 1day, 1week, 1month, 3months, 1year, 3years
- `use_cache`: Boolean for caching

**Response**: Portfolio value over time with timestamps

**Implementation**: `src/utils/portfolio.ts` → `getPortfolioChart()`

### Portfolio Report (v5.0)
**Endpoint**: `/portfolio/portfolio/v5.0/general/report`

**Parameters**:
- `addresses`: Wallet address(es)
- `chain_id`: Network chain ID

**Response**: Detailed portfolio report with protocol breakdown

**Implementation**: `src/utils/portfolio.ts` → `getPortfolioReport()`

## 💰 Balance APIs

### Token Balances
**Endpoint**: `/balance/v1.2/{chainId}/balances/{address}`

**Parameters**:
- `chainId`: Network chain ID (path parameter)
- `address`: Wallet address (path parameter)

**Response**: All token balances for the address

**Implementation**: `src/utils/balance.ts` → `getBalances()`

## 🔄 Swap APIs

### Token List
**Endpoint**: `/swap/v6.1/{chainId}/tokens`

**Parameters**:
- `chainId`: Network chain ID (path parameter)

**Response**: List of supported tokens for swapping

**Implementation**: `src/utils/swap.ts` → `getTokens()`

### Swap Quote
**Endpoint**: `/swap/v6.1/{chainId}/quote`

**Parameters**:
- `chainId`: Network chain ID (path parameter)
- `src`: Source token address
- `dst`: Destination token address
- `amount`: Amount to swap (in wei)
- `includeGas`: Include gas estimation

**Response**: Swap quote with rates and gas estimation

**Implementation**: `src/utils/swap.ts` → `getQuote()`

### Execute Swap
**Endpoint**: `/swap/v6.1/{chainId}/swap`

**Parameters**:
- `chainId`: Network chain ID (path parameter)
- `src`: Source token address
- `dst`: Destination token address
- `amount`: Amount to swap (in wei)
- `from`: Wallet address
- `slippage`: Slippage tolerance (1-50)

**Response**: Transaction data for execution

**Implementation**: `src/utils/swap.ts` → `getSwap()`

### Liquidity Sources
**Endpoint**: `/swap/v6.1/{chainId}/liquidity-sources`

**Parameters**:
- `chainId`: Network chain ID (path parameter)

**Response**: Available DEXs and liquidity sources

**Implementation**: `src/utils/swap.ts` → `getLiquiditySources()`

## 💎 Fusion APIs

### Fusion Quote
**Endpoint**: `/fusion/quoter/v1.0/quote/receive`

**Parameters**:
- `chainId`: Network chain ID
- `walletAddress`: User wallet address
- `srcTokenAddress`: Source token address
- `dstTokenAddress`: Destination token address
- `amount`: Amount to swap

**Response**: Fusion quote with enhanced pricing

**Implementation**: `src/utils/fusion.ts` → `getFusionQuote()`

### Fusion Orders
**Endpoint**: `/fusion/relayer/v1.0/orders/active`

**Parameters**:
- `chainId`: Network chain ID
- `address`: Wallet address

**Response**: Active Fusion orders

**Implementation**: `src/utils/fusion.ts` → `getFusionOrders()`

## 💹 Price APIs

### Spot Prices
**Endpoint**: `/price/v1.1/{chainId}`

**Parameters**:
- `chainId`: Network chain ID (path parameter)
- `tokens`: Comma-separated token addresses
- `currency`: Currency for prices (usd, eth, etc.)

**Response**: Current token prices

**Implementation**: `src/utils/spotPrice.ts` → `getSpotPrices()`

## 📈 Charts APIs

### Token Charts
**Endpoint**: `/charts/v1.0/{chainId}/tokens/{tokenAddress}/prices`

**Parameters**:
- `chainId`: Network chain ID (path parameter)
- `tokenAddress`: Token contract address (path parameter)
- `timeFrame`: Time frame for chart data
- `pointsCount`: Number of data points

**Response**: Price chart data over time

**Implementation**: `src/utils/charts.ts` → `getChartData()`

## 📋 History APIs

### Transaction History
**Endpoint**: `/history/v2.0/history/{address}/events`

**Parameters**:
- `address`: Wallet address (path parameter)
- `chainId`: Network chain ID
- `limit`: Number of transactions to return
- `offset`: Pagination offset

**Response**: Transaction history with details

**Implementation**: `src/utils/history.ts` → `getTransactionHistory()`

## 🎨 NFT APIs

### NFT Portfolio
**Endpoint**: `/nft/v1/{chainId}/search`

**Parameters**:
- `chainId`: Network chain ID (path parameter)
- `owner`: Wallet address
- `limit`: Number of NFTs to return

**Response**: NFT portfolio data

**Implementation**: `src/utils/nft.ts` → `getNFTPortfolio()`

## 🌐 Domain APIs

### Domain Lookup
**Endpoint**: `/domains/v1.0/lookup`

**Parameters**:
- `name`: Domain name to lookup
- `chainId`: Network chain ID

**Response**: Domain resolution data

**Implementation**: `src/utils/domains.ts` → `lookupDomain()`

### Reverse Lookup
**Endpoint**: `/domains/v1.0/reverse`

**Parameters**:
- `address`: Wallet address
- `chainId`: Network chain ID

**Response**: Reverse domain lookup

**Implementation**: `src/utils/domains.ts` → `reverseLookup()`

## 📊 Orderbook APIs

### Orderbook Data
**Endpoint**: `/orderbook/v4.0/{chainId}/orderbook/{tokenA}/{tokenB}`

**Parameters**:
- `chainId`: Network chain ID (path parameter)
- `tokenA`: First token address (path parameter)
- `tokenB`: Second token address (path parameter)
- `limit`: Number of orders to return

**Response**: Orderbook data for token pair

**Implementation**: `src/utils/orderbook.ts` → `getOrderbook()`

## 🔧 Utility Functions

### API Configuration
All API utilities use a common configuration:

```typescript
const API_CONFIG = {
  baseURL: import.meta.env.VITE_1INCH_API_URL,
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_1INCH_API_KEY}`,
    'Content-Type': 'application/json'
  }
};
```

### Error Handling
All API functions include comprehensive error handling:

```typescript
try {
  const response = await axios.get(endpoint, config);
  return response.data;
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
```

### Supported Networks

| Network | Chain ID | Status |
|---------|----------|--------|
| Ethereum | 1 | ✅ |
| BSC | 56 | ✅ |
| Polygon | 137 | ✅ |
| Arbitrum | 42161 | ✅ |
| Optimism | 10 | ✅ |
| Base | 8453 | ✅ |
| Linea | 59144 | ✅ |

## 📝 Usage Examples

### Getting Portfolio Data
```typescript
import { getPortfolioOverview, getPortfolioChart } from '../utils/portfolio';

// Get current portfolio value
const portfolio = await getPortfolioOverview(address, chainId);

// Get portfolio chart data
const chartData = await getPortfolioChart(address, chainId, '1month');
```

### Executing a Swap
```typescript
import { getQuote, getSwap } from '../utils/swap';

// Get swap quote
const quote = await getQuote(chainId, srcToken, dstToken, amount);

// Execute swap
const swapData = await getSwap(chainId, srcToken, dstToken, amount, walletAddress, slippage);
```

### Getting Token Balances
```typescript
import { getBalances } from '../utils/balance';

// Get all token balances
const balances = await getBalances(chainId, address);
```

## 🔒 Security Notes

1. **API Keys**: Never expose API keys in client-side code
2. **Proxy Usage**: Use Vite proxy to inject API keys server-side
3. **Rate Limiting**: Respect 1inch API rate limits
4. **Error Handling**: Always handle API errors gracefully
5. **Input Validation**: Validate all user inputs before API calls

## 🚀 Future Enhancements

1. **Webhook Integration**: Real-time updates via webhooks
2. **Advanced Analytics**: More detailed portfolio metrics
3. **Limit Orders**: Advanced order types
4. **Cross-chain Swaps**: Multi-chain swap execution
5. **DeFi Yield**: Yield farming and staking integration
