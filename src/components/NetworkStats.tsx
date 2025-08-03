import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { LoadingSpinner } from './ui/loading-spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNetworkWired, faBolt } from '@fortawesome/free-solid-svg-icons'
import { useNetworkInfo, useGasPrice, useLatestBlock } from '../hooks/advanced-hooks'
import { useChainId } from 'wagmi'
import type { NodeType } from '../utils/web3Rpc'

const CHAIN_NAMES: { [chainId: number]: string } = {
  1: 'Ethereum',
  56: 'BSC',
  137: 'Polygon',
  42161: 'Arbitrum',
  10: 'Optimism',
  8453: 'Base',
  59144: 'Linea'
}

export const NetworkStats: React.FC = () => {
  const chainId = useChainId()
  const [nodeType, setNodeType] = useState<NodeType>('full')
  const { loading: networkLoading, error: networkError } = useNetworkInfo()
  const { gasPrice, loading: gasLoading, error: gasError } = useGasPrice()
  const { block, loading: blockLoading, error: blockError } = useLatestBlock()

  const chainName = CHAIN_NAMES[chainId] || `Chain ${chainId}`
  const loading = networkLoading || gasLoading || blockLoading
  const error = networkError || gasError || blockError

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString()
  }

  const getBlockTimeAgo = (timestamp: number) => {
    const secondsAgo = Math.floor(Date.now() / 1000) - timestamp
    if (secondsAgo < 60) return `${secondsAgo}s ago`
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`
    return `${Math.floor(secondsAgo / 3600)}h ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faNetworkWired} className="w-5 h-5 text-blue-500" />
            Network Statistics
            <Badge variant="outline">1inch Web3 RPC API</Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant={nodeType === 'full' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setNodeType('full')}
            >
              Full Node
            </Button>
            <Button
              variant={nodeType === 'archive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setNodeType('archive')}
            >
              Archive
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <div className="space-y-6">
            {/* Node Type Info */}
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-purple-700">Node Type</h4>
                  <p className="text-lg font-bold text-purple-900 capitalize">{nodeType}</p>
                </div>
                <Badge variant="secondary">
                  {nodeType === 'archive' ? 'Historical Data' : 'Latest State'}
                </Badge>
              </div>
              <p className="text-xs text-purple-600 mt-1">
                {nodeType === 'archive' 
                  ? 'Access to complete historical blockchain data'
                  : 'Access to current and recent blockchain state'
                }
              </p>
            </div>

            {/* Network Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-700 mb-1">Network</h4>
                <p className="text-lg font-bold text-blue-900">{chainName}</p>
                <p className="text-xs text-blue-600">Chain ID: {chainId}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-700 mb-1">Gas Price</h4>
                <p className="text-lg font-bold text-green-900">
                  {gasPrice.gwei} Gwei
                </p>
                <p className="text-xs text-green-600">
                  {gasPrice.eth.toFixed(8)} ETH
                </p>
              </div>
            </div>

            {/* Latest Block Info */}
            {block && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">Latest Block</h4>
                  <Badge variant="secondary">
                    #{block.number.toLocaleString()}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Block Hash</p>
                    <p className="font-mono text-xs break-all">
                      {block.hash.slice(0, 20)}...
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">Timestamp</p>
                    <p className="font-medium">{formatTimestamp(block.timestamp)}</p>
                    <p className="text-xs text-gray-500">
                      {getBlockTimeAgo(block.timestamp)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">Transactions</p>
                    <p className="font-medium">{block.transactionCount}</p>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Gas Limit</p>
                      <p className="font-medium">{block.gasLimit.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">Gas Used</p>
                      <p className="font-medium">{block.gasUsed.toLocaleString()}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(block.gasUsed / block.gasLimit) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {((block.gasUsed / block.gasLimit) * 100).toFixed(1)}% utilized
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Real-time indicators */}
            <div className="text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <FontAwesomeIcon icon={faBolt} className="w-3 h-3 text-yellow-500" />
                Updates every 30 seconds • Powered by 1inch Web3 RPC API
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Rate limited to prevent 429 errors
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
