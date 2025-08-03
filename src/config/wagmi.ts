import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, sepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'MySwap Dashboard',
  projectId: '2f05ae7f1116030fde2d36508f472bfb', // Demo project ID
  chains: [mainnet, polygon, optimism, arbitrum, sepolia],
  ssr: false,
})
