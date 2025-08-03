import { useState, useEffect } from 'react'
import { useChainId } from 'wagmi'
import { getQuote, type QuoteRequest, type QuoteResponse } from '../utils/api'
import { parseTokenAmount } from '../utils/tokens'

interface UseQuoteParams {
  fromToken?: string
  toToken?: string
  amount?: string
  fromDecimals?: number
}

export const useQuote = ({ fromToken, toToken, amount, fromDecimals }: UseQuoteParams) => {
  const chainId = useChainId()
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchQuote = async () => {
    if (!fromToken || !toToken || !amount || !fromDecimals || !chainId || parseFloat(amount) <= 0) {
      setQuote(null)
      return
    }

    if (fromToken.toLowerCase() === toToken.toLowerCase()) {
      setQuote(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const parsedAmount = parseTokenAmount(amount, fromDecimals)
      
      const quoteParams: QuoteRequest = {
        src: fromToken,
        dst: toToken,
        amount: parsedAmount,
        includeTokensInfo: true,
        includeProtocols: true,
        includeGas: true
      }

      const quoteData = await getQuote(quoteParams, chainId)
      setQuote(quoteData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quote')
      console.error('Error fetching quote:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchQuote()
    }, 500) // Debounce API calls

    return () => clearTimeout(debounceTimer)
  }, [fromToken, toToken, amount, fromDecimals, chainId])

  const refetch = () => {
    fetchQuote()
  }

  return {
    quote,
    loading,
    error,
    refetch
  }
}
