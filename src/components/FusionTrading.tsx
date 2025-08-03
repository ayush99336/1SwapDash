import React, { useState, useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { useLiquiditySources } from '../hooks/advanced-hooks'
import { LoadingSpinner } from './ui/loading-spinner'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { formatNumber } from '../utils'

interface FusionOrder {
  hash: string
  status: string
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
  created: number
  deadline: number
}

export const FusionTrading: React.FC = () => {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [activeOrders, setActiveOrders] = useState<FusionOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { sources: liquiditySources, loading: sourcesLoading } = useLiquiditySources()

  // Load active Fusion orders
  useEffect(() => {
    if (isConnected && address) {
      loadActiveOrders()
    }
  }, [isConnected, address, chainId])

  const loadActiveOrders = async () => {
    if (!address) return

    setLoading(true)
    setError(null)
    try {
      // Simulated orders for demo - replace with actual API call
      const orders: FusionOrder[] = []
      setActiveOrders(orders)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  // Placeholder function - would integrate with actual Fusion API
  const createFusionOrder = async (fromToken: string, toToken: string, amount: string) => {
    if (!address) return

    setLoading(true)
    setError(null)
    try {
      // This would be the actual Fusion order creation
      console.log('Creating Fusion order:', { fromToken, toToken, amount })
      
      // Refresh orders after creation
      await loadActiveOrders()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⚡ Fusion Trading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center">Connect your wallet to access Fusion trading</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ⚡ Fusion Trading
          <Badge variant="secondary">Beta</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 text-sm">
              Fusion is 1inch's intent-based trading protocol that provides better prices and MEV protection.
              Orders are filled by resolvers competing to give you the best execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Active Orders</h3>
            <p className="text-2xl font-bold text-gray-900">
              {activeOrders.length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Available Resolvers</h3>
            <p className="text-2xl font-bold text-gray-900">
              {liquiditySources.length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Network</h3>
            <p className="text-lg font-semibold text-gray-900">
              Chain {chainId}
            </p>
          </div>
        </div>
      </div>

      {/* Active Orders */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Active Fusion Orders</h3>
          <Button onClick={loadActiveOrders} disabled={loading} size="sm">
            {loading ? <LoadingSpinner /> : 'Refresh'}
          </Button>
        </div>

        {loading && activeOrders.length === 0 ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-4">
            <p>{error}</p>
          </div>
        ) : activeOrders.length > 0 ? (
          <div className="space-y-3">
            {activeOrders.map((order) => (
              <div key={order.hash} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm">
                      Order: {order.hash.slice(0, 10)}...{order.hash.slice(-8)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(order.created * 1000).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    order.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'filled'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">From:</p>
                    <p className="font-medium">
                      {formatNumber(parseFloat(order.fromAmount) / 1e18, 6)} {order.fromToken}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">To:</p>
                    <p className="font-medium">
                      {formatNumber(parseFloat(order.toAmount) / 1e18, 6)} {order.toToken}
                    </p>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  Deadline: {new Date(order.deadline * 1000).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No active Fusion orders</p>
            <p className="text-sm text-gray-500 mt-1">
              Create your first Fusion order to get better prices and MEV protection
            </p>
          </div>
        )}
          </div>

          {/* Liquidity Sources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Available Liquidity Sources</h3>
            
            {sourcesLoading ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            ) : liquiditySources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liquiditySources.slice(0, 9).map((source: any) => (
              <div key={source.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  {source.img && (
                    <img 
                      src={source.img} 
                      alt={source.title} 
                      className="w-12 h-12 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  )}
                  <div>
                    <p className="font-medium text-sm">{source.title}</p>
                    <p className="text-xs text-gray-500">{source.id}</p>
                  </div>
                </div>
              </div>
            ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">No liquidity sources available</p>
          )}
          </div>
      </CardContent>
    </Card>
  )
}
