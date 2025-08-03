export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

// Native ETH/BNB token representation across all chains
export const NATIVE_TOKEN_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

// Common tokens by chain ID
export const COMMON_TOKENS_BY_CHAIN: { [chainId: number]: { [symbol: string]: Token } } = {
  // Ethereum Mainnet (Chain ID 1)
  1: {
    ETH: {
      address: NATIVE_TOKEN_ADDRESS,
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png'
    },
    USDC: {
      address: '0xa0b86a33e6b8c6bb1c59fd5edb1e8df2da13afae',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      logoURI: 'https://tokens.1inch.io/0xa0b86a33e6b8c6bb1c59fd5edb1e8df2da13afae.png'
    },
    USDT: {
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png'
    },
    DAI: {
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png'
    },
    WBTC: {
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      symbol: 'WBTC',
      name: 'Wrapped BTC',
      decimals: 8,
      logoURI: 'https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png'
    },
    UNI: {
      address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      symbol: 'UNI',
      name: 'Uniswap',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png'
    },
    LINK: {
      address: '0x514910771af9ca656af840dff83e8264ecf986ca',
      symbol: 'LINK',
      name: 'ChainLink Token',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0x514910771af9ca656af840dff83e8264ecf986ca.png'
    }
  },
  
  // BSC (Chain ID 56) 
  56: {
    BNB: {
      address: NATIVE_TOKEN_ADDRESS,
      symbol: 'BNB',
      name: 'Binance Coin',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png'
    },
    USDT: {
      address: '0x55d398326f99059ff775485246999027b3197955',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0x55d398326f99059ff775485246999027b3197955.png'
    },
    USDC: {
      address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d.png'
    },
    BUSD: {
      address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      symbol: 'BUSD',
      name: 'Binance USD',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0xe9e7cea3dedca5984780bafc599bd69add087d56.png'
    },
    WBNB: {
      address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      symbol: 'WBNB',
      name: 'Wrapped BNB',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png'
    },
    CAKE: {
      address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      symbol: 'CAKE',
      name: 'PancakeSwap Token',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82.png'
    }
  },

  // Linea (Chain ID 59144)
  59144: {
    ETH: {
      address: NATIVE_TOKEN_ADDRESS,
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png'
    },
    USDC: {
      address: '0x176211869ca2b568f2a7d4ee941e073a821ee1ff',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      logoURI: 'https://tokens.1inch.io/0x176211869ca2b568f2a7d4ee941e073a821ee1ff.png'
    },
    USDT: {
      address: '0xa219439258ca9da29e9cc4ce5596924745e12b93',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      logoURI: 'https://tokens.1inch.io/0xa219439258ca9da29e9cc4ce5596924745e12b93.png'
    },
    WETH: {
      address: '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f',
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
      logoURI: 'https://tokens.1inch.io/0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f.png'
    }
  }
}

// Legacy interface for backward compatibility
export const COMMON_TOKENS = COMMON_TOKENS_BY_CHAIN[1] // Default to Ethereum mainnet

export const getTokenByAddress = (address: string, chainId: number = 1): Token | undefined => {
  const tokens = COMMON_TOKENS_BY_CHAIN[chainId] || {}
  return Object.values(tokens).find(
    token => token.address.toLowerCase() === address.toLowerCase()
  )
}

export const getTokenBySymbol = (symbol: string, chainId: number = 1): Token | undefined => {
  const tokens = COMMON_TOKENS_BY_CHAIN[chainId] || {}
  return tokens[symbol.toUpperCase()]
}

export const getCommonTokensForChain = (chainId: number): { [symbol: string]: Token } => {
  return COMMON_TOKENS_BY_CHAIN[chainId] || {}
}

export const formatTokenAmount = (amount: string, decimals: number): string => {
  const value = BigInt(amount)
  const divisor = BigInt(10 ** decimals)
  const quotient = value / divisor
  const remainder = value % divisor
  
  if (remainder === BigInt(0)) {
    return quotient.toString()
  }
  
  const remainderStr = remainder.toString().padStart(decimals, '0')
  const trimmedRemainder = remainderStr.replace(/0+$/, '')
  
  if (trimmedRemainder === '') {
    return quotient.toString()
  }
  
  return `${quotient}.${trimmedRemainder}`
}

export const parseTokenAmount = (amount: string, decimals: number): string => {
  const [whole, fractional = ''] = amount.split('.')
  const paddedFractional = fractional.padEnd(decimals, '0').slice(0, decimals)
  return (BigInt(whole) * BigInt(10 ** decimals) + BigInt(paddedFractional)).toString()
}
