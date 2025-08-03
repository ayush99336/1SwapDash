import { useState, useEffect } from 'react'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { getBalances, getTokens, type TokenInfo } from '../utils/api'
import { formatUnits } from 'viem'
import { getCommonTokensForChain, type Token } from '../utils/tokens'

export interface ExtendedTokenBalance {
  token_address: string
  symbol: string
  name: string
  logo?: string
  thumbnail?: string
  decimals: number
  balance: string
  possible_spam: boolean
  verified_contract: boolean
  usd_price?: number
  usd_value?: number
  formattedBalance: string
}

export const useBalances = () => {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [tokenBalances, setTokenBalances] = useState<ExtendedTokenBalance[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get native token balance using wagmi
  const { data: nativeBalance } = useBalance({
    address: address,
  })

  const fetchBalances = async () => {
    if (!address || !isConnected || !chainId) return

    setLoading(true)
    setError(null)

    try {
      // Get balance data (just amounts) and token metadata for current chain
      const [balanceData, tokenData] = await Promise.all([
        getBalances(address, chainId),
        getTokens(chainId)
      ])
      
      console.log('Raw balance data:', balanceData) // Debug log
      console.log('Token data:', tokenData) // Debug log
      
      const formattedBalances: ExtendedTokenBalance[] = []
      const commonTokens = getCommonTokensForChain(chainId)
      
      // Process each token balance
      for (const [tokenAddress, balance] of Object.entries(balanceData)) {
        if (BigInt(balance) > 0n) {
          // Find token metadata from API or fallback to common tokens
          let tokenInfo: TokenInfo | Token | undefined = tokenData.tokens?.[tokenAddress.toLowerCase()]
          
          if (!tokenInfo) {
            // Try to find in common tokens for this chain
            tokenInfo = Object.values(commonTokens).find((t: Token) => 
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
  }, [address, isConnected, chainId])

  const refetch = () => {
    fetchBalances()
  }

  return {
    nativeBalance,
    tokenBalances,
    loading,
    error,
    refetch,
    chainId
  }
}
