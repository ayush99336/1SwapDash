import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { LoadingSpinner } from './ui/loading-spinner'
import { useChainId } from 'wagmi'
import { 
  getBalance, 
  getTransactionByHash, 
  getTransactionReceipt, 
  getCode, 
  estimateGas,
  getStorageAt,
  type NodeType 
} from '../utils/web3Rpc'

interface RpcResult {
  method: string
  result: any
  error?: string
  timestamp: number
}

export const Web3RpcDemo: React.FC = () => {
  const chainId = useChainId()
  const [nodeType, setNodeType] = useState<NodeType>('full')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<RpcResult[]>([])
  
  // Input states
  const [address, setAddress] = useState('0xA0b86a33E6B8c6bb1c59fd5edb1e8df2da13aFaE') // Example USDC address
  const [txHash, setTxHash] = useState('')
  const [contractAddress, setContractAddress] = useState('0xA0b86a33E6B8c6bb1c59fd5edb1e8df2da13aFaE')
  const [storagePosition, setStoragePosition] = useState('0x0')

  const addResult = (method: string, result: any, error?: string) => {
    const newResult: RpcResult = {
      method,
      result,
      error,
      timestamp: Date.now()
    }
    setResults(prev => [newResult, ...prev.slice(0, 9)]) // Keep last 10 results
  }

  const executeRpcCall = async (method: string, fn: () => Promise<any>) => {
    setLoading(true)
    try {
      const result = await fn()
      addResult(method, result)
    } catch (error: any) {
      addResult(method, null, error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGetBalance = () => {
    executeRpcCall('eth_getBalance', () => getBalance(chainId, address, 'latest', nodeType))
  }

  const handleGetTransaction = () => {
    if (!txHash) return
    executeRpcCall('eth_getTransactionByHash', () => getTransactionByHash(chainId, txHash, nodeType))
  }

  const handleGetTransactionReceipt = () => {
    if (!txHash) return
    executeRpcCall('eth_getTransactionReceipt', () => getTransactionReceipt(chainId, txHash, nodeType))
  }

  const handleGetCode = () => {
    executeRpcCall('eth_getCode', () => getCode(chainId, contractAddress, 'latest', nodeType))
  }

  const handleGetStorage = () => {
    executeRpcCall('eth_getStorageAt', () => getStorageAt(chainId, contractAddress, storagePosition, 'latest', nodeType))
  }

  const handleEstimateGas = () => {
    const txObject = {
      to: contractAddress,
      value: '0x0',
      data: '0x'
    }
    executeRpcCall('eth_estimateGas', () => estimateGas(chainId, txObject, nodeType))
  }

  const formatResult = (result: any): string => {
    if (result === null || result === undefined) return 'null'
    if (typeof result === 'object') return JSON.stringify(result, null, 2)
    return String(result)
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              ⚡ Advanced Web3 RPC Demo
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
          <div className="space-y-6">
            {/* Input Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input
                    value={address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                    placeholder="0x..."
                    className="font-mono text-xs"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Transaction Hash</label>
                  <Input
                    value={txHash}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTxHash(e.target.value)}
                    placeholder="0x..."
                    className="font-mono text-xs"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Contract Address</label>
                  <Input
                    value={contractAddress}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContractAddress(e.target.value)}
                    placeholder="0x..."
                    className="font-mono text-xs"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Storage Position</label>
                  <Input
                    value={storagePosition}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStoragePosition(e.target.value)}
                    placeholder="0x0"
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* RPC Method Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              <Button onClick={handleGetBalance} disabled={loading} size="sm">
                Get Balance
              </Button>
              <Button onClick={handleGetTransaction} disabled={loading || !txHash} size="sm">
                Get Transaction
              </Button>
              <Button onClick={handleGetTransactionReceipt} disabled={loading || !txHash} size="sm">
                Get Receipt
              </Button>
              <Button onClick={handleGetCode} disabled={loading} size="sm">
                Get Code
              </Button>
              <Button onClick={handleGetStorage} disabled={loading} size="sm">
                Get Storage
              </Button>
              <Button onClick={handleEstimateGas} disabled={loading} size="sm">
                Estimate Gas
              </Button>
            </div>

            {loading && (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              📊 RPC Call Results
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setResults([])}
              >
                Clear
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={result.error ? "destructive" : "secondary"}>
                        {result.method}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(result.timestamp)}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {nodeType} node
                    </Badge>
                  </div>
                  
                  {result.error ? (
                    <div className="bg-red-50 p-3 rounded border border-red-200">
                      <p className="text-red-800 text-sm font-medium">Error:</p>
                      <p className="text-red-700 text-sm">{result.error}</p>
                    </div>
                  ) : (
                    <div className="bg-white p-3 rounded border">
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-words">
                        {formatResult(result.result)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
