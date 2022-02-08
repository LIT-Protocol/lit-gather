import LitJsSdk, { LIT_CHAINS } from 'lit-js-sdk'
import { useRouter } from 'next/router'
import Link from 'next/link'
import React, { useEffect, useState } from 'react';


function BtnConnectWallet() {

  // state
  const [auth, setAuth] = useState({});
  const [walletAddress, setWalletAddress] = useState('');

  // -- mounted
  useEffect(() => {
      console.log("--- Mounted BtnConnectWallet ---");

      // -- listen to metamask account changed
      window.ethereum.on('accountsChanged', function (accounts) {
          // Time to reload your interface with accounts[0]!
          console.log('accountsChanged')
          localStorage.removeItem('lit-auth-signature');
          localStorage.removeItem('lit-network');
          document.getElementById('connect-wallet').click()
      })

      // -- listen to metamask network changed
      window.ethereum.on('networkChanged', async function (networkId) {
        // Time to reload your interface with the new networkId
        console.log(`networkChanged: ${networkId}`);
        localStorage.removeItem('lit-auth-signature');
        localStorage.removeItem('lit-network');
        document.getElementById('connect-wallet').click()
      })


      // -- prepare
      const authSig = localStorage['lit-auth-signature'];

      // -- validate
      if(authSig == null){
        console.error("BtnConnectWallet() > Please connect your wallet.");
        setWalletAddress('Connect Lit-Gather')
        return
      }

      // -- execute
      setAuth(JSON.parse(authSig));
      console.log("lit-auth-signature:", authSig);
      
      setWalletAddress(shortenWalletAddress(JSON.parse(authSig).address))
      
  }, [])


  // -- prepare
  const router = useRouter()

  //
  // Check if wallet is connected
  // @return { Boolean } true/false
  //
  const litAuthed = () => {
    return localStorage['lit-auth-signature'] != null;
  }

  // Check if gather account is authed
  // @return { Boolean } true/false
  //
  const gatherAuthed = () => {
    return false;
  }

  //
  // Get auth signature from localstorage
  // @return { Object } authSig
  //
  const storedAuth = () => {
    return JSON.parse(localStorage['lit-auth-signature']);
  }

  //
  // Shorten wallet address
  // @param { String } wallet address
  // @return { String } wallet address
  //
  const shortenWalletAddress = (addr) => {
    return addr.substring(0, 5) + '...' + addr.substring(addr.length - 4, addr.length);
  } 

  //
  // Update text
  // @param { HTMLElement } e
  // @param { String } text
  // @return { void }
  const updateText = (e, text) => {
    e.innerText = text;
  }

  // 
  // Connect Wallet
  // @return { authSign }
  //
  const connectWallet = async () => {

    let authSig;

    try{
      authSig = await LitJsSdk.checkAndSignAuthMessage({chain: 'ethereum'});
    }catch(e){
      console.warn("Failed to connect wallet.");
    }

    return authSig;
  }

  //
  // Handler:: when button is clicked
  // @param { Event } e
  // @returns { void }
  //
  const handleClick = async (e) => {
    e.preventDefault();
    console.warn("🔥 BtnConnectWallet() -> handleClick()");

    router.push('/connect/1');
    return
    // -- prepare
    let defaultText = e.target.innerText;

    const authSig = litAuthed() ? storedAuth() : await connectWallet();
    console.log(authSig);
    updateText(e.target, shortenWalletAddress(authSig.address));
    
  }

  return <div className="bg-lit-400 hover:bg-lit-500 text-white rounded-3xl flex transition duration-300 ease-lit">
      {/* <button onClick={handleClick} id="connect-wallet" className="flex pl-4 pr-4 p-2">
        <p>Connect Wallet</p>
      </button> */}

      <Link href="/connect-wallet" as={`/connect-wallet`}>
        <a id="connect-wallet" className="flex pl-4 pr-4 p-2">
          <p className="text-base">{ walletAddress }</p>
        </a>
      </Link>

  </div>;
}

export default BtnConnectWallet;
