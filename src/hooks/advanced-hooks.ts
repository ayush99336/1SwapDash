import { useState, useEffect } from 'react'
import { useChainId, useAccount } from 'wagmi'
import {
  getPortfolioDetails,
  getPortfolioValueChart,
  getPortfolioTokenDetails,
  getPortfolioProfitLoss,
  getPortfolioReport,
  getTokenPrices,
  getTransactionHistory,
  getHistoryEvents,
  getFusionQuote,
  getActiveFusionOrders,
  getTokenChart,
  getTopTokens,
  getNFTCollections,
  getLiquiditySources,
  type PortfolioDetails,
  type PortfolioValueChart,
  type TokenPrice,
  type Transaction,
  type HistoryEventDto,
  type HistoryResponseDto,
  type FusionQuoteResponse,
  type FusionOrder,
  type TokenChart,
  type NFTCollection,
  type LiquiditySource
} from '../utils'
import { getSpotPrices, getPopularTokens, getSingleTokenPrice } from '../utils/spotPrice'
import { getNetworkInfo, getLatestBlock, getGasPrice } from '../utils/web3Rpc'

// Portfolio Hooks
export const usePortfolio = () => {
  const { address } = useAccount()
  const chainId = useChainId()
  const [portfolio, setPortfolio] = useState<PortfolioDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!address || !chainId) return

      setLoading(true)
      setError(null)

      try {
        const data = await getPortfolioDetails(address, chainId)
        setPortfolio(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch portfolio')
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [address, chainId])

  return { portfolio, loading, error }
}

export const usePortfolioChart = (timeframe: '1day' | '1week' | '1month' | '3years' = '1day') => {
  const { address } = useAccount()
  const chainId = useChainId()
  const [chartData, setChartData] = useState<PortfolioValueChart[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChart = async () => {
      if (!address || !chainId) return

      setLoading(true)
      setError(null)

      try {
        const data = await getPortfolioValueChart(address, chainId, timeframe)
        setChartData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch chart data')
      } finally {
        setLoading(false)
      }
    }

    fetchChart()
  }, [address, chainId, timeframe])

  return { chartData, loading, error }
}

// Portfolio Token Details Hook
export const usePortfolioTokenDetails = () => {
  const { address } = useAccount()
  const chainId = useChainId()
  const [tokenDetails, setTokenDetails] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (!address || !chainId) return

      setLoading(true)
      setError(null)

      try {
        const data = await getPortfolioTokenDetails(address, chainId)
        setTokenDetails(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch token details')
      } finally {
        setLoading(false)
      }
    }

    fetchTokenDetails()
  }, [address, chainId])

  return { tokenDetails, loading, error }
}

// Portfolio Profit/Loss Hook
export const usePortfolioProfitLoss = (
  fromTimestamp?: string,
  toTimestamp?: string
) => {
  const { address } = useAccount()
  const chainId = useChainId()
  const [profitLoss, setProfitLoss] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfitLoss = async () => {
      if (!address || !chainId || !fromTimestamp || !toTimestamp) return

      setLoading(true)
      setError(null)

      try {
        const data = await getPortfolioProfitLoss(address, chainId, fromTimestamp, toTimestamp)
        setProfitLoss(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profit/loss data')
      } finally {
        setLoading(false)
      }
    }

    fetchProfitLoss()
  }, [address, chainId, fromTimestamp, toTimestamp])

  return { profitLoss, loading, error }
}

// Portfolio Report Hook
export const usePortfolioReport = () => {
  const { address } = useAccount()
  const chainId = useChainId()
  const [report, setReport] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      if (!address || !chainId) return

      setLoading(true)
      setError(null)

      try {
        const data = await getPortfolioReport(address, chainId)
        setReport(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch portfolio report')
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [address, chainId])

  return { report, loading, error }
}

// Token Price Hook
export const useTokenPrices = (addresses: string[]) => {
  const chainId = useChainId()
  const [prices, setPrices] = useState<TokenPrice>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      if (!chainId || addresses.length === 0) return

      setLoading(true)
      setError(null)

      try {
        const data = await getTokenPrices(addresses, chainId)
        setPrices(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch prices')
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
  }, [addresses, chainId])

  return { prices, loading, error }
}

// Transaction History Hook
export const useTransactionHistory = (limit: number = 50) => {
  const { address } = useAccount()
  const chainId = useChainId()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      if (!address || !chainId) return

      setLoading(true)
      setError(null)

      try {
        const data = await getTransactionHistory(address, chainId, 1, limit)
        setTransactions(data.result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch transaction history')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [address, chainId, limit])

  return { transactions, loading, error }
}

// History Events Hook (new v2.0 API)
export const useHistoryEvents = (
  limit: number = 50,
  tokenAddress?: string,
  fromTimestampMs?: string,
  toTimestampMs?: string
) => {
  const { address } = useAccount()
  const chainId = useChainId()
  const [events, setEvents] = useState<HistoryEventDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      if (!address) return

      setLoading(true)
      setError(null)

      try {
        const data = await getHistoryEvents(
          address,
          chainId,
          limit,
          tokenAddress,
          fromTimestampMs,
          toTimestampMs
        )
        setEvents(data.items)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch history events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [address, chainId, limit, tokenAddress, fromTimestampMs, toTimestampMs])

  return { events, loading, error }
}

// Fusion Hooks
export const useFusionQuote = (
  fromToken?: string,
  toToken?: string,
  amount?: string,
  walletAddress?: string
) => {
  const chainId = useChainId()
  const [quote, setQuote] = useState<FusionQuoteResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuote = async () => {
      if (!fromToken || !toToken || !amount || !walletAddress || !chainId) {
        setQuote(null)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const data = await getFusionQuote({
          fromTokenAddress: fromToken,
          toTokenAddress: toToken,
          amount,
          walletAddress
        }, chainId)
        setQuote(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch Fusion quote')
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchQuote, 500)
    return () => clearTimeout(debounceTimer)
  }, [fromToken, toToken, amount, walletAddress, chainId])

  return { quote, loading, error }
}

export const useActiveFusionOrders = () => {
  const { address } = useAccount()
  const chainId = useChainId()
  const [orders, setOrders] = useState<FusionOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!address || !chainId) return

      setLoading(true)
      setError(null)

      try {
        const data = await getActiveFusionOrders(address, chainId)
        setOrders(data.orders)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch Fusion orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [address, chainId])

  return { orders, loading, error }
}

// Charts Hook
export const useTokenChart = (
  tokenAddress: string,
  timeframe: '1h' | '4h' | '1d' | '1w' | '1M' | '1y' = '1d'
) => {
  const chainId = useChainId()
  const [chartData, setChartData] = useState<TokenChart | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChart = async () => {
      if (!tokenAddress || !chainId) return

      setLoading(true)
      setError(null)

      try {
        const data = await getTokenChart(tokenAddress, chainId, timeframe)
        setChartData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch token chart')
      } finally {
        setLoading(false)
      }
    }

    fetchChart()
  }, [tokenAddress, chainId, timeframe])

  return { chartData, loading, error }
}

export const useTopTokens = (
  timeframe: '24h' | '7d' | '30d' = '24h',
  limit: number = 50
) => {
  const chainId = useChainId()
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopTokens = async () => {
      if (!chainId) return

      setLoading(true)
      setError(null)

      try {
        const data = await getTopTokens(chainId, timeframe, limit)
        setTokens(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch top tokens')
      } finally {
        setLoading(false)
      }
    }

    fetchTopTokens()
  }, [chainId, timeframe, limit])

  return { tokens, loading, error }
}

// NFT Hook
export const useNFTCollections = (limit: number = 50) => {
  const { address } = useAccount()
  const chainId = useChainId()
  const [collections, setCollections] = useState<NFTCollection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCollections = async () => {
      if (!address || !chainId) return

      setLoading(true)
      setError(null)

      try {
        const data = await getNFTCollections(address, chainId, limit)
        setCollections(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch NFT collections')
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [address, chainId, limit])

  return { collections, loading, error }
}

// Liquidity Sources Hook
export const useLiquiditySources = () => {
  const chainId = useChainId()
  const [sources, setSources] = useState<LiquiditySource[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSources = async () => {
      if (!chainId) return

      setLoading(true)
      setError(null)

      try {
        const data = await getLiquiditySources(chainId)
        setSources(data.protocols)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch liquidity sources')
      } finally {
        setLoading(false)
      }
    }

    fetchSources()
  }, [chainId])

  return { sources, loading, error }
}

// Spot Price API Hook
export const useSpotPrices = (tokenAddresses: string[] = []) => {
  const chainId = useChainId()
  const [prices, setPrices] = useState<{ [address: string]: number }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (tokenAddresses.length === 0) {
      // Use popular tokens if none specified
      const popularTokens = getPopularTokens(chainId)
      tokenAddresses = popularTokens
    }

    if (tokenAddresses.length === 0) return

    const fetchPrices = async () => {
      setLoading(true)
      setError(null)
      try {
        const priceData = await getSpotPrices(chainId, tokenAddresses)
        setPrices(priceData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch prices')
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
    
    // Refresh prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [chainId, tokenAddresses.join(',')])

  return { prices, loading, error, refresh: () => window.location.reload() }
}

// Single Token Price Hook
export const useTokenPrice = (tokenAddress: string) => {
  const chainId = useChainId()
  const [price, setPrice] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tokenAddress) return

    const fetchPrice = async () => {
      setLoading(true)
      setError(null)
      try {
        const priceData = await getSingleTokenPrice(chainId, tokenAddress)
        setPrice(priceData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch token price')
      } finally {
        setLoading(false)
      }
    }

    fetchPrice()
    
    // Refresh price every 30 seconds
    const interval = setInterval(fetchPrice, 30000)
    return () => clearInterval(interval)
  }, [chainId, tokenAddress])

  return { price, loading, error }
}

// Web3 RPC API Hook for Network Information
export const useNetworkInfo = () => {
  const chainId = useChainId()
  const [networkInfo, setNetworkInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      setLoading(true)
      setError(null)
      try {
        const info = await getNetworkInfo(chainId)
        setNetworkInfo(info)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch network info')
      } finally {
        setLoading(false)
      }
    }

    fetchNetworkInfo()
    
    // Refresh network info every 30 seconds to avoid rate limiting
    const interval = setInterval(fetchNetworkInfo, 30000)
    return () => clearInterval(interval)
  }, [chainId])

  return { networkInfo, loading, error }
}

// Real-time Gas Price Hook
export const useGasPrice = () => {
  const chainId = useChainId()
  const [gasPrice, setGasPrice] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGasPrice = async () => {
      setLoading(true)
      setError(null)
      try {
        const price = await getGasPrice(chainId)
        setGasPrice(price)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch gas price')
      } finally {
        setLoading(false)
      }
    }

    fetchGasPrice()
    
    // Refresh gas price every 30 seconds to avoid rate limiting
    const interval = setInterval(fetchGasPrice, 30000)
    return () => clearInterval(interval)
  }, [chainId])

  return { 
    gasPrice: {
      wei: gasPrice,
      gwei: Math.round(gasPrice / 1e9 * 100) / 100,
      eth: gasPrice / 1e18
    }, 
    loading, 
    error 
  }
}

// Latest Block Hook
export const useLatestBlock = () => {
  const chainId = useChainId()
  const [block, setBlock] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLatestBlock = async () => {
      setLoading(true)
      setError(null)
      try {
        const blockData = await getLatestBlock(chainId)
        setBlock({
          number: parseInt(blockData.number, 16),
          hash: blockData.hash,
          timestamp: parseInt(blockData.timestamp, 16),
          gasLimit: parseInt(blockData.gasLimit, 16),
          gasUsed: parseInt(blockData.gasUsed, 16),
          transactionCount: blockData.transactions.length
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch latest block')
      } finally {
        setLoading(false)
      }
    }

    fetchLatestBlock()
    
    // Refresh block info every 30 seconds to avoid rate limiting
    const interval = setInterval(fetchLatestBlock, 30000)
    return () => clearInterval(interval)
  }, [chainId])

  return { block, loading, error }
}
