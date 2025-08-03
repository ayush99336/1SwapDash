import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId } from 'wagmi'

export const WalletConnector: React.FC = () => {
  const { isConnected } = useAccount()
  const chainId = useChainId()

  const getChainName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'Ethereum'
      case 56: return 'BSC'
      case 59144: return 'Linea'
      case 137: return 'Polygon'
      case 10: return 'Optimism'
      case 42161: return 'Arbitrum'
      case 11155111: return 'Sepolia'
      default: return `Chain ${chainId}`
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {isConnected && chainId && (
        <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {getChainName(chainId)} (ID: {chainId})
        </div>
      )}
      <ConnectButton />
    </div>
  )
}
