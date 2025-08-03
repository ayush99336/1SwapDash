import React, { useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { usePortfolio, usePortfolioChart, useTransactionHistory, useHistoryEvents, useTopTokens, usePortfolioReport } from '../hooks/advanced-hooks'
import { LoadingSpinner } from './shared/LoadingSpinner'
import { Button } from './shared/Button'
import { formatCurrency, formatPercentage, formatNumber } from '../utils'

export const AdvancedDashboard: React.FC = () => {
  const { isConnected } = useAccount()
  useChainId() // Required for hooks to work correctly
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '1w' | '1M' | '1y'>('24h')

  const { portfolio, loading: portfolioLoading, error: portfolioError } = usePortfolio()
  const { chartData, loading: chartLoading } = usePortfolioChart(selectedTimeframe)
  const { transactions, loading: historyLoading } = useTransactionHistory(10)
  const { events, loading: eventsLoading } = useHistoryEvents(10)
  const { tokens: topTokens, loading: topTokensLoading } = useTopTokens('24h', 10)
  const { report, loading: reportLoading } = usePortfolioReport()

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 text-center">Connect your wallet to view advanced analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
        
        {portfolioLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : portfolioError ? (
          <div className="text-red-600 text-center">
            <p>{portfolioError}</p>
          </div>
        ) : portfolio ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-1">Total Value</h3>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(
                  portfolio.result.reduce((total, protocol) => 
                    total + protocol.result.reduce((sum, item) => sum + item.value_usd, 0), 0
                  )
                )}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800 mb-1">Protocols Count</h3>
              <p className="text-2xl font-bold text-green-900">
                {portfolio.result.length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-800 mb-1">Last Updated</h3>
              <p className="text-lg font-bold text-purple-900">
                {new Date(portfolio.meta.cached_at * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-center">No portfolio data available</p>
        )}

        {/* Portfolio Protocol Breakdown */}
        {portfolio && portfolio.result.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Protocol Breakdown</h3>
            <div className="space-y-2">
              {portfolio.result.map((protocol, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm capitalize">{protocol.protocol_name}</p>
                    <p className="text-xs text-gray-500">
                      {protocol.result.length} chain{protocol.result.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(protocol.result.reduce((sum, item) => sum + item.value_usd, 0))}
                    </p>
                    <p className="text-xs text-gray-500">
                      {protocol.result.map(item => item.chain_id || 'All chains').join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Portfolio Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Portfolio Value Chart</h2>
          <div className="flex space-x-2">
            {(['1h', '24h', '1w', '1M', '1y'] as const).map((timeframe) => (
              <Button
                key={timeframe}
                size="sm"
                variant={selectedTimeframe === timeframe ? 'primary' : 'outline'}
                onClick={() => setSelectedTimeframe(timeframe)}
              >
                {timeframe}
              </Button>
            ))}
          </div>
        </div>
        
        {chartLoading ? (
          <div className="h-64 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : chartData.length > 0 ? (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Chart visualization would go here</p>
            <p className="text-sm text-gray-500 ml-2">({chartData.length} data points)</p>
          </div>
        ) : (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">No chart data available</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Transaction History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          
          {/* Tab selector for different views */}
          <div className="mb-4">
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">
                Recent Events
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
                Legacy Format
              </button>
            </div>
          </div>
          
          {eventsLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : events.length > 0 ? (
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => (
                <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        event.rating === 'Reliable' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {event.rating}
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {event.details.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(event.timeMs).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-medium">
                      {event.details.txHash.slice(0, 10)}...{event.details.txHash.slice(-8)}
                    </p>
                    <p className="text-gray-600 text-xs">
                      Block: {event.details.blockNumber} • 
                      Fee: {(parseFloat(event.details.feeInSmallestNative) / 1e18).toFixed(6)} ETH
                    </p>
                  </div>
                  
                  {/* Token Actions */}
                  {event.details.tokenActions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {event.details.tokenActions.slice(0, 2).map((action, idx) => (
                        <div key={idx} className="text-xs bg-white p-2 rounded border">
                          <span className={`inline-block px-1 py-0.5 rounded text-xs ${
                            action.direction === 'In' ? 'bg-green-100 text-green-700' :
                            action.direction === 'Out' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {action.direction}
                          </span>
                          <span className="ml-2 text-gray-600">
                            {action.address.slice(0, 6)}...{action.address.slice(-4)} ({action.standard})
                          </span>
                        </div>
                      ))}
                      {event.details.tokenActions.length > 2 && (
                        <p className="text-xs text-gray-500">
                          +{event.details.tokenActions.length - 2} more actions
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : historyLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-2">Showing legacy transaction format</p>
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.hash} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">
                      {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(parseInt(tx.timeStamp.toString()) * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatNumber(parseFloat(tx.value) / 1e18, 4)} ETH
                    </p>
                    <p className={`text-xs ${tx.status === '1' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.status === '1' ? 'Success' : 'Failed'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">No transaction history available</p>
          )}
        </div>

        {/* Top Tokens */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Top Tokens (24h)</h2>
          
          {topTokensLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : topTokens.length > 0 ? (
            <div className="space-y-3">
              {topTokens.slice(0, 5).map((token, index) => (
                <div key={token.address} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-sm">{token.symbol}</p>
                      <p className="text-xs text-gray-500">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(token.price)}
                    </p>
                    <p className={`text-xs ${token.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(token.priceChange)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">No token data available</p>
          )}
        </div>
      </div>

      {/* Portfolio Report */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Portfolio Report (CSV Data)</h2>
          {report && (
            <Button
              size="sm"
              onClick={() => {
                const blob = new Blob([report], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `portfolio-report-${new Date().toISOString().split('T')[0]}.csv`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
              }}
            >
              Download CSV
            </Button>
          )}
        </div>
        
        {reportLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : report ? (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              Raw portfolio data from 1inch Portfolio API v5.0:
            </p>
            <pre className="text-xs overflow-x-auto bg-white p-3 rounded border">
              {report}
            </pre>
          </div>
        ) : (
          <p className="text-gray-600 text-center">No portfolio report available</p>
        )}
      </div>
    </div>
  )
}
