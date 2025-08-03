import axios from 'axios'

// Use proxy in development, direct API in production
const API_BASE_URL = import.meta.env.DEV 
  ? '/api/1inch' 
  : import.meta.env.VITE_1INCH_API_URL

const API_KEY = import.meta.env.VITE_1INCH_API_KEY

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    ...(import.meta.env.DEV ? {} : { 'Authorization': `Bearer ${API_KEY}` }),
    'accept': 'application/json',
  },
})

// Portfolio API Types
export interface PortfolioProtocol {
  protocol_name: string
  result: Array<{
    chain_id: number | null
    value_usd: number
  }>
}

export interface PortfolioDetails {
  result: PortfolioProtocol[]
  meta: {
    cached_at: number
  }
}

export interface PortfolioValueChart {
  timestamp: number
  value_usd: number
}

// Portfolio v5.0 Chart Response Type
export interface PortfolioChartResponse {
  result: Array<{
    timestamp: number
    value_usd: number
  }>
}

// Charts API Types
export interface ChartLine {
  time: number
  value: number
}

export interface ChartCandle {
  time: number
  open: number
  high: number
  low: number
  close: number
}

export interface LinesResponse {
  data: ChartLine[]
}

export interface CandlesResponse {
  data: ChartCandle[]
}

// Spot Price API Types
export interface TokenPrice {
  [tokenAddress: string]: number
}

export interface PriceRequest {
  addresses: string[]
  currency?: string
}

// History API Types  
export interface Transaction {
  hash: string
  blockNumber: number
  timeStamp: number
  from: string
  to: string
  value: string
  gas: string
  gasPrice: string
  gasUsed: string
  status: string
  input: string
  contractAddress?: string
  tokenName?: string
  tokenSymbol?: string
  tokenDecimal?: string
  transactionIndex: number
  cumulativeGasUsed: string
}

export interface TransactionHistory {
  result: Transaction[]
  status: string
  message: string
}

// New History API v2.0 Types
export interface HistoryEventDto {
  id: string
  address: string
  type: number
  rating: 'Reliable' | 'Scam'
  timeMs: number
  details: {
    orderInBlock: number
    txHash: string
    chainId: number
    blockNumber: number
    blockTimeSec: number
    status: string
    type: string
    tokenActions: Array<{
      address: string
      standard: string
      fromAddress: string
      toAddress: string
      tokenId?: any
      amount?: any
      direction: 'In' | 'Out' | 'Self' | 'On'
    }>
    fromAddress: string
    toAddress: string
    nonce: number
    feeInSmallestNative: string
    meta?: {
      is1inchFusionSwap?: any
      is1inchCrossChainSwap?: any
      orderFillPercentage?: any
      ensDomainName?: any
      fromChainId?: any
      toChainId?: any
      safeAddress?: any
      protocol?: any
    }
  }
  cache_counter: number
}

export interface HistoryResponseDto {
  items: HistoryEventDto[]
}

// Token Details API Types
export interface TokenDetails {
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI?: string
  tags?: string[]
  totalSupply?: string
  circulatingSupply?: string
  marketCap?: number
  price?: number
  priceChange24h?: number
  volume24h?: number
  liquidity?: number
  holders?: number
  description?: string
  website?: string
  socialLinks?: {
    twitter?: string
    telegram?: string
    discord?: string
    medium?: string
  }
}

// =============================================================================
// PORTFOLIO API
// =============================================================================

// Get portfolio overview for a wallet
export const getPortfolioDetails = async (
  address: string,
  chainId: number
): Promise<PortfolioDetails> => {
  try {
    const response = await api.get(`/portfolio/portfolio/v4/overview/erc20/current_value`, {
      params: {
        addresses: address,
        chain_id: chainId,
        use_cache: true
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching portfolio details:', error)
    throw error
  }
}

// Get portfolio value chart data (using Portfolio v5.0 chart endpoint)
export const getPortfolioValueChart = async (
  address: string,
  chainId: number,
  timeframe: '1day' | '1week' | '1month' | '3years' = '1day'
): Promise<PortfolioValueChart[]> => {
  try {
    // Use Portfolio v5.0 chart endpoint for actual portfolio value
    const response = await api.get(`/portfolio/portfolio/v5.0/general/chart`, {
      params: {
        addresses: [address],
        chain_id: chainId,
        timerange: timeframe,
        use_cache: false
      },
      paramsSerializer: {
        indexes: null,
      }
    })
    
    // Portfolio v5.0 returns the data in the correct format already
    const chartData: PortfolioValueChart[] = response.data.result.map((item: any) => ({
      timestamp: item.timestamp,
      value_usd: item.value_usd
    }))
    
    return chartData
  } catch (error) {
    console.error('Error fetching portfolio value chart:', error)
    // Return empty array instead of throwing to prevent UI crashes
    return []
  }
}

// Get portfolio token details
export const getPortfolioTokenDetails = async (
  address: string,
  chainId: number
): Promise<TokenDetails[]> => {
  try {
    const response = await api.get(`/portfolio/portfolio/v4/overview/erc20/details`, {
      params: {
        addresses: address,
        chain_id: chainId,
        use_cache: true
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching portfolio token details:', error)
    throw error
  }
}

// Get profit and loss data
export const getPortfolioProfitLoss = async (
  address: string,
  chainId: number,
  fromTimestamp: string,
  toTimestamp: string
): Promise<any> => {
  try {
    const response = await api.get(`/portfolio/portfolio/v4/overview/erc20/profit_and_loss`, {
      params: {
        addresses: address,
        chain_id: chainId,
        from_timestamp: fromTimestamp,
        to_timestamp: toTimestamp,
        use_cache: true
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching portfolio profit/loss:', error)
    throw error
  }
}

// Get portfolio general report (CSV format)
export const getPortfolioReport = async (
  address: string,
  chainId: number
): Promise<string> => {
  try {
    const response = await api.get(`/portfolio/portfolio/v5.0/general/report`, {
      params: {
        addresses: address,
        chain_id: chainId
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching portfolio report:', error)
    throw error
  }
}

// =============================================================================
// SPOT PRICE API  
// =============================================================================

// Get current token prices
export const getTokenPrices = async (
  addresses: string[],
  chainId: number,
  currency: string = 'USD'
): Promise<TokenPrice> => {
  try {
    const response = await api.get(`/price/v1.1/${chainId}`, {
      params: {
        tokens: addresses.join(','),
        currency
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching token prices:', error)
    throw error
  }
}

// =============================================================================
// HISTORY API
// =============================================================================

// Get transaction history events for a wallet (new v2.0 endpoint)
export const getHistoryEvents = async (
  address: string,
  chainId?: number,
  limit: number = 100,
  tokenAddress?: string,
  fromTimestampMs?: string,
  toTimestampMs?: string
): Promise<HistoryResponseDto> => {
  try {
    const params: any = { limit }
    
    if (chainId) params.chainId = chainId
    if (tokenAddress) params.tokenAddress = tokenAddress
    if (fromTimestampMs) params.fromTimestampMs = fromTimestampMs
    if (toTimestampMs) params.toTimestampMs = toTimestampMs

    const response = await api.get(`/history/v2.0/history/${address}/events`, {
      params
    })
    return response.data
  } catch (error) {
    console.error('Error fetching history events:', error)
    throw error
  }
}

// Legacy transaction history function (kept for backwards compatibility)
export const getTransactionHistory = async (
  address: string,
  chainId: number,
  _page: number = 1, // Not used in new API
  limit: number = 100
): Promise<TransactionHistory> => {
  try {
    // Try to get events and convert to legacy format
    const events = await getHistoryEvents(address, chainId, limit)
    
    // Convert new format to legacy format
    const transactions: Transaction[] = events.items.map((event: HistoryEventDto) => ({
      hash: event.details.txHash,
      blockNumber: event.details.blockNumber,
      timeStamp: Math.floor(event.timeMs / 1000),
      from: event.details.fromAddress,
      to: event.details.toAddress,
      value: '0', // Not directly available in new format
      gas: '0', // Not directly available in new format
      gasPrice: '0', // Not directly available in new format
      gasUsed: '0', // Not directly available in new format
      status: event.details.status,
      input: '', // Not directly available in new format
      transactionIndex: event.details.orderInBlock,
      cumulativeGasUsed: '0', // Not directly available in new format
    }))

    return {
      result: transactions,
      status: '1',
      message: 'OK'
    }
  } catch (error) {
    console.error('Error fetching transaction history:', error)
    throw error
  }
}

// =============================================================================
// CHARTS API
// =============================================================================

// Get line chart data for token pair
export const getTokenPairLineChart = async (
  token0: string,
  token1: string,
  period: '24H' | '1W' | '1M' | '1Y' | 'AllTime',
  chainId: number
): Promise<LinesResponse> => {
  try {
    const response = await api.get(`/charts/v1.0/chart/line/${token0}/${token1}/${period}/${chainId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching line chart:', error)
    throw error
  }
}

// Get ETH/USDT price chart as a fallback chart
export const getETHUSDTChart = async (
  period: '24H' | '1W' | '1M' | '1Y' | 'AllTime' = '24H',
  chainId: number = 1
): Promise<PortfolioValueChart[]> => {
  try {
    // Use WETH address instead of native ETH for Charts API
    const wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' // WETH mainnet
    const usdtAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7' // USDT mainnet
    
    const response = await api.get(`/charts/v1.0/chart/line/${wethAddress}/${usdtAddress}/${period}/${chainId}`)
    
    // Convert Charts API response to portfolio chart format
    const chartData: PortfolioValueChart[] = response.data.data.map((item: ChartLine) => ({
      timestamp: item.time,
      value_usd: item.value
    }))
    
    return chartData
  } catch (error) {
    console.error('Error fetching WETH/USDT chart:', error)
    return []
  }
}

// Get candle chart data for token pair
export const getTokenPairCandleChart = async (
  token0: string,
  token1: string,
  seconds: 300 | 900 | 3600 | 14400 | 86400 | 604800, // 5m, 15m, 1h, 4h, 1d, 1w
  chainId: number
): Promise<CandlesResponse> => {
  try {
    const response = await api.get(`/charts/v1.0/chart/aggregated/candle/${token0}/${token1}/${seconds}/${chainId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching candle chart:', error)
    throw error
  }
}

// =============================================================================
// TOKEN DETAILS API
// =============================================================================

// Get detailed information about a token
export const getTokenDetails = async (
  tokenAddress: string,
  chainId: number
): Promise<TokenDetails> => {
  try {
    const response = await api.get(`/token/v1.2/${chainId}/${tokenAddress}`)
    return response.data
  } catch (error) {
    console.error('Error fetching token details:', error)
    throw error
  }
}

// Search for tokens by name or symbol
export const searchTokens = async (
  query: string,
  chainId: number,
  limit: number = 50
): Promise<TokenDetails[]> => {
  try {
    const response = await api.get(`/token/v1.2/${chainId}/search`, {
      params: { query, limit }
    })
    return response.data.tokens || []
  } catch (error) {
    console.error('Error searching tokens:', error)
    throw error
  }
}
