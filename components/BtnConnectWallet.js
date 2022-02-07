import LitJsSdk from 'lit-js-sdk'
import { useRouter } from 'next/router'
import Link from 'next/link'

function BtnConnectWallet() {

  // -- prepare
  const router = useRouter()

  //
  // Check if wallet is connected
  // @return { Boolean } true/false
  //
  const litAuthed = () => {
    return localStorage['lit-auth-signature'] != null && localStorage['WEB3_CONNECT_CACHED_PROVIDER'] != null;
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
    return addr.substring(0, 6) + '...' + addr.substring(addr.length - 4, addr.length);
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
          <p className="text-base">Connect Wallet</p>
        </a>
      </Link>

  </div>;
}

export default BtnConnectWallet;
