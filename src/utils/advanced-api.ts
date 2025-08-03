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
// TRACES API
// =============================================================================

export interface TraceCall {
  type: string
  from: string
  to: string
  value?: string
  gas?: string
  gasUsed?: string
  input?: string
  output?: string
  error?: string
  revertReason?: string
  calls?: TraceCall[]
}

export interface TransactionTrace {
  txHash: string
  result: TraceCall[]
}

// Get transaction trace/call tree
export const getTransactionTrace = async (
  txHash: string,
  chainId: number
): Promise<TransactionTrace> => {
  try {
    const response = await api.get(`/trace/v1.0/${chainId}/${txHash}`)
    return response.data
  } catch (error) {
    console.error('Error fetching transaction trace:', error)
    throw error
  }
}

// =============================================================================
// NFT API
// =============================================================================

export interface NFTMetadata {
  name?: string
  description?: string
  image?: string
  external_url?: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
}

export interface NFTToken {
  contract: string
  tokenId: string
  tokenURI?: string
  metadata?: NFTMetadata
  owner?: string
  approved?: string
  tokenStandard: 'ERC721' | 'ERC1155'
  balance?: string
}

export interface NFTCollection {
  contract: string
  name?: string
  symbol?: string
  totalSupply?: string
  tokenStandard: 'ERC721' | 'ERC1155'
  contractURI?: string
  tokens: NFTToken[]
}

// Get NFT collections for a wallet
export const getNFTCollections = async (
  address: string,
  chainId: number,
  limit: number = 100
): Promise<NFTCollection[]> => {
  try {
    const response = await api.get(`/nft/v1.0/${chainId}/collections/${address}`, {
      params: { limit }
    })
    return response.data.collections || []
  } catch (error) {
    console.error('Error fetching NFT collections:', error)
    throw error
  }
}

// Get specific NFT token details
export const getNFTToken = async (
  contract: string,
  tokenId: string,
  chainId: number
): Promise<NFTToken> => {
  try {
    const response = await api.get(`/nft/v1.0/${chainId}/${contract}/${tokenId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching NFT token:', error)
    throw error
  }
}

// =============================================================================
// WEB3 RPC API (Blockchain Node Access)
// =============================================================================

export interface BlockInfo {
  number: string
  hash: string
  parentHash: string
  timestamp: string
  gasLimit: string
  gasUsed: string
  transactions: string[]
  size: string
  difficulty?: string
  totalDifficulty?: string
  miner?: string
}

export interface TransactionInfo {
  hash: string
  blockNumber: string
  blockHash: string
  transactionIndex: string
  from: string
  to: string
  value: string
  gas: string
  gasPrice: string
  input: string
  nonce: string
  v: string
  r: string
  s: string
}

export interface TransactionReceipt {
  transactionHash: string
  blockNumber: string
  blockHash: string
  transactionIndex: string
  from: string
  to: string
  gasUsed: string
  status: string
  logs: Array<{
    address: string
    topics: string[]
    data: string
    blockNumber: string
    transactionHash: string
    logIndex: string
  }>
}

// Get latest block number
export const getLatestBlockNumber = async (chainId: number): Promise<string> => {
  try {
    const response = await api.post(`/web3/v1.2/${chainId}`, {
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
      params: [],
      id: 1
    })
    return response.data.result
  } catch (error) {
    console.error('Error fetching latest block number:', error)
    throw error
  }
}

// Get block by number or hash
export const getBlock = async (
  blockNumberOrHash: string,
  chainId: number,
  includeTransactions: boolean = false
): Promise<BlockInfo> => {
  try {
    const response = await api.post(`/web3/v1.2/${chainId}`, {
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: [blockNumberOrHash, includeTransactions],
      id: 1
    })
    return response.data.result
  } catch (error) {
    console.error('Error fetching block:', error)
    throw error
  }
}

// Get transaction by hash
export const getTransaction = async (
  txHash: string,
  chainId: number
): Promise<TransactionInfo> => {
  try {
    const response = await api.post(`/web3/v1.2/${chainId}`, {
      jsonrpc: '2.0',
      method: 'eth_getTransactionByHash',
      params: [txHash],
      id: 1
    })
    return response.data.result
  } catch (error) {
    console.error('Error fetching transaction:', error)
    throw error
  }
}

// Get transaction receipt
export const getTransactionReceipt = async (
  txHash: string,
  chainId: number
): Promise<TransactionReceipt> => {
  try {
    const response = await api.post(`/web3/v1.2/${chainId}`, {
      jsonrpc: '2.0',
      method: 'eth_getTransactionReceipt',
      params: [txHash],
      id: 1
    })
    return response.data.result
  } catch (error) {
    console.error('Error fetching transaction receipt:', error)
    throw error
  }
}

// Get ETH balance for an address
export const getETHBalance = async (
  address: string,
  chainId: number,
  blockNumber: string = 'latest'
): Promise<string> => {
  try {
    const response = await api.post(`/web3/v1.2/${chainId}`, {
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [address, blockNumber],
      id: 1
    })
    return response.data.result
  } catch (error) {
    console.error('Error fetching ETH balance:', error)
    throw error
  }
}

// Call a smart contract method
export const callContract = async (
  to: string,
  data: string,
  chainId: number,
  from?: string,
  blockNumber: string = 'latest'
): Promise<string> => {
  try {
    const callObject: any = { to, data }
    if (from) callObject.from = from

    const response = await api.post(`/web3/v1.2/${chainId}`, {
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [callObject, blockNumber],
      id: 1
    })
    return response.data.result
  } catch (error) {
    console.error('Error calling contract:', error)
    throw error
  }
}

// Estimate gas for a transaction
export const estimateGas = async (
  to: string,
  data: string,
  chainId: number,
  from?: string,
  value?: string
): Promise<string> => {
  try {
    const callObject: any = { to, data }
    if (from) callObject.from = from
    if (value) callObject.value = value

    const response = await api.post(`/web3/v1.2/${chainId}`, {
      jsonrpc: '2.0',
      method: 'eth_estimateGas',
      params: [callObject],
      id: 1
    })
    return response.data.result
  } catch (error) {
    console.error('Error estimating gas:', error)
    throw error
  }
}
