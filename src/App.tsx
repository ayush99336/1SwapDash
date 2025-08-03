import { useState } from 'react'
import { useAccount } from 'wagmi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExchangeAlt, faWallet, faChartBar, faBolt } from '@fortawesome/free-solid-svg-icons'
import { WalletConnector } from './components/WalletConnector'
import { NetworkStatus } from './components/NetworkStatus'
import { BalanceList } from './components/BalanceList'
import { SwapForm } from './components/SwapForm'
import { SwapHistory } from './components/SwapHistory'
import { AdvancedDashboard } from './components/AdvancedDashboard'
import { FusionTrading } from './components/FusionTrading'
import { MarketAnalytics } from './components/MarketAnalytics'
import { PriceTracker } from './components/PriceTracker'
import { NetworkStats } from './components/NetworkStats'
import { Card } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { type SwapTransaction } from './hooks/useSwap'

type TabType = 'swap' | 'portfolio' | 'fusion' | 'analytics'

function App() {
  const { isConnected } = useAccount()
  const [latestTransaction, setLatestTransaction] = useState<SwapTransaction | undefined>()
  const [activeTab, setActiveTab] = useState<TabType>('swap')

  const handleSwapComplete = (transaction: SwapTransaction) => {
    setLatestTransaction(transaction)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DeFi Swap Dashboard
              </h1>
              <Badge variant="secondary" className="ml-3">
                Multi-Chain
              </Badge>
            </div>
            <WalletConnector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!isConnected ? (
          /* Welcome Screen */
          <div className="text-center py-20">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="text-6xl mb-4 text-blue-500">
                  <FontAwesomeIcon icon={faExchangeAlt} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Welcome to 1SWAPDASH
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  The Ultimate DeFi Dashboard powered by 1inch APIs - Connect your wallet to start trading across multiple chains with real-time data
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                <Card className="text-center p-6">
                  <div className="text-3xl mb-3 text-green-500">
                    <FontAwesomeIcon icon={faWallet} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Real Balances</h3>
                  <p className="text-sm text-gray-600">View your token balances across all supported networks</p>
                </Card>
                <Card className="text-center p-6">
                  <div className="text-3xl mb-3 text-blue-500">
                    <FontAwesomeIcon icon={faExchangeAlt} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Instant Swaps</h3>
                  <p className="text-sm text-gray-600">Swap tokens with the best rates from 1inch</p>
                </Card>
                <Card className="text-center p-6">
                  <div className="text-3xl mb-3 text-purple-500">
                    <FontAwesomeIcon icon={faChartBar} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Portfolio Analytics</h3>
                  <p className="text-sm text-gray-600">Track your portfolio performance and analytics</p>
                </Card>
                <Card className="text-center p-6">
                  <div className="text-3xl mb-3">�</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Swap History</h3>
                  <p className="text-sm text-gray-600">Monitor your swap history and transaction status</p>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          /* Main Dashboard */
          <div className="space-y-6">
            {/* Network Status Warning */}
            <NetworkStatus />
            
            {/* Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="swap" className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faExchangeAlt} className="w-4 h-4" />
                  Swap
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faWallet} className="w-4 h-4" />
                  Portfolio
                </TabsTrigger>
                <TabsTrigger value="fusion" className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBolt} className="w-4 h-4" />
                  Fusion
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faChartBar} className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="swap" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <BalanceList />
                  <SwapForm onSwapComplete={handleSwapComplete} />
                </div>
                <SwapHistory newTransaction={latestTransaction} />
              </TabsContent>

              <TabsContent value="portfolio" className="mt-6">
                <AdvancedDashboard />
              </TabsContent>

              <TabsContent value="fusion" className="mt-6">
                <FusionTrading />
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <div className="space-y-6">
                  <MarketAnalytics />
                  
                  {/* Real-time Price Tracking */}
                  <PriceTracker />
                  
                  {/* Network Statistics */}
                  <NetworkStats />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              Built with{' '}
              <a href="https://wagmi.sh" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                wagmi
              </a>
              {' + '}
              <a href="https://rainbowkit.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-medium">
                RainbowKit
              </a>
              {' + '}
              <a href="https://1inch.io" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">
                1inch API
              </a>
            </p>
            <p className="text-sm text-gray-500">
              Powered by shadcn/ui components for a modern experience
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
