import { useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { getSwap, type SwapParams } from '../utils/api'
import { parseTokenAmount } from '../utils/tokens'

export interface SwapTransaction {
  hash: string
  from: string
  to: string
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
  timestamp: number
  status: 'pending' | 'success' | 'failed'
}

export const useSwap = () => {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeSwap = async (
    fromToken: string,
    toToken: string,
    amount: string,
    fromDecimals: number,
    slippage: number = 1
  ): Promise<SwapTransaction | null> => {
    if (!address || !walletClient) {
      throw new Error('Wallet not connected')
    }

    setLoading(true)
    setError(null)

    try {
      const parsedAmount = parseTokenAmount(amount, fromDecimals)
      
      const swapParams: SwapParams = {
        fromTokenAddress: fromToken,
        toTokenAddress: toToken,
        amount: parsedAmount,
        fromAddress: address,
        slippage,
        disableEstimate: false,
        allowPartialFill: false,
      }

      // Get swap transaction data
      const swapData = await getSwap(swapParams)
      
      // Execute the transaction
      const txHash = await walletClient.sendTransaction({
        to: swapData.tx.to as `0x${string}`,
        data: swapData.tx.data as `0x${string}`,
        value: BigInt(swapData.tx.value),
        gas: BigInt(swapData.tx.gas),
        gasPrice: BigInt(swapData.tx.gasPrice),
      })

      const transaction: SwapTransaction = {
        hash: txHash,
        from: fromToken,
        to: toToken,
        fromToken: swapData.fromToken.symbol,
        toToken: swapData.toToken.symbol,
        fromAmount: amount,
        toAmount: parseFloat(swapData.toTokenAmount) / (10 ** swapData.toToken.decimals) + '',
        timestamp: Date.now(),
        status: 'pending'
      }

      return transaction
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Swap failed'
      setError(errorMessage)
      console.error('Error executing swap:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    executeSwap,
    loading,
    error
  }
}
