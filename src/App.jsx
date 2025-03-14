import { useEffect, useState } from 'react'
import './App.css'
import { useAccount, useConnectors, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { mainnet, sepolia, lisk, liskSepolia, base, polygon } from 'wagmi/chains'
import { createStorage } from 'wagmi'
import { reconnect } from '@wagmi/core'
import { config } from './config/wagmi.config.js'

const WalletConnect = () => {
  const accounts = useAccount()
  const connectors = useConnectors()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain() 
  const [connectClick, setConnectClick] = useState(false)
  const [connector, setConnector] = useState(null)

  const supportedChains = [mainnet, sepolia, lisk, liskSepolia, base, polygon]

  useEffect(() => {
    if(!connectors) return

    if(accounts.address === undefined) return
    setConnector(accounts.connector)
    setConnectClick(false)
  }, [accounts.connector])

  const handleConnectWallet = () => {
    setConnectClick(true)
  }

  const handleConnector = (_connector) => {
    connect({connector:_connector})
  }

  const handleDisconnect = () => {
    if(connector){
      disconnect()
      setConnector(null)
      setConnectClick(false)
    }
  }

  const handleSwitchChain = async (id) => {
    console.log("chainID",id)
    await switchChain({chainId:Number(id)})
  }

  console.log("ACCOUNTS: ", accounts);
  console.log("CONNECTORS", connectors);
  
  return (
    <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-xl shadow-md">
      {!connector ? (
        <div className="flex flex-col items-center">
          {!connectClick ? (
            <button 
              onClick={handleConnectWallet}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Connect Wallet
            </button>
          ) : (
            <div className="w-full space-y-3">
              <h3 className="text-lg font-medium text-gray-700 mb-4">PICK A WALLET TO CONNECT</h3>
              <div className="grid grid-cols-2 gap-3">
                {connectors.map((connector) => (
                  <button 
                    key={connector.id} 
                    onClick={() => handleConnector(connector)}
                    className="py-3 px-4 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    {connector.name}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setConnectClick(false)}
                className="w-full py-2 px-4 mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-800">Wallet Connected</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Address:</span>
                <span className="font-mono text-gray-800 truncate max-w-xs">
                  {accounts.address}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Network:</span>
                <span className="font-medium text-gray-800">
                  {accounts.chain.name}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={accounts.chain.id} 
              onChange={(e) => handleSwitchChain(e.target.value)}
              className="flex-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {supportedChains ? 
                supportedChains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name}
                  </option>
                )) : 
                <option>No Chains</option>
              }
            </select>
            
            <button 
              onClick={handleDisconnect}
              className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <WalletConnect />
    </div>
  )
}

export default App