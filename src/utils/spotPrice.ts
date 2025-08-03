import axios from 'axios';
import { apiLimiter } from './rateLimiter';

const api = axios.create({
  baseURL: '/api/1inch',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Get current token prices using 1inch Spot Price API v1.1 (POST method)
export const getSpotPrices = async (
  chainId: number,
  tokenAddresses: string[],
  currency: string = 'USD'
): Promise<{ [address: string]: number }> => {
  try {
    const response = await apiLimiter.execute(() => 
      api.post(`/price/v1.1/${chainId}`, {
        tokens: tokenAddresses,
        currency: currency
      })
    );
    
    // Convert string prices to numbers
    const prices: { [address: string]: number } = {};
    for (const [address, priceStr] of Object.entries(response.data)) {
      prices[address] = parseFloat(priceStr as string);
    }
    
    return prices;
  } catch (error) {
    console.error('Error fetching spot prices:', error);
    return {};
  }
};

// Get current token prices using GET method (alternative)
export const getSpotPricesGET = async (
  chainId: number,
  tokenAddresses: string[],
  currency: string = 'usd'
): Promise<{ [address: string]: number }> => {
  try {
    const addressesParam = tokenAddresses.join(',');
    const response = await api.get(`/price/v1.1/${chainId}/${addressesParam}`, {
      params: currency ? { currency } : {}
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching spot prices (GET):', error);
    return {};
  }
};

// Get price for a single token
export const getSingleTokenPrice = async (
  chainId: number,
  tokenAddress: string,
  currency: string = 'USD'
): Promise<number> => {
  try {
    const prices = await getSpotPrices(chainId, [tokenAddress], currency);
    return prices[tokenAddress] || 0;
  } catch (error) {
    console.error('Error fetching single token price:', error);
    return 0;
  }
};

// Get prices for multiple tokens with currency conversion
export const getTokenPricesWithCurrency = async (
  chainId: number,
  tokenAddresses: string[],
  currencies: string[] = ['USD']
): Promise<{ [currency: string]: { [address: string]: number } }> => {
  try {
    const results: { [currency: string]: { [address: string]: number } } = {};
    
    for (const currency of currencies) {
      results[currency] = await getSpotPrices(chainId, tokenAddresses, currency);
    }
    
    return results;
  } catch (error) {
    console.error('Error fetching multi-currency prices:', error);
    return {};
  }
};

// Calculate price change percentage (requires historical data)
export const calculatePriceChange = (currentPrice: number, previousPrice: number): number => {
  if (previousPrice === 0) return 0;
  return ((currentPrice - previousPrice) / previousPrice) * 100;
};

// Format price with appropriate decimal places
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  } else {
    return price.toFixed(6);
  }
};

// Get popular token addresses for quick price checking
export const getPopularTokens = (chainId: number): string[] => {
  const tokenMap: { [key: number]: string[] } = {
    1: [ // Ethereum - Using addresses that work with 1inch API
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // ETH
      '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
      '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
      '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
      '0xa0b86a33e6b8c6bb1c59fd5edb1e8df2da13afae', // USDC (trying alternative)
    ],
    56: [ // BSC
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // BNB
      '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USDC
      '0x55d398326f99059ff775485246999027b3197955', // USDT
      '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c', // BTCB
    ],
    137: [ // Polygon
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // MATIC
      '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
      '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // USDT
      '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6', // WBTC
    ]
  };
  
  return tokenMap[chainId] || [];
};

// Get token symbol from address
export const getTokenSymbol = (address: string, chainId: number): string => {
  const symbolMap: { [chainId: number]: { [address: string]: string } } = {
    1: {
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'ETH',
      '0xdac17f958d2ee523a2206206994597c13d831ec7': 'USDT',
      '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'WBTC',
      '0x6b175474e89094c44da98b954eedeac495271d0f': 'DAI',
      '0xa0b86a33e6b8c6bb1c59fd5edb1e8df2da13afae': 'USDC', // Match the working address
    },
    56: {
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'BNB',
      '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d': 'USDC',
      '0x55d398326f99059ff775485246999027b3197955': 'USDT',
      '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c': 'BTCB',
    },
    137: {
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'MATIC',
      '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': 'USDC',
      '0xc2132d05d31c914a87c6611c10748aeb04b58e8f': 'USDT',
      '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6': 'WBTC',
    }
  };
  
  return symbolMap[chainId]?.[address.toLowerCase()] || `${address.slice(0, 6)}...`;
};
