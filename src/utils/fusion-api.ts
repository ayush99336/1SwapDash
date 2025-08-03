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

// =============================================================================
// FUSION API (Intent-based Swaps)
// =============================================================================

export interface FusionOrder {
  orderHash: string
  signature: string
  deadline: number
  auctionStartDate: number
  auctionEndDate: number
  makingAmount: string
  takingAmount: string
  makerAsset: string
  takerAsset: string
  maker: string
  receiver?: string
  allowedSender?: string
  interactions?: string
  permit?: string
  preInteractions?: string
  postInteractions?: string
}

export interface FusionQuoteRequest {
  fromTokenAddress: string
  toTokenAddress: string
  amount: string
  walletAddress: string
  permit?: string
  receiver?: string
  preset?: 'fast' | 'medium' | 'slow'
  isPermit2?: boolean
}

export interface FusionQuoteResponse {
  fromToken: {
    address: string
    symbol: string
    name: string
    decimals: number
    logoURI?: string
  }
  toToken: {
    address: string
    symbol: string
    name: string
    decimals: number
    logoURI?: string
  }
  fromTokenAmount: string
  toTokenAmount: string
  presets: {
    fast: { auctionDuration: number; startAuctionIn: number }
    medium: { auctionDuration: number; startAuctionIn: number }
    slow: { auctionDuration: number; startAuctionIn: number }
  }
  prices: {
    fast: string
    medium: string
    slow: string
  }
  volume24h?: string
  gasless: boolean
}

export interface FusionOrderStatus {
  status: 'pending' | 'filled' | 'cancelled' | 'expired' | 'partial'
  filledMakingAmount?: string
  filledTakingAmount?: string
  fills?: Array<{
    txHash: string
    filledMakingAmount: string
    filledTakingAmount: string
  }>
}

// Get Fusion swap quote (gasless swaps)
export const getFusionQuote = async (
  params: FusionQuoteRequest,
  chainId: number
): Promise<FusionQuoteResponse> => {
  try {
    const response = await api.get(`/fusion/v1.0/${chainId}/quote`, { params })
    return response.data
  } catch (error) {
    console.error('Error fetching Fusion quote:', error)
    throw error
  }
}

// Submit Fusion order
export const submitFusionOrder = async (
  order: FusionOrder,
  chainId: number
): Promise<{ orderHash: string }> => {
  try {
    const response = await api.post(`/fusion/v1.0/${chainId}/order`, order)
    return response.data
  } catch (error) {
    console.error('Error submitting Fusion order:', error)
    throw error
  }
}

// Get Fusion order status
export const getFusionOrderStatus = async (
  orderHash: string,
  chainId: number
): Promise<FusionOrderStatus> => {
  try {
    const response = await api.get(`/fusion/v1.0/${chainId}/order/${orderHash}`)
    return response.data
  } catch (error) {
    console.error('Error fetching Fusion order status:', error)
    throw error
  }
}

// Get active Fusion orders for a wallet
export const getActiveFusionOrders = async (
  walletAddress: string,
  chainId: number,
  page: number = 1,
  limit: number = 50
): Promise<{ orders: FusionOrder[]; meta: { totalItems: number } }> => {
  try {
    const response = await api.get(`/fusion/v1.0/${chainId}/orders/active/${walletAddress}`, {
      params: { page, limit }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching active Fusion orders:', error)
    throw error
  }
}

// =============================================================================
// CHARTS API
// =============================================================================

export interface PricePoint {
  timestamp: number
  price: number
  volume?: number
}

export interface TokenChart {
  prices: PricePoint[]
  volumes?: PricePoint[]
  marketCaps?: PricePoint[]
}

export interface PoolInfo {
  address: string
  token0: {
    address: string
    symbol: string
    name: string
    decimals: number
  }
  token1: {
    address: string
    symbol: string
    name: string
    decimals: number
  }
  reserve0: string
  reserve1: string
  totalSupply: string
  fee: number
  volume24h: string
  volumeWeek: string
  apr: number
}

// Get token price chart
export const getTokenChart = async (
  tokenAddress: string,
  chainId: number,
  timeframe: '1h' | '4h' | '1d' | '1w' | '1M' | '1y' = '1d',
  currency: string = 'USD'
): Promise<TokenChart> => {
  try {
    const response = await api.get(`/charts/v1.0/${chainId}/chart/${tokenAddress}`, {
      params: { timeframe, currency }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching token chart:', error)
    throw error
  }
}

// Get top tokens by volume/market cap
export const getTopTokens = async (
  _chainId: number,
  _timeframe: '24h' | '7d' | '30d' = '24h',
  _limit: number = 10
): Promise<Array<{
  address: string
  symbol: string
  name: string
  price: number
  priceChange: number
  volume: number
  marketCap: number
}>> => {
  try {
    // This endpoint appears to be unavailable in Charts API v1.0
    // Return empty array to prevent errors
    console.warn('Top tokens endpoint not available in Charts API v1.0')
    return []
  } catch (error) {
    console.error('Error fetching top tokens:', error)
    return []
  }
}

// Get liquidity pools information
export const getPools = async (
  chainId: number,
  limit: number = 100,
  offset: number = 0
): Promise<PoolInfo[]> => {
  try {
    const response = await api.get(`/charts/v1.0/${chainId}/pools`, {
      params: { limit, offset }
    })
    return response.data.pools || []
  } catch (error) {
    console.error('Error fetching pools:', error)
    throw error
  }
}

// =============================================================================
// DOMAINS API (ENS/Web3 Domains)
// =============================================================================

export interface DomainInfo {
  domain: string
  address: string
  resolver?: string
  ttl?: number
  records?: {
    [key: string]: string
  }
}

export interface DomainReverseInfo {
  address: string
  domain?: string
  avatar?: string
}

// Resolve domain to address
export const resolveDomain = async (
  domain: string,
  chainId: number = 1 // ENS is primarily on Ethereum
): Promise<DomainInfo> => {
  try {
    const response = await api.get(`/domains/v1.0/${chainId}/resolve/${domain}`)
    return response.data
  } catch (error) {
    console.error('Error resolving domain:', error)
    throw error
  }
}

// Reverse resolve address to domain
export const reverseResolveDomain = async (
  address: string,
  chainId: number = 1
): Promise<DomainReverseInfo> => {
  try {
    const response = await api.get(`/domains/v1.0/${chainId}/reverse/${address}`)
    return response.data
  } catch (error) {
    console.error('Error reverse resolving domain:', error)
    throw error
  }
}

// Get domain records (text records, avatar, etc.)
export const getDomainRecords = async (
  domain: string,
  chainId: number = 1
): Promise<{ [recordType: string]: string }> => {
  try {
    const response = await api.get(`/domains/v1.0/${chainId}/records/${domain}`)
    return response.data.records || {}
  } catch (error) {
    console.error('Error fetching domain records:', error)
    throw error
  }
}

// =============================================================================
// ORDERBOOK API (Limit Orders)
// =============================================================================

export interface LimitOrder {
  orderHash: string
  signature: string
  makerAsset: string
  takerAsset: string
  makingAmount: string
  takingAmount: string
  maker: string
  allowedSender?: string
  receiver?: string
  deadline: number
  interactions?: string
  permit?: string
}

export interface OrderbookQuote {
  fromToken: {
    address: string
    symbol: string
    name: string
    decimals: number
  }
  toToken: {
    address: string
    symbol: string
    name: string
    decimals: number
  }
  fromTokenAmount: string
  toTokenAmount: string
  expires: number
}

// Get limit order quote
export const getLimitOrderQuote = async (
  makerAsset: string,
  takerAsset: string,
  makingAmount: string,
  chainId: number
): Promise<OrderbookQuote> => {
  try {
    const response = await api.get(`/orderbook/v1.0/${chainId}/quote`, {
      params: { makerAsset, takerAsset, makingAmount }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching limit order quote:', error)
    throw error
  }
}

// Submit limit order
export const submitLimitOrder = async (
  order: LimitOrder,
  chainId: number
): Promise<{ orderHash: string }> => {
  try {
    const response = await api.post(`/orderbook/v1.0/${chainId}/order`, order)
    return response.data
  } catch (error) {
    console.error('Error submitting limit order:', error)
    throw error
  }
}

// Get active limit orders for a wallet
export const getActiveLimitOrders = async (
  walletAddress: string,
  chainId: number,
  page: number = 1,
  limit: number = 50
): Promise<{ orders: LimitOrder[]; meta: { totalItems: number } }> => {
  try {
    const response = await api.get(`/orderbook/v1.0/${chainId}/orders/${walletAddress}`, {
      params: { page, limit }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching active limit orders:', error)
    throw error
  }
}
