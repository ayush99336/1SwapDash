import React, { useState, useEffect } from 'react'
import { COMMON_TOKENS, type Token } from '../utils/tokens'
import { getTokens } from '../utils/api'

interface TokenSelectorProps {
  selectedToken?: Token
  onSelect: (token: Token) => void
  label: string
  excludeToken?: string
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onSelect,
  label,
  excludeToken
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [allTokens, setAllTokens] = useState<Token[]>(Object.values(COMMON_TOKENS))

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const tokens = await getTokens()
        console.log('Fetched tokens from API:', Object.keys(tokens).length) // Debug log
        
        const tokenList = Object.values(tokens).map((token: any) => ({
          address: token.address,
          symbol: token.symbol,
          name: token.name,
          decimals: token.decimals,
          logoURI: token.logoURI
        }))
        
        // Deduplicate by address to avoid duplicate keys
        const commonTokenAddresses = new Set(Object.values(COMMON_TOKENS).map(t => t.address.toLowerCase()))
        const uniqueTokens = tokenList.filter(token => 
          !commonTokenAddresses.has(token.address.toLowerCase())
        )
        
        console.log('Total tokens available:', Object.values(COMMON_TOKENS).length + uniqueTokens.length)
        setAllTokens([...Object.values(COMMON_TOKENS), ...uniqueTokens])
      } catch (error) {
        console.error('Failed to fetch tokens:', error)
        // Fallback to common tokens
        setAllTokens(Object.values(COMMON_TOKENS))
      }
    }
    
    fetchTokens()
  }, [])

  const filteredTokens = allTokens.filter(token => {
    const matchesSearch = token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.name.toLowerCase().includes(searchTerm.toLowerCase())
    const notExcluded = !excludeToken || token.address.toLowerCase() !== excludeToken.toLowerCase()
    return matchesSearch && notExcluded
  })

  const handleSelect = (token: Token) => {
    onSelect(token)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border border-gray-300 rounded-lg bg-white flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selectedToken ? (
          <div className="flex items-center gap-2">
            <img 
              src={selectedToken.logoURI || '/placeholder-token.png'} 
              alt={selectedToken.symbol}
              className="w-6 h-6 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-token.png'
              }}
            />
            <span className="font-medium">{selectedToken.symbol}</span>
            <span className="text-gray-500 text-sm">{selectedToken.name}</span>
          </div>
        ) : (
          <span className="text-gray-500">Select a token</span>
        )}
        
        <svg 
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
          <div className="p-3 border-b">
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {filteredTokens.length > 0 ? (
              filteredTokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => handleSelect(token)}
                  className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                >
                  <img 
                    src={token.logoURI || '/placeholder-token.png'} 
                    alt={token.symbol}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-token.png'
                    }}
                  />
                  <div>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-gray-500">{token.name}</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500">
                No tokens found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
