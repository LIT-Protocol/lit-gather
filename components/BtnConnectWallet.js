import React, { useEffect, useState } from 'react';
import Btn from './Ui/Btn';
import { shortenWalletAddress } from '../utils/helper'
import { removeStoredAuth, removeStoredNetwork, storedAuth } from '../utils/storage';

function BtnConnectWallet() {

  // state
  const [walletAddress, setWalletAddress] = useState('');

  // -- mounted
  useEffect(() => {
      console.log("--- Mounted BtnConnectWallet ---");

      // -- listen to metamask account changed
      window.ethereum.on('accountsChanged', function (accounts) {
          // Time to reload your interface with accounts[0]!
          console.log('accountsChanged')
          removeStoredAuth()
          removeStoredNetwork();
          document.getElementById('connect-wallet').click()
      })

      // -- listen to metamask network changed
      window.ethereum.on('networkChanged', async function (networkId) {
        // Time to reload your interface with the new networkId
        console.log(`networkChanged: ${networkId}`);
        removeStoredAuth()
        removeStoredNetwork();
        document.getElementById('connect-wallet').click()
      })


      // -- validate
      if(storedAuth() == null){
        console.error("BtnConnectWallet() > Please connect your wallet.");
        setWalletAddress('Connect Lit-Gather')
        return
      }

      // -- execute
      setWalletAddress(shortenWalletAddress(JSON.parse(storedAuth()).address))
      
  }, [])

  return <Btn
    id="connect-wallet"
    text={ walletAddress }
    href="/connect-wallet"
  />


}

export default BtnConnectWallet;
