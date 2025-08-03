export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

// Common tokens on Ethereum mainnet
export const COMMON_TOKENS: { [key: string]: Token } = {
  ETH: {
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
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
}

export const getTokenByAddress = (address: string): Token | undefined => {
  return Object.values(COMMON_TOKENS).find(
    token => token.address.toLowerCase() === address.toLowerCase()
  )
}

export const getTokenBySymbol = (symbol: string): Token | undefined => {
  return COMMON_TOKENS[symbol.toUpperCase()]
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
