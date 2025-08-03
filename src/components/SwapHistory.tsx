import React, { useState, useEffect } from 'react'
import { type SwapTransaction } from '../hooks/useSwap'

interface SwapHistoryProps {
  newTransaction?: SwapTransaction
}

export const SwapHistory: React.FC<SwapHistoryProps> = ({ newTransaction }) => {
  const [transactions, setTransactions] = useState<SwapTransaction[]>([])

  // Load transactions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('swap-history')
    if (stored) {
      try {
        setTransactions(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to load swap history:', error)
      }
    }
  }, [])

  // Add new transaction and save to localStorage
  useEffect(() => {
    if (newTransaction) {
      setTransactions(prev => {
        const updated = [newTransaction, ...prev].slice(0, 20) // Keep last 20
        localStorage.setItem('swap-history', JSON.stringify(updated))
        return updated
      })
    }
  }, [newTransaction])

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getStatusColor = (status: SwapTransaction['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const openTransaction = (hash: string) => {
    window.open(`https://etherscan.io/tx/${hash}`, '_blank')
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Swaps</h2>

      {transactions.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No swaps yet. Your transaction history will appear here.
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div 
              key={tx.hash} 
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => openTransaction(tx.hash)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {tx.fromAmount} {tx.fromToken} → {tx.toAmount} {tx.toToken}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{formatTime(tx.timestamp)}</span>
                <span className="font-mono text-xs">
                  {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
