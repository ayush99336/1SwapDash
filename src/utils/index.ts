// Master 1inch API Integration
// This file exports all 1inch API functionality organized by category

// Core Swap APIs
export * from './api'

// Portfolio & Analytics APIs  
export * from './portfolio-api'

// Advanced APIs (Traces, NFT, Web3 RPC)
export * from './advanced-api'

// Fusion, Charts, Domains, Orderbook APIs
export * from './fusion-api'

// Supported networks for easy reference
export const SUPPORTED_NETWORKS = {
  ETHEREUM: { id: 1, name: 'Ethereum', symbol: 'ETH' },
  BSC: { id: 56, name: 'BSC', symbol: 'BNB' },
  POLYGON: { id: 137, name: 'Polygon', symbol: 'MATIC' },
  OPTIMISM: { id: 10, name: 'Optimism', symbol: 'ETH' },
  ARBITRUM: { id: 42161, name: 'Arbitrum', symbol: 'ETH' },
  LINEA: { id: 59144, name: 'Linea', symbol: 'ETH' }
} as const

export type SupportedChainId = keyof typeof SUPPORTED_NETWORKS

// Utility functions
export const getNetworkInfo = (chainId: number) => {
  return Object.values(SUPPORTED_NETWORKS).find(network => network.id === chainId)
}

export const formatNumber = (num: number, decimals: number = 2): string => {
  if (num >= 1e9) return (num / 1e9).toFixed(decimals) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M' 
  if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K'
  return num.toFixed(decimals)
}

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  if (typeof amount !== 'number' || isNaN(amount) || !isFinite(amount)) {
    return '$0.00'
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export const formatPercentage = (percentage: number | undefined): string => {
  if (typeof percentage !== 'number' || isNaN(percentage)) {
    return '0.00%'
  }
  const sign = percentage >= 0 ? '+' : ''
  return `${sign}${percentage.toFixed(2)}%`
}

// API Categories for easy discovery
export const API_CATEGORIES = {
  SWAP: {
    name: 'Swap APIs',
    description: 'Classic swaps, quotes, approvals',
    functions: [
      'getQuote', 'getSwap', 'getAllowance', 'getApprovalTransaction', 
      'getSpender', 'getLiquiditySources', 'getGasPrice'
    ]
  },
  PORTFOLIO: {
    name: 'Portfolio APIs', 
    description: 'Wallet analytics, token balances, value tracking',
    functions: [
      'getBalances', 'getPortfolioDetails', 'getPortfolioValueChart',
      'getTokenPrices', 'getTokenDetails', 'searchTokens'
    ]
  },
  HISTORY: {
    name: 'History APIs',
    description: 'Transaction history and traces',
    functions: [
      'getTransactionHistory', 'getTransactionTrace'
    ]
  },
  FUSION: {
    name: 'Fusion APIs',
    description: 'Intent-based gasless swaps',
    functions: [
      'getFusionQuote', 'submitFusionOrder', 'getFusionOrderStatus',
      'getActiveFusionOrders'
    ]
  },
  ORDERBOOK: {
    name: 'Orderbook APIs',
    description: 'Limit orders and order management',
    functions: [
      'getLimitOrderQuote', 'submitLimitOrder', 'getActiveLimitOrders'
    ]
  },
  CHARTS: {
    name: 'Charts APIs',
    description: 'Price charts, market data, analytics',
    functions: [
      'getTokenChart', 'getTopTokens', 'getPools'
    ]
  },
  NFT: {
    name: 'NFT APIs',
    description: 'NFT collections and token data',
    functions: [
      'getNFTCollections', 'getNFTToken'
    ]
  },
  WEB3: {
    name: 'Web3 RPC APIs',
    description: 'Direct blockchain node access',
    functions: [
      'getLatestBlockNumber', 'getBlock', 'getTransaction',
      'getTransactionReceipt', 'getETHBalance', 'callContract', 'estimateGas'
    ]
  },
  DOMAINS: {
    name: 'Domains APIs',
    description: 'ENS and Web3 domain resolution',
    functions: [
      'resolveDomain', 'reverseResolveDomain', 'getDomainRecords'
    ]
  }
} as const

// Common error handling
export class OneInchAPIError extends Error {
  statusCode?: number
  response?: any

  constructor(
    message: string,
    statusCode?: number,
    response?: any
  ) {
    super(message)
    this.name = 'OneInchAPIError'
    this.statusCode = statusCode
    this.response = response
  }
}

// Rate limiting helper
export class RateLimiter {
  private calls: number[] = []
  private maxCalls: number
  private timeWindow: number
  
  constructor(
    maxCalls: number = 100,
    timeWindow: number = 60000 // 1 minute
  ) {
    this.maxCalls = maxCalls
    this.timeWindow = timeWindow
  }
  
  canMakeCall(): boolean {
    const now = Date.now()
    this.calls = this.calls.filter(time => now - time < this.timeWindow)
    
    if (this.calls.length >= this.maxCalls) {
      return false
    }
    
    this.calls.push(now)
    return true
  }
  
  getWaitTime(): number {
    if (this.calls.length === 0) return 0
    
    const oldestCall = Math.min(...this.calls)
    const timeToWait = this.timeWindow - (Date.now() - oldestCall)
    return Math.max(0, timeToWait)
  }
}

// Create a default rate limiter instance
export const rateLimiter = new RateLimiter()

// Batch operations helper
export const batchTokenPrices = async (
  addresses: string[],
  chainId: number,
  batchSize: number = 10
) => {
  const { getTokenPrices } = await import('./portfolio-api')
  const batches = []
  
  for (let i = 0; i < addresses.length; i += batchSize) {
    batches.push(addresses.slice(i, i + batchSize))
  }
  
  const results = await Promise.all(
    batches.map(batch => getTokenPrices(batch, chainId))
  )
  
  return results.reduce((acc, batch) => ({ ...acc, ...batch }), {})
}
