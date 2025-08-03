import React from 'react'
import { useBalances } from '../hooks/useBalances'
import { LoadingSpinner } from './shared/LoadingSpinner'
import { Button } from './shared/Button'

export const BalanceList: React.FC = () => {
  const { ethBalance, tokenBalances, loading, error, refetch } = useBalances()

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Token Balances</h2>
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Token Balances</h2>
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <Button onClick={refetch} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Token Balances</h2>
        <Button onClick={refetch} size="sm" variant="outline">
          Refresh
        </Button>
      </div>

      <div className="space-y-3">
        {/* ETH Balance */}
        {ethBalance && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <img 
                src="https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png" 
                alt="ETH" 
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="font-medium">ETH</div>
                <div className="text-sm text-gray-500">Ethereum</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">
                {parseFloat(ethBalance.formatted).toFixed(4)} ETH
              </div>
              <div className="text-sm text-gray-500">
                ${((parseFloat(ethBalance.formatted) * 2000)).toFixed(2)} {/* Placeholder price */}
              </div>
            </div>
          </div>
        )}

        {/* Token Balances */}
        {tokenBalances.length > 0 ? (
          tokenBalances.map((token) => (
            <div key={token.token_address} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <img 
                  src={token.logo || token.thumbnail || '/placeholder-token.png'} 
                  alt={token.symbol}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-token.png'
                  }}
                />
                <div>
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-sm text-gray-500">{token.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {parseFloat(token.formattedBalance).toFixed(4)} {token.symbol}
                </div>
                {token.usd_value && (
                  <div className="text-sm text-gray-500">
                    ${token.usd_value.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No token balances found
          </div>
        )}
      </div>
    </div>
  )
}
