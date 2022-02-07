import LitJsSdk from 'lit-js-sdk'

function BtnConnectWallet() {

  //
  // Handler:: when button is clicked
  // @param { Event } e
  // @returns { void }
  //
  const handleClick = async (e) => {

    const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: 'ethereum'})
    
  }

  return <div className="bg-lit-400 hover:bg-lit-500 text-white rounded-3xl flex transition duration-300 ease-lit">
      <button onClick={handleClick} id="connect-wallet" className="flex pl-4 pr-4 p-2">
        <p>Connect Wallet</p>
      </button>
  </div>;
}

export default BtnConnectWallet;
