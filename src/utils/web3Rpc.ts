import axios from 'axios';
import { web3RpcLimiter } from './rateLimiter';

const api = axios.create({
  baseURL: '/api/web3',
  headers: {
    'Content-Type': 'application/json'
  }
});

export type NodeType = 'full' | 'archive';

// Helper function to make RPC calls with optional node type and rate limiting
const makeRpcCall = async (
  chainId: number, 
  method: string, 
  params: any[] = [], 
  nodeType?: NodeType,
  id: number | string = 1
) => {
  return web3RpcLimiter.execute(async () => {
    const endpoint = nodeType ? `/${chainId}/${nodeType}` : `/${chainId}`;
    
    const response = await api.post(endpoint, {
      jsonrpc: "2.0",
      method,
      params,
      id
    });
    
    return response.data;
  });
};

// Web3 RPC API - Get latest block information
export const getLatestBlock = async (chainId: number, nodeType?: NodeType) => {
  try {
    const response = await makeRpcCall(chainId, "eth_getBlockByNumber", ["latest", false], nodeType);
    return response.result;
  } catch (error) {
    console.error('Error fetching latest block:', error);
    throw error;
  }
};

// Get current block number
export const getBlockNumber = async (chainId: number, nodeType?: NodeType): Promise<number> => {
  try {
    const response = await makeRpcCall(chainId, "eth_blockNumber", [], nodeType);
    return parseInt(response.result, 16);
  } catch (error) {
    console.error('Error fetching block number:', error);
    throw error;
  }
};

// Get block by number
export const getBlockByNumber = async (chainId: number, blockNumber: string | number, includeTransactions: boolean = true, nodeType?: NodeType) => {
  try {
    const blockParam = typeof blockNumber === 'number' 
      ? `0x${blockNumber.toString(16)}` 
      : blockNumber;
      
    const response = await makeRpcCall(chainId, "eth_getBlockByNumber", [blockParam, includeTransactions], nodeType);
    return response.result;
  } catch (error) {
    console.error('Error fetching block by number:', error);
    throw error;
  }
};

// Get transaction by hash
export const getTransactionByHash = async (chainId: number, txHash: string, nodeType?: NodeType) => {
  try {
    const response = await makeRpcCall(chainId, "eth_getTransactionByHash", [txHash], nodeType);
    return response.result;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
};

// Get transaction receipt
export const getTransactionReceipt = async (chainId: number, txHash: string, nodeType?: NodeType) => {
  try {
    const response = await makeRpcCall(chainId, "eth_getTransactionReceipt", [txHash], nodeType);
    return response.result;
  } catch (error) {
    console.error('Error fetching transaction receipt:', error);
    throw error;
  }
};

// Get current gas price
export const getGasPrice = async (chainId: number, nodeType?: NodeType): Promise<number> => {
  try {
    const response = await makeRpcCall(chainId, "eth_gasPrice", [], nodeType);
    return parseInt(response.result, 16);
  } catch (error) {
    console.error('Error fetching gas price:', error);
    throw error;
  }
};

// Get account balance
export const getBalance = async (chainId: number, address: string, blockTag: string = 'latest', nodeType?: NodeType) => {
  try {
    const response = await makeRpcCall(chainId, "eth_getBalance", [address, blockTag], nodeType);
    return response.result;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
};

// Get transaction count (nonce)
export const getTransactionCount = async (chainId: number, address: string, blockTag: string = 'latest', nodeType?: NodeType) => {
  try {
    const response = await makeRpcCall(chainId, "eth_getTransactionCount", [address, blockTag], nodeType);
    return parseInt(response.result, 16);
  } catch (error) {
    console.error('Error fetching transaction count:', error);
    throw error;
  }
};

// Estimate gas for a transaction
export const estimateGas = async (chainId: number, transactionObject: any, nodeType?: NodeType) => {
  try {
    const response = await makeRpcCall(chainId, "eth_estimateGas", [transactionObject], nodeType);
    return parseInt(response.result, 16);
  } catch (error) {
    console.error('Error estimating gas:', error);
    throw error;
  }
};

// Get network chain ID
export const getChainId = async (chainId: number, nodeType?: NodeType) => {
  try {
    const response = await makeRpcCall(chainId, "eth_chainId", [], nodeType);
    return parseInt(response.result, 16);
  } catch (error) {
    console.error('Error fetching chain ID:', error);
    throw error;
  }
};

// Get network information
export const getNetworkInfo = async (chainId: number, nodeType?: NodeType) => {
  try {
    const [latestBlock, gasPrice, blockNumber] = await Promise.all([
      getLatestBlock(chainId, nodeType),
      getGasPrice(chainId, nodeType),
      getBlockNumber(chainId, nodeType)
    ]);
    
    return {
      chainId,
      blockNumber,
      latestBlock: latestBlock ? {
        number: parseInt(latestBlock.number, 16),
        hash: latestBlock.hash,
        timestamp: parseInt(latestBlock.timestamp, 16),
        gasLimit: parseInt(latestBlock.gasLimit, 16),
        gasUsed: parseInt(latestBlock.gasUsed, 16),
        transactionCount: latestBlock.transactions ? latestBlock.transactions.length : 0
      } : null,
      gasPrice: {
        wei: gasPrice,
        gwei: Math.round(gasPrice / 1e9 * 100) / 100,
        eth: gasPrice / 1e18
      },
      nodeType: nodeType || 'full'
    };
  } catch (error) {
    console.error('Error fetching network info:', error);
    throw error;
  }
};

// Format wei to human readable units
export const formatWei = (wei: string | number, unit: 'wei' | 'gwei' | 'eth' = 'eth'): number => {
  const weiNum = typeof wei === 'string' ? parseInt(wei, 16) : wei;
  
  switch (unit) {
    case 'wei':
      return weiNum;
    case 'gwei':
      return weiNum / 1e9;
    case 'eth':
      return weiNum / 1e18;
    default:
      return weiNum;
  }
};

// Convert human readable units to wei
export const toWei = (amount: number, unit: 'gwei' | 'eth' = 'eth'): string => {
  switch (unit) {
    case 'gwei':
      return `0x${Math.round(amount * 1e9).toString(16)}`;
    case 'eth':
      return `0x${Math.round(amount * 1e18).toString(16)}`;
    default:
      return `0x${amount.toString(16)}`;
  }
};

// Check if transaction is pending
export const isTransactionPending = async (chainId: number, txHash: string, nodeType?: NodeType): Promise<boolean> => {
  try {
    const receipt = await getTransactionReceipt(chainId, txHash, nodeType);
    return receipt === null; // null means pending
  } catch (error) {
    console.error('Error checking transaction status:', error);
    return false;
  }
};

// Get code at address (useful for contract verification)
export const getCode = async (chainId: number, address: string, blockTag: string = 'latest', nodeType?: NodeType) => {
  try {
    const response = await makeRpcCall(chainId, "eth_getCode", [address, blockTag], nodeType);
    return response.result;
  } catch (error) {
    console.error('Error fetching code:', error);
    throw error;
  }
};

// Get storage at specific position (archive node required for historical data)
export const getStorageAt = async (chainId: number, address: string, position: string, blockTag: string = 'latest', nodeType: NodeType = 'archive') => {
  try {
    const response = await makeRpcCall(chainId, "eth_getStorageAt", [address, position, blockTag], nodeType);
    return response.result;
  } catch (error) {
    console.error('Error fetching storage:', error);
    throw error;
  }
};

// Call a contract method (read-only)
export const call = async (chainId: number, callObject: any, blockTag: string = 'latest', nodeType?: NodeType) => {
  try {
    const response = await makeRpcCall(chainId, "eth_call", [callObject, blockTag], nodeType);
    return response.result;
  } catch (error) {
    console.error('Error calling contract:', error);
    throw error;
  }
};
