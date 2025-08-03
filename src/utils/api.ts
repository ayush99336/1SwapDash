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

// 1inch API interfaces based on Classic Swap API documentation

// Supported chain IDs for 1inch API
const SUPPORTED_CHAIN_IDS = [
  1,      // Ethereum
  56,     // BSC  
  137,    // Polygon
  10,     // Optimism
  42161,  // Arbitrum
  59144   // Linea
]

export const isChainSupported = (chainId: number): boolean => {
  return SUPPORTED_CHAIN_IDS.includes(chainId)
}

export interface TokenBalance {
  [tokenAddress: string]: string
}

export interface TokenInfo {
  symbol: string
  name: string
  address: string
  decimals: number
  logoURI?: string
}

export interface TokensResponse {
  tokens: { [address: string]: TokenInfo }
}

export interface QuoteRequest {
  src: string           // Token to sell (contract address)
  dst: string           // Token to buy (contract address)  
  amount: string        // Amount to sell in minimal divisible units
  includeTokensInfo?: boolean
  includeProtocols?: boolean
  includeGas?: boolean
  fee?: number
  protocols?: string
  gasPrice?: string
  complexityLevel?: string
  connectorTokens?: string
  gasLimit?: number
  mainRouteParts?: number
  parts?: number
}

export interface QuoteResponse {
  srcToken: TokenInfo
  dstToken: TokenInfo
  fromAmount: string
  dstAmount: string
  protocols?: any[]
  gas?: string
}

export interface SwapRequest extends QuoteRequest {
  from: string          // Address of seller (wallet address)
  origin: string        // EOA address which initiates transaction (for compliance)
  slippage: number      // Price slippage limit in percentage (0-50)
  receiver?: string     // Recipient address (defaults to 'from')
  referrer?: string     // Referrer's address
  permit?: string       // EIP-2612 permit
  compatibility?: boolean // Exclude Unoswap for FoT tokens
  excludedProtocols?: string
  allowPartialFill?: boolean
  disableEstimate?: boolean
  usePermit2?: boolean
}

export interface SwapResponse {
  srcToken: TokenInfo
  dstToken: TokenInfo
  fromAmount: string
  dstAmount: string
  protocols?: any[]
  tx: {
    from: string
    to: string
    data: string
    value: string
    gasPrice: string
    gas: string
  }
}

export interface AllowanceResponse {
  allowance: string
}

export interface ApprovalTransaction {
  to: string
  data: string
  value: string
  gas?: string
}

// Spender address for approvals
export interface SpenderResponse {
  address: string
}

// Protocol information
export interface Protocol {
  name: string
  part: number
  fromTokenAddress: string
  toTokenAddress: string
}

// Liquidity sources
export interface LiquiditySource {
  id: string
  title: string
  img: string
  img_color?: string
}

export interface LiquiditySourcesResponse {
  protocols: LiquiditySource[]
}

// Gas price API
export interface GasPriceResponse {
  standard: string
  fast: string
  instant: string
}

// Get token balances for a wallet on a specific chain
export const getBalances = async (address: string, chainId: number): Promise<TokenBalance> => {
  try {
    if (!isChainSupported(chainId)) {
      throw new Error(`Chain ID ${chainId} is not supported by 1inch API`)
    }
    
    // Try the correct balance API endpoint format
    const response = await api.get(`/balance/v1.2/${chainId}/balances/${address}`)
    return response.data || {}
  } catch (error) {
    console.error('Error fetching balances:', error)
    throw error
  }
}

// Get available tokens on a specific chain
export const getTokens = async (chainId: number): Promise<TokensResponse> => {
  try {
    if (!isChainSupported(chainId)) {
      throw new Error(`Chain ID ${chainId} is not supported by 1inch API`)
    }
    
    const response = await api.get(`/swap/v6.1/${chainId}/tokens`)
    return response.data
  } catch (error) {
    console.error('Error fetching tokens:', error)
    throw error
  }
}

// Get quote for a token swap on a specific chain
export const getQuote = async (params: QuoteRequest, chainId: number): Promise<QuoteResponse> => {
  try {
    if (!isChainSupported(chainId)) {
      throw new Error(`Chain ID ${chainId} is not supported by 1inch API`)
    }
    
    const response = await api.get(`/swap/v6.1/${chainId}/quote`, { params })
    return response.data
  } catch (error) {
    console.error('Error fetching quote:', error)
    throw error
  }
}

// Get swap transaction data for a token swap on a specific chain  
export const getSwap = async (params: SwapRequest, chainId: number): Promise<SwapResponse> => {
  try {
    if (!isChainSupported(chainId)) {
      throw new Error(`Chain ID ${chainId} is not supported by 1inch API`)
    }
    
    const response = await api.get(`/swap/v6.1/${chainId}/swap`, { params })
    return response.data
  } catch (error) {
    console.error('Error fetching swap:', error)
    throw error
  }
}

// Check token allowance for 1inch router on a specific chain
export const getAllowance = async (
  tokenAddress: string,
  walletAddress: string,
  chainId: number
): Promise<AllowanceResponse> => {
  try {
    if (!isChainSupported(chainId)) {
      throw new Error(`Chain ID ${chainId} is not supported by 1inch API`)
    }
    
    const response = await api.get(`/swap/v6.1/${chainId}/approve/allowance`, {
      params: {
        tokenAddress,
        walletAddress
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching allowance:', error)
    throw error
  }
}

// Get approval transaction for token spending on a specific chain
export const getApprovalTransaction = async (
  tokenAddress: string,
  amount: string,
  chainId: number
): Promise<ApprovalTransaction> => {
  try {
    if (!isChainSupported(chainId)) {
      throw new Error(`Chain ID ${chainId} is not supported by 1inch API`)
    }
    
    const response = await api.get(`/swap/v6.1/${chainId}/approve/transaction`, {
      params: {
        tokenAddress,
        amount
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching approval transaction:', error)
    throw error
  }
}

// Get 1inch router spender address for approvals
export const getSpender = async (chainId: number): Promise<SpenderResponse> => {
  try {
    if (!isChainSupported(chainId)) {
      throw new Error(`Chain ID ${chainId} is not supported by 1inch API`)
    }
    
    const response = await api.get(`/swap/v6.1/${chainId}/approve/spender`)
    return response.data
  } catch (error) {
    console.error('Error fetching spender address:', error)
    throw error
  }
}

// Get available liquidity sources/protocols
export const getLiquiditySources = async (chainId: number): Promise<LiquiditySourcesResponse> => {
  try {
    if (!isChainSupported(chainId)) {
      throw new Error(`Chain ID ${chainId} is not supported by 1inch API`)
    }
    
    const response = await api.get(`/swap/v6.1/${chainId}/liquidity-sources`)
    return response.data
  } catch (error) {
    console.error('Error fetching liquidity sources:', error)
    throw error
  }
}

// Get current gas prices for the network
export const getGasPrice = async (chainId: number): Promise<GasPriceResponse> => {
  try {
    if (!isChainSupported(chainId)) {
      throw new Error(`Chain ID ${chainId} is not supported by 1inch API`)
    }
    
    const response = await api.get(`/gas-price/v1.4/${chainId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching gas price:', error)
    throw error
  }
}
