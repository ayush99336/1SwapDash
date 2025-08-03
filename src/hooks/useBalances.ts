import { useState, useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
// import { getBalances, type TokenBalance } from '../utils/api' // Disabled due to CORS
// import { formatUnits } from 'viem' // Disabled due to CORS
import { type TokenBalance } from '../utils/api'

export interface ExtendedTokenBalance extends TokenBalance {
  formattedBalance: string
}

export const useBalances = () => {
  const { address, isConnected } = useAccount()
  const [tokenBalances, setTokenBalances] = useState<ExtendedTokenBalance[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get ETH balance using wagmi
  const { data: ethBalance } = useBalance({
    address: address,
  })

  const fetchBalances = async () => {
    if (!address || !isConnected) return

    setLoading(true)
    setError(null)

    try {
      // Temporarily disable API call due to CORS issues
      // const balanceData = await getBalances(address)
      
      // Mock some sample data for now
      const mockBalances = [
        {
          token_address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          symbol: 'USDT',
          name: 'Tether USD',
          decimals: 6,
          balance: '1000000000', // 1000 USDT
          possible_spam: false,
          verified_contract: true,
          usd_value: 1000,
          formattedBalance: '1000.0'
        },
        {
          token_address: '0xa0b86a33e6b8c6bb1c59fd5edb1e8df2da13afae',
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          balance: '500000000', // 500 USDC
          possible_spam: false,
          verified_contract: true,
          usd_value: 500,
          formattedBalance: '500.0'
        }
      ]
      
      setTokenBalances(mockBalances)
      
      /* Original code - enable when CORS is fixed
      const formattedBalances: ExtendedTokenBalance[] = Object.values(balanceData)
        .filter(token => !token.possible_spam && token.verified_contract)
        .map(token => ({
          ...token,
          formattedBalance: formatUnits(BigInt(token.balance), token.decimals)
        }))
        .sort((a, b) => (b.usd_value || 0) - (a.usd_value || 0))

      setTokenBalances(formattedBalances)
      */
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balances')
      console.error('Error fetching token balances:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBalances()
  }, [address, isConnected])

  const refetch = () => {
    fetchBalances()
  }

  return {
    ethBalance,
    tokenBalances,
    loading,
    error,
    refetch
  }
}
