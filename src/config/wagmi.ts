import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, bsc, linea } from 'wagmi/chains'

// Only include mainnets that 1inch supports
export const config = getDefaultConfig({
  appName: 'MySwap Dashboard',
  projectId: '2f05ae7f1116030fde2d36508f472bfb', // Demo project ID
  chains: [mainnet, bsc, polygon, optimism, arbitrum, linea],
  ssr: false,
})
