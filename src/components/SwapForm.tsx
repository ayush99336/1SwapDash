import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { TokenSelector } from './TokenSelector'
import { Button } from './shared/Button'
import { LoadingSpinner } from './shared/LoadingSpinner'
import { useQuote } from '../hooks/useQuote'
import { useSwap, type SwapTransaction } from '../hooks/useSwap'
import { type Token } from '../utils/tokens'
import { formatUnits } from 'viem'

interface SwapFormProps {
  onSwapComplete?: (transaction: SwapTransaction) => void
}

export const SwapForm: React.FC<SwapFormProps> = ({ onSwapComplete }) => {
  const { isConnected } = useAccount()
  const [fromToken, setFromToken] = useState<Token | undefined>()
  const [toToken, setToToken] = useState<Token | undefined>()
  const [amount, setAmount] = useState('')
  const [slippage, setSlippage] = useState(1)

  const { quote, loading: quoteLoading, error: quoteError } = useQuote({
    fromToken: fromToken?.address,
    toToken: toToken?.address,
    amount,
    fromDecimals: fromToken?.decimals
  })

  const { executeSwap, loading: swapLoading, error: swapError } = useSwap()

  const handleSwap = async () => {
    if (!fromToken || !toToken || !amount || !quote) return

    try {
      const transaction = await executeSwap(
        fromToken.address,
        toToken.address,
        amount,
        fromToken.decimals,
        slippage
      )
      
      if (transaction && onSwapComplete) {
        onSwapComplete(transaction)
      }
      
      // Reset form
      setAmount('')
    } catch (error) {
      console.error('Swap failed:', error)
    }
  }

  const canSwap = isConnected && fromToken && toToken && amount && quote && !quoteLoading && !swapLoading

  const formatQuoteAmount = (amount: string, decimals: number) => {
    try {
      return parseFloat(formatUnits(BigInt(amount), decimals)).toFixed(6)
    } catch {
      return '0'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Swap Tokens</h2>

      <div className="space-y-4">
        {/* From Token */}
        <TokenSelector
          selectedToken={fromToken}
          onSelect={setFromToken}
          label="From"
          excludeToken={toToken?.address}
        />

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!fromToken}
          />
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              setFromToken(toToken)
              setToToken(fromToken)
            }}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            disabled={!fromToken || !toToken}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* To Token */}
        <TokenSelector
          selectedToken={toToken}
          onSelect={setToToken}
          label="To"
          excludeToken={fromToken?.address}
        />

        {/* Slippage Settings */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slippage Tolerance: {slippage}%
          </label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={slippage}
            onChange={(e) => setSlippage(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Quote Display */}
        {quoteLoading && (
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
            <LoadingSpinner size="sm" />
            <span className="ml-2 text-gray-600">Getting best price...</span>
          </div>
        )}

        {quote && !quoteLoading && (
          <div className="p-4 bg-blue-50 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">You'll receive:</span>
              <span className="font-medium">
                {formatQuoteAmount(quote.dstAmount, quote.dstToken.decimals)} {quote.dstToken.symbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Gas:</span>
              <span className="text-sm">{quote.gas ? parseInt(quote.gas).toLocaleString() : 'N/A'}</span>
            </div>
          </div>
        )}

        {quoteError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{quoteError}</p>
          </div>
        )}

        {swapError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{swapError}</p>
          </div>
        )}

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={!canSwap}
          loading={swapLoading}
          className="w-full"
          size="lg"
        >
          {!isConnected 
            ? 'Connect Wallet' 
            : !fromToken || !toToken 
            ? 'Select Tokens' 
            : !amount 
            ? 'Enter Amount'
            : 'Swap'
          }
        </Button>
      </div>
    </div>
  )
}
