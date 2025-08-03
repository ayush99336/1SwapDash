import { useState, useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { getBalances, type TokenBalance } from '../utils/api'
import { formatUnits } from 'viem'

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
      const balanceData = await getBalances(address)
      
      const formattedBalances: ExtendedTokenBalance[] = Object.values(balanceData)
        .filter(token => !token.possible_spam && token.verified_contract)
        .map(token => ({
          ...token,
          formattedBalance: formatUnits(BigInt(token.balance), token.decimals)
        }))
        .sort((a, b) => (b.usd_value || 0) - (a.usd_value || 0))

      setTokenBalances(formattedBalances)
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
