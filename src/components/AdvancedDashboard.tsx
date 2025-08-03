import React, { useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { usePortfolio, usePortfolioChart, useTransactionHistory, useHistoryEvents, useTopTokens, usePortfolioReport } from '../hooks/advanced-hooks'
import { formatCurrency, formatPercentage, formatNumber } from '../utils'

// Recharts components
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Line, LineChart } from 'recharts'

// shadcn/ui components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Icons from lucide-react
import { TrendingUp, TrendingDown, Download, Activity, DollarSign, Layers, Clock } from 'lucide-react'

// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value
    const date = new Date(label * 1000)
    
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            {date.toLocaleDateString('en-US', { 
              weekday: 'short',
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-xs text-muted-foreground">
            {date.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-sm font-semibold text-primary">
              {formatCurrency(value)}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export const AdvancedDashboard: React.FC = () => {
  const { isConnected } = useAccount()
  useChainId() // Required for hooks to work correctly
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1day' | '1week' | '1month' | '3years'>('1day')
  const [chartType, setChartType] = useState<'area' | 'line'>('area')

  const { portfolio, loading: portfolioLoading, error: portfolioError } = usePortfolio()
  const { chartData, loading: chartLoading } = usePortfolioChart(selectedTimeframe)
  const { transactions, loading: historyLoading } = useTransactionHistory(10)
  const { events, loading: eventsLoading } = useHistoryEvents(10)
  const { tokens: topTokens, loading: topTokensLoading } = useTopTokens('24h', 10)
  const { report, loading: reportLoading } = usePortfolioReport()

  // Transform chart data for Recharts
  const formatChartData = (data: any[]) => {
    return data.map(point => ({
      timestamp: point.timestamp,
      value: point.value_usd,
      date: new Date(point.timestamp * 1000).toLocaleDateString(),
      time: new Date(point.timestamp * 1000).toLocaleTimeString()
    }))
  }

  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Connect your wallet to view advanced analytics</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Portfolio Overview
          </CardTitle>
          <CardDescription>
            Your complete DeFi portfolio breakdown across all protocols
          </CardDescription>
        </CardHeader>
        <CardContent>
          {portfolioLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : portfolioError ? (
            <div className="text-center py-8">
              <p className="text-destructive">{portfolioError}</p>
            </div>
          ) : portfolio ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <h3 className="text-sm font-medium text-blue-600">Total Value</h3>
                    </div>
                    <p className="text-2xl font-bold">
                      {formatCurrency(
                        portfolio.result.reduce((total, protocol) => 
                          total + protocol.result.reduce((sum, item) => sum + item.value_usd, 0), 0
                        )
                      )}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Layers className="h-4 w-4 text-green-600" />
                      <h3 className="text-sm font-medium text-green-600">Protocols</h3>
                    </div>
                    <p className="text-2xl font-bold">{portfolio.result.length}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <h3 className="text-sm font-medium text-purple-600">Last Updated</h3>
                    </div>
                    <p className="text-lg font-bold">
                      {new Date(portfolio.meta.cached_at * 1000).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Portfolio Protocol Breakdown */}
              {portfolio.result.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Protocol Breakdown</h3>
                  <div className="space-y-2">
                    {portfolio.result.map((protocol, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="font-medium capitalize">{protocol.protocol_name}</p>
                              <Badge variant="secondary">
                                {protocol.result.length} chain{protocol.result.length !== 1 ? 's' : ''}
                              </Badge>
                            </div>
                            <div className="text-right space-y-1">
                              <p className="font-medium">
                                {formatCurrency(protocol.result.reduce((sum, item) => sum + item.value_usd, 0))}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {protocol.result.map(item => item.chain_id || 'All chains').join(', ')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No portfolio data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Chart */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Portfolio Value Chart
              </CardTitle>
              <CardDescription>
                Track your portfolio performance over time
              </CardDescription>
            </div>
            <div className="flex space-x-4">
              {/* Chart Type Selector */}
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant={chartType === 'area' ? 'default' : 'outline'}
                  onClick={() => setChartType('area')}
                >
                  Area
                </Button>
                <Button
                  size="sm"
                  variant={chartType === 'line' ? 'default' : 'outline'}
                  onClick={() => setChartType('line')}
                >
                  Line
                </Button>
              </div>
              
              {/* Timeframe Selector */}
              <div className="flex space-x-2">
                {(['1day', '1week', '1month', '3years'] as const).map((timeframe) => (
                  <Button
                    key={timeframe}
                    size="sm"
                    variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                    onClick={() => setSelectedTimeframe(timeframe)}
                  >
                    {timeframe}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartLoading ? (
            <div className="h-80 flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : chartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'area' ? (
                  <AreaChart data={formatChartData(chartData)}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="timestamp"
                      tickFormatter={(timestamp) => new Date(timestamp * 1000).toLocaleDateString()}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value)}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                ) : (
                  <LineChart data={formatChartData(chartData)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="timestamp"
                      tickFormatter={(timestamp) => new Date(timestamp * 1000).toLocaleDateString()}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value)}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
              
              {/* Chart Stats */}
              <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                <span>{chartData.length} data points</span>
                <span>Current: {formatCurrency(chartData[chartData.length - 1]?.value_usd || 0)}</span>
                <span>{chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart • {selectedTimeframe}</span>
              </div>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center border rounded-lg">
              <p className="text-muted-foreground">No chart data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <CardDescription>
              Your recent DeFi transactions and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="events" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="events">Recent Events</TabsTrigger>
                <TabsTrigger value="legacy">Legacy Format</TabsTrigger>
              </TabsList>
              
              <TabsContent value="events" className="space-y-3 mt-4">
                {eventsLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : events.length > 0 ? (
                  <div className="space-y-3">
                    {events.slice(0, 5).map((event) => (
                      <Card key={event.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant={event.rating === 'Reliable' ? 'default' : 'destructive'}>
                                {event.rating}
                              </Badge>
                              <Badge variant="secondary">
                                {event.details.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(event.timeMs).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="text-sm space-y-1">
                            <p className="font-medium font-mono">
                              {event.details.txHash.slice(0, 10)}...{event.details.txHash.slice(-8)}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Block: {event.details.blockNumber} • 
                              Fee: {(parseFloat(event.details.feeInSmallestNative) / 1e18).toFixed(6)} ETH
                            </p>
                          </div>
                          
                          {/* Token Actions */}
                          {event.details.tokenActions.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {event.details.tokenActions.slice(0, 2).map((action, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 border rounded">
                                  <div className="flex items-center space-x-2">
                                    <Badge 
                                      variant={
                                        action.direction === 'In' ? 'default' :
                                        action.direction === 'Out' ? 'destructive' : 'secondary'
                                      }
                                      className="text-xs"
                                    >
                                      {action.direction}
                                    </Badge>
                                    <span className="text-xs font-mono">
                                      {action.address.slice(0, 6)}...{action.address.slice(-4)}
                                    </span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {action.standard}
                                  </Badge>
                                </div>
                              ))}
                              {event.details.tokenActions.length > 2 && (
                                <p className="text-xs text-muted-foreground">
                                  +{event.details.tokenActions.length - 2} more actions
                                </p>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No recent events available</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="legacy" className="space-y-3 mt-4">
                {historyLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Showing legacy transaction format</p>
                    {transactions.slice(0, 5).map((tx) => (
                      <Card key={tx.hash}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="font-medium text-sm font-mono">
                                {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(parseInt(tx.timeStamp.toString()) * 1000).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right space-y-1">
                              <p className="text-sm font-medium">
                                {formatNumber(parseFloat(tx.value) / 1e18, 4)} ETH
                              </p>
                              <Badge variant={tx.status === '1' ? 'default' : 'destructive'}>
                                {tx.status === '1' ? 'Success' : 'Failed'}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No transaction history available</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Top Tokens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Tokens (24h)
            </CardTitle>
            <CardDescription>
              Most active tokens in the market
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topTokensLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : topTokens.length > 0 ? (
              <div className="space-y-3">
                {topTokens.slice(0, 5).map((token, index) => (
                  <Card key={token.address}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono">
                            #{index + 1}
                          </Badge>
                          <div className="space-y-1">
                            <p className="font-medium">{token.symbol}</p>
                            <p className="text-xs text-muted-foreground">{token.name}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-medium">
                            {formatCurrency(token.price)}
                          </p>
                          <div className="flex items-center gap-1">
                            {token.priceChange >= 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                            <span className={`text-xs ${token.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatPercentage(token.priceChange)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No token data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Report */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Portfolio Report (CSV Data)
              </CardTitle>
              <CardDescription>
                Raw portfolio data from 1inch Portfolio API v5.0
              </CardDescription>
            </div>
            {report && (
              <Button
                size="sm"
                variant="outline"
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
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {reportLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : report ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">
                  Raw data from 1inch Portfolio API v5.0
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Generated on {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="border rounded-lg p-4 bg-muted/50">
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-words">
                  {report}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No portfolio report available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
