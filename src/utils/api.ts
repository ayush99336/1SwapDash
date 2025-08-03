import axios from 'axios'

// Use proxy in development, direct API in production
const API_BASE_URL = import.meta.env.DEV 
  ? '/api/1inch' 
  : import.meta.env.VITE_1INCH_API_URL

const API_KEY = import.meta.env.VITE_1INCH_API_KEY
const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || '1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    ...(import.meta.env.DEV ? {} : { 'Authorization': `Bearer ${API_KEY}` }),
    'accept': 'application/json',
  },
})

export interface TokenBalance {
  token_address: string
  symbol: string
  name: string
  logo?: string
  thumbnail?: string
  decimals: number
  balance: string
  possible_spam: boolean
  verified_contract: boolean
  usd_price?: number
  usd_value?: number
}

export interface BalanceResponse {
  [tokenAddress: string]: string // Just balance values
}

export interface QuoteParams {
  fromTokenAddress: string
  toTokenAddress: string
  amount: string
  fee?: string
  gasLimit?: string
  protocolWhiteList?: string
  protocolBlackList?: string
  gasPrice?: string
  complexityLevel?: string
  connectorTokens?: string
  allowPartialFill?: boolean
  disableEstimate?: boolean
  usePatching?: boolean
}

export interface QuoteResponse {
  fromToken: {
    symbol: string
    name: string
    decimals: number
    address: string
    logoURI: string
  }
  toToken: {
    symbol: string
    name: string
    decimals: number
    address: string
    logoURI: string
  }
  toTokenAmount: string
  fromTokenAmount: string
  protocols: any[]
  estimatedGas: number
}

export interface SwapParams extends QuoteParams {
  fromAddress: string
  slippage: number
  disableEstimate?: boolean
  allowPartialFill?: boolean
}

export interface SwapResponse extends QuoteResponse {
  tx: {
    from: string
    to: string
    data: string
    value: string
    gasPrice: string
    gas: number
  }
}

// Get wallet token balances
export const getBalances = async (address: string): Promise<BalanceResponse> => {
  try {
    const response = await api.get(`/balance/v1.2/1/balances/${address}`)
    return response.data
  } catch (error: any) {
    console.error('Error fetching balances:', error.response?.data || error.message)
    throw new Error(error.response?.data?.description || 'Failed to fetch balances')
  }
}

// Get swap quote
export const getQuote = async (params: QuoteParams): Promise<QuoteResponse> => {
  try {
    const response = await api.get(`/swap/v6.0/${CHAIN_ID}/quote`, { params })
    return response.data
  } catch (error) {
    console.error('Error fetching quote:', error)
    throw error
  }
}

// Get swap transaction data
export const getSwap = async (params: SwapParams): Promise<SwapResponse> => {
  try {
    const response = await api.get(`/swap/v6.0/${CHAIN_ID}/swap`, { params })
    return response.data
  } catch (error) {
    console.error('Error fetching swap:', error)
    throw error
  }
}

// Get supported tokens
export const getTokens = async () => {
  try {
    const response = await api.get(`/swap/v6.0/${CHAIN_ID}/tokens`)
    return response.data
  } catch (error) {
    console.error('Error fetching tokens:', error)
    throw error
  }
}
