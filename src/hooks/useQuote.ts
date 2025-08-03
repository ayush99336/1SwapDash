import { useState, useEffect } from 'react'
import { getQuote, type QuoteParams, type QuoteResponse } from '../utils/api'
import { parseTokenAmount } from '../utils/tokens'

interface UseQuoteParams {
  fromToken?: string
  toToken?: string
  amount?: string
  fromDecimals?: number
}

export const useQuote = ({ fromToken, toToken, amount, fromDecimals }: UseQuoteParams) => {
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchQuote = async () => {
    if (!fromToken || !toToken || !amount || !fromDecimals || parseFloat(amount) <= 0) {
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
      
      const quoteParams: QuoteParams = {
        fromTokenAddress: fromToken,
        toTokenAddress: toToken,
        amount: parsedAmount,
      }

      const quoteData = await getQuote(quoteParams)
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
  }, [fromToken, toToken, amount, fromDecimals])

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
