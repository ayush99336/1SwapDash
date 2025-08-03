import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
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

  const openTransaction = (hash: string) => {
    window.open(`https://etherscan.io/tx/${hash}`, '_blank')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📈 Recent Swaps
        </CardTitle>
      </CardHeader>
      <CardContent>

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
                  <Badge 
                    variant={tx.status === 'success' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}
                  >
                    {tx.status}
                  </Badge>
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
      </CardContent>
    </Card>
  )
}
