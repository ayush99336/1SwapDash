import { useState } from 'react'
import { useAccount } from 'wagmi'
import { WalletConnector } from './components/WalletConnector'
import { NetworkStatus } from './components/NetworkStatus'
import { BalanceList } from './components/BalanceList'
import { SwapForm } from './components/SwapForm'
import { SwapHistory } from './components/SwapHistory'
import { AdvancedDashboard } from './components/AdvancedDashboard'
import { FusionTrading } from './components/FusionTrading'
import { MarketAnalytics } from './components/MarketAnalytics'
import { type SwapTransaction } from './hooks/useSwap'

type TabType = 'swap' | 'portfolio' | 'fusion' | 'analytics'

function App() {
  const { isConnected } = useAccount()
  const [latestTransaction, setLatestTransaction] = useState<SwapTransaction | undefined>()
  const [activeTab, setActiveTab] = useState<TabType>('swap')

  const handleSwapComplete = (transaction: SwapTransaction) => {
    setLatestTransaction(transaction)
  }

  const tabs = [
    { id: 'swap' as const, label: 'Swap', icon: '🔄' },
    { id: 'portfolio' as const, label: 'Portfolio', icon: '💼' },
    { id: 'fusion' as const, label: 'Fusion', icon: '⚡' },
    { id: 'analytics' as const, label: 'Analytics', icon: '📊' }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'swap':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Balances */}
            <div className="lg:col-span-1">
              <BalanceList />
            </div>

            {/* Middle Column - Swap Form */}
            <div className="lg:col-span-1">
              <SwapForm onSwapComplete={handleSwapComplete} />
            </div>

            {/* Right Column - History */}
            <div className="lg:col-span-1">
              <SwapHistory newTransaction={latestTransaction} />
            </div>
          </div>
        )
      case 'portfolio':
        return <AdvancedDashboard />
      case 'fusion':
        return <FusionTrading />
      case 'analytics':
        return <MarketAnalytics />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700">MySwap Dashboard</h1>
            <p className="text-gray-600 mt-1">Best-rate swaps powered by 1inch</p>
          </div>
          <WalletConnector />
        </header>

        {!isConnected ? (
          /* Welcome Screen */
          <div className="text-center py-20">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Welcome to MySwap Dashboard
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Connect your wallet to start swapping tokens at the best rates. 
                View your balances, get real-time quotes, and execute swaps seamlessly.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-blue-600 text-4xl mb-4">💰</div>
                  <h3 className="text-lg font-semibold mb-2">View Balances</h3>
                  <p className="text-gray-600">See all your ETH and ERC-20 token balances in one place</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-green-600 text-4xl mb-4">🔄</div>
                  <h3 className="text-lg font-semibold mb-2">Best Rate Swaps</h3>
                  <p className="text-gray-600">Get the best exchange rates powered by 1inch aggregation</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-purple-600 text-4xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold mb-2">Track History</h3>
                  <p className="text-gray-600">Monitor your swap history and transaction status</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Main Dashboard */
          <div>
            {/* Network Status Warning */}
            <NetworkStatus />
            
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600">
          <p>
            Built with{' '}
            <a href="https://wagmi.sh" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              wagmi
            </a>
            {' + '}
            <a href="https://rainbowkit.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
              RainbowKit
            </a>
            {' + '}
            <a href="https://1inch.io" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
              1inch API
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
