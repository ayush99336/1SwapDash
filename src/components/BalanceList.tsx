import React from 'react'
import { useBalances } from '../hooks/useBalances'
import { LoadingSpinner } from './ui/loading-spinner'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

export const BalanceList: React.FC = () => {
  const { nativeBalance, tokenBalances, loading, error, refetch, chainId } = useBalances()

  // Get chain name for display
  const getChainName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'Ethereum'
      case 56: return 'BSC'
      case 59144: return 'Linea'
      default: return `Chain ${chainId}`
    }
  }

  // Get native token name
  const getNativeTokenName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'ETH'
      case 56: return 'BNB'
      case 59144: return 'ETH'
      default: return 'Native Token'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💰 Token Balances
            <Badge variant="outline">{getChainName(chainId)}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💰 Token Balances
            <Badge variant="outline">{getChainName(chainId)}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-center">
            <p>{error}</p>
            <Button onClick={refetch} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              💰 Token Balances
              {chainId && <Badge variant="outline">{getChainName(chainId)}</Badge>}
            </CardTitle>
          </div>
          <Button onClick={refetch} size="sm" variant="outline">
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Native Token Balance */}
        {nativeBalance && chainId && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <img 
                src="https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png" 
                alt={getNativeTokenName(chainId)} 
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="font-medium">{getNativeTokenName(chainId)}</div>
                <div className="text-sm text-gray-500">{getChainName(chainId)}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">
                {parseFloat(nativeBalance.formatted).toFixed(4)} {getNativeTokenName(chainId)}
              </div>
              <div className="text-sm text-gray-500">
                ${((parseFloat(nativeBalance.formatted) * 2000)).toFixed(2)} {/* Placeholder price */}
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
      </CardContent>
    </Card>
  )
}
