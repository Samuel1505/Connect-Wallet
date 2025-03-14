import { useEffect, useState } from 'react'
import './WalletConnect.css' 
import { useAccount, useConnectors, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { mainnet, sepolia, lisk, liskSepolia, base, polygon } from 'wagmi/chains'
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
    <div className="wallet-container">
      {!connector ? (
        <div>
          {!connectClick ? (
            <button 
              onClick={handleConnectWallet}
              className="connect-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
             CONNECT WALLET
            </button>
          ) : (
            <div className="wallet-selection">
              <h3>SELECT A WALLET TO CONNECT</h3>
              <div className="wallet-options">
                {connectors.map((connector) => (
                  <button 
                    key={connector.id} 
                    onClick={() => handleConnector(connector)}
                    className="wallet-option-button"
                  >
                    {connector.name}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setConnectClick(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="connected-section">
          <div className="wallet-info">
            <div className="wallet-header">
              <h3>Wallet Connected</h3>
              <span className="status-badge">
                Active
              </span>
            </div>
            
            <div className="wallet-details">
              <div className="detail-row">
                <span className="detail-label">Address:</span>
                <span className="detail-value address-value">
                  {accounts.address}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Network:</span>
                <span className="detail-value">
                  {accounts.chain.name}
                </span>
              </div>
            </div>
          </div>
          
          <div className="actions-row">
            <select 
              value={accounts.chain.id} 
              onChange={(e) => handleSwitchChain(e.target.value)}
              className="chain-select"
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
              className="disconnect-button"
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
    <div className="app-container">
      <WalletConnect />
    </div>
  )
}

export default App