import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { LoadingSpinner } from './ui/loading-spinner'
import { useSpotPrices } from '../hooks/advanced-hooks'
import { formatPrice, getTokenSymbol } from '../utils/spotPrice'
import { useChainId } from 'wagmi'

export const PriceTracker: React.FC = () => {
  const chainId = useChainId()
  const { prices, loading, error } = useSpotPrices()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📈 Real-Time Token Prices
          <Badge variant="outline">1inch Spot Price API</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : Object.keys(prices).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(prices).map(([address, price]) => {
              const symbol = getTokenSymbol(address, chainId)
              const isValidPrice = typeof price === 'number' && !isNaN(price) && price > 0
              
              return (
                <div key={address} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{symbol}</h4>
                    <Badge variant={isValidPrice ? "secondary" : "destructive"} className="text-xs">
                      {isValidPrice ? "Live" : "N/A"}
                    </Badge>
                  </div>
                  <p className={`text-lg font-bold ${isValidPrice ? 'text-green-600' : 'text-gray-400'}`}>
                    {isValidPrice ? formatPrice(price) : 'No price data'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {address.slice(0, 10)}...{address.slice(-8)}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No price data available</p>
        )}
        
        {!loading && !error && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              ⚡ Prices update every 30 seconds • Powered by 1inch Spot Price API
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
