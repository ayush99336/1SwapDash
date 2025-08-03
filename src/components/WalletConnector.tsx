import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export const WalletConnector: React.FC = () => {
  return (
    <div className="flex justify-end">
      <ConnectButton />
    </div>
  )
}
