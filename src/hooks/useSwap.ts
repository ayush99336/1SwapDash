import { useState } from 'react'
import { useAccount, useWalletClient, useChainId } from 'wagmi'
import { getSwap, getQuote, getAllowance, getApprovalTransaction, type SwapRequest, type QuoteRequest } from '../utils/api'
import { parseTokenAmount, formatTokenAmount } from '../utils/tokens'

export interface SwapQuote {
  srcToken: {
    symbol: string
    name: string
    decimals: number
    address: string
    logoURI?: string
  }
  dstToken: {
    symbol: string
    name: string
    decimals: number
    address: string
    logoURI?: string
  }
  fromAmount: string
  dstAmount: string
  formattedFromAmount: string
  formattedDstAmount: string
  protocols?: any[]
  gas?: string
}

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
  const chainId = useChainId()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getSwapQuote = async (
    srcToken: string,
    dstToken: string,
    amount: string,
    fromDecimals: number
  ): Promise<SwapQuote | null> => {
    if (!chainId) {
      throw new Error('Chain not connected')
    }

    setLoading(true)
    setError(null)

    try {
      const parsedAmount = parseTokenAmount(amount, fromDecimals)
      
      const quoteParams: QuoteRequest = {
        src: srcToken,
        dst: dstToken,
        amount: parsedAmount,
        includeTokensInfo: true,
        includeProtocols: true,
        includeGas: true
      }

      const quoteData = await getQuote(quoteParams, chainId)
      
      const quote: SwapQuote = {
        srcToken: quoteData.srcToken,
        dstToken: quoteData.dstToken,
        fromAmount: quoteData.fromAmount,
        dstAmount: quoteData.dstAmount,
        formattedFromAmount: formatTokenAmount(quoteData.fromAmount, quoteData.srcToken.decimals),
        formattedDstAmount: formatTokenAmount(quoteData.dstAmount, quoteData.dstToken.decimals),
        protocols: quoteData.protocols,
        gas: quoteData.gas
      }

      return quote
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get quote'
      setError(errorMessage)
      console.error('Error getting quote:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const checkAllowance = async (
    tokenAddress: string,
    walletAddress: string
  ): Promise<string> => {
    if (!chainId) {
      throw new Error('Chain not connected')
    }

    try {
      const allowanceData = await getAllowance(tokenAddress, walletAddress, chainId)
      return allowanceData.allowance
    } catch (err) {
      console.error('Error checking allowance:', err)
      throw err
    }
  }

  const approveToken = async (
    tokenAddress: string,
    amount: string
  ): Promise<string> => {
    if (!walletClient || !chainId) {
      throw new Error('Wallet not connected')
    }

    try {
      const approvalData = await getApprovalTransaction(tokenAddress, amount, chainId)
      
      const txHash = await walletClient.sendTransaction({
        to: approvalData.to as `0x${string}`,
        data: approvalData.data as `0x${string}`,
        value: BigInt(approvalData.value),
        gas: approvalData.gas ? BigInt(approvalData.gas) : undefined,
      })

      return txHash
    } catch (err) {
      console.error('Error approving token:', err)
      throw err
    }
  }

  const executeSwap = async (
    srcToken: string,
    dstToken: string,
    amount: string,
    fromDecimals: number,
    slippage: number = 1
  ): Promise<SwapTransaction | null> => {
    if (!address || !walletClient || !chainId) {
      throw new Error('Wallet not connected')
    }

    setLoading(true)
    setError(null)

    try {
      const parsedAmount = parseTokenAmount(amount, fromDecimals)
      
      const swapParams: SwapRequest = {
        src: srcToken,
        dst: dstToken,
        amount: parsedAmount,
        from: address,
        origin: address, // Required for compliance
        slippage,
        disableEstimate: false,
        allowPartialFill: false,
        includeTokensInfo: true,
        includeProtocols: true
      }

      // Get swap transaction data
      const swapData = await getSwap(swapParams, chainId)
      
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
        from: srcToken,
        to: dstToken,
        fromToken: swapData.srcToken.symbol,
        toToken: swapData.dstToken.symbol,
        fromAmount: amount,
        toAmount: formatTokenAmount(swapData.dstAmount, swapData.dstToken.decimals),
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
    getSwapQuote,
    checkAllowance,
    approveToken,
    executeSwap,
    loading,
    error,
    chainId
  }
}
