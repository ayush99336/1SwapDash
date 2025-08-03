import React, { useState } from 'react'
import { useChainId } from 'wagmi'
import { useTopTokens, useTokenChart } from '../hooks/advanced-hooks'
import { LoadingSpinner } from './ui/loading-spinner'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { formatCurrency, formatPercentage, formatNumber } from '../utils'

export const MarketAnalytics: React.FC = () => {
  const chainId = useChainId()
  const [selectedToken, setSelectedToken] = useState<string>('')
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h')
  const [sortBy, setSortBy] = useState<'volume' | 'price_change'>('volume')

  const { tokens: topTokens, loading: tokensLoading } = useTopTokens(timeframe, 20)
  const { chartData, loading: chartLoading } = useTokenChart(selectedToken, timeframe === '24h' ? '1d' : timeframe === '7d' ? '1w' : '1M')

  const timeframes = [
    { value: '24h' as const, label: '24H' },
    { value: '7d' as const, label: '7D' },
    { value: '30d' as const, label: '30D' }
  ]

  const sortOptions = [
    { value: 'volume' as const, label: 'Volume' },
    { value: 'price_change' as const, label: 'Price Change' }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Market Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-1">Network</h3>
            <p className="text-lg font-bold text-blue-900">
              Chain {chainId}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800 mb-1">Top Tokens</h3>
            <p className="text-lg font-bold text-green-900">
              {topTokens.length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800 mb-1">Market Cap</h3>
            <p className="text-lg font-bold text-purple-900">
              N/A
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-orange-800 mb-1">24h Volume</h3>
            <p className="text-lg font-bold text-orange-900">
              N/A
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Timeframe:</label>
            <div className="flex gap-1">
              {timeframes.map((tf) => (
                <Button
                  key={tf.value}
                  size="sm"
                  variant={timeframe === tf.value ? 'default' : 'outline'}
                  onClick={() => setTimeframe(tf.value)}
                >
                  {tf.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <div className="flex gap-1">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  size="sm"
                  variant={sortBy === option.value ? 'default' : 'outline'}
                  onClick={() => setSortBy(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tokens List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Top Tokens ({timeframe.toUpperCase()})
          </h3>
          
          {tokensLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : topTokens.length > 0 ? (
            <div className="space-y-2">
              {topTokens
                .sort((a, b) => {
                  if (sortBy === 'volume') {
                    return b.volume24h - a.volume24h
                  } else {
                    return b.priceChange - a.priceChange
                  }
                })
                .slice(0, 10)
                .map((token, index) => (
                  <div 
                    key={token.address} 
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedToken === token.address 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedToken(token.address)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 w-6">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{token.symbol}</p>
                        <p className="text-xs text-gray-500">{token.name}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrency(token.price)}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`${
                          token.priceChange >= 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {formatPercentage(token.priceChange)}
                        </span>
                        <span className="text-gray-500">
                          Vol: {formatNumber(token.volume24h, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No token data available</p>
          )}
        </div>

        {/* Token Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {selectedToken ? 'Token Price Chart' : 'Select a Token'}
          </h3>
          
          {!selectedToken ? (
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Click on a token to view its chart</p>
            </div>
          ) : chartLoading ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : chartData && chartData.prices && chartData.prices.length > 0 ? (
            <div className="space-y-4">
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Chart visualization would go here</p>
                  <p className="text-sm text-gray-500">
                    {chartData.prices.length} data points for {timeframe}
                  </p>
                </div>
              </div>
              
              {/* Chart Statistics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-600">High</p>
                  <p className="font-medium">
                    {formatCurrency(Math.max(...chartData.prices.map((d: any) => d[1])))}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-600">Low</p>
                  <p className="font-medium">
                    {formatCurrency(Math.min(...chartData.prices.map((d: any) => d[1])))}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">No chart data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Market Insights */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Market Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Top Gainer</h4>
            {topTokens.length > 0 && (
              <div>
                <p className="font-semibold text-green-900">
                  {topTokens.sort((a, b) => b.priceChange - a.priceChange)[0]?.symbol}
                </p>
                <p className="text-sm text-green-700">
                  +{formatPercentage(topTokens.sort((a, b) => b.priceChange - a.priceChange)[0]?.priceChange || 0)}
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Top Loser</h4>
            {topTokens.length > 0 && (
              <div>
                <p className="font-semibold text-red-900">
                  {topTokens.sort((a, b) => a.priceChange - b.priceChange)[0]?.symbol}
                </p>
                <p className="text-sm text-red-700">
                  {formatPercentage(topTokens.sort((a, b) => a.priceChange - b.priceChange)[0]?.priceChange || 0)}
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Highest Volume</h4>
            {topTokens.length > 0 && (
              <div>
                <p className="font-semibold text-blue-900">
                  {topTokens.sort((a, b) => b.volume24h - a.volume24h)[0]?.symbol}
                </p>
                <p className="text-sm text-blue-700">
                  {formatNumber(topTokens.sort((a, b) => b.volume24h - a.volume24h)[0]?.volume24h || 0, 0)}
                </p>
              </div>
            )}
          </div>
        </div>
        </div>
      </CardContent>
    </Card>
  )
}
