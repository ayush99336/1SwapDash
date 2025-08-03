import { useState, useEffect } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { getBalances, getTokens, type TokenBalance } from '../utils/api'
import { formatUnits } from 'viem'
import { COMMON_TOKENS } from '../utils/tokens'

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
      // Get balance data (just amounts) and token metadata
      const [balanceData, tokenData] = await Promise.all([
        getBalances(address),
        getTokens()
      ])
      
      console.log('Raw balance data:', balanceData) // Debug log
      console.log('Token data:', tokenData) // Debug log
      
      const formattedBalances: ExtendedTokenBalance[] = []
      
      // Process each token balance
      for (const [tokenAddress, balance] of Object.entries(balanceData)) {
        if (BigInt(balance) > 0n) {
          // Find token metadata from API or fallback to common tokens
          let tokenInfo = tokenData.tokens[tokenAddress.toLowerCase()]
          
          if (!tokenInfo) {
            // Try to find in common tokens
            tokenInfo = Object.values(COMMON_TOKENS).find((t: any) => 
              t.address.toLowerCase() === tokenAddress.toLowerCase()
            )
          }
          
          if (tokenInfo) {
            const formattedBalance = formatUnits(BigInt(balance), tokenInfo.decimals)
            
            const tokenBalance: ExtendedTokenBalance = {
              token_address: tokenAddress,
              symbol: tokenInfo.symbol,
              name: tokenInfo.name,
              logo: tokenInfo.logoURI,
              thumbnail: tokenInfo.logoURI,
              decimals: tokenInfo.decimals,
              balance: balance,
              possible_spam: false, // Assume not spam if we have metadata
              verified_contract: true, // Assume verified if we have metadata
              formattedBalance
            }
            
            formattedBalances.push(tokenBalance)
            console.log(`Token ${tokenInfo.symbol}: balance=${balance}, formatted=${formattedBalance}`)
          } else {
            console.log(`No metadata found for token ${tokenAddress}`)
          }
        }
      }
      
      // Sort by USD value if available, otherwise by balance
      formattedBalances.sort((a, b) => (b.usd_value || 0) - (a.usd_value || 0))

      console.log('Filtered balances:', formattedBalances) // Debug log
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
