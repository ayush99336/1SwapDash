import React from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { mainnet, bsc, polygon, optimism, arbitrum, linea } from 'wagmi/chains'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

export const NetworkStatus: React.FC = () => {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  // 1inch supported chains
  const supportedChains = [
    { ...mainnet, supported: true },
    { ...bsc, supported: true },
    { ...polygon, supported: true },
    { ...optimism, supported: true },
    { ...arbitrum, supported: true },
    { ...linea, supported: true }
  ]

  const currentChain = supportedChains.find(chain => chain.id === chainId)
  const isSupported = currentChain?.supported || false

  if (!isConnected || !chainId || isSupported) {
    return null
  }

  const handleSwitchNetwork = (targetChainId: number) => {
    switchChain({ chainId: targetChainId })
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 flex items-center gap-2">
              Network Not Supported
              <Badge variant="secondary">Switch Required</Badge>
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                You're connected to an unsupported network. Please switch to one of the supported networks to use the swap functionality.
              </p>
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
              {supportedChains.map((chain) => (
                <Button
                  key={chain.id}
                  onClick={() => handleSwitchNetwork(chain.id)}
                  variant="outline"
                  size="sm"
                  className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
                >
                  Switch to {chain.name}
                </Button>
              ))}
            </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
