import { LIT_CHAINS } from 'lit-js-sdk'
import { useRouter, withRouter } from 'next/router'
import { useEffect } from 'react'
import Modal from 'react-modal'
import LayoutHeader from '../../components/Layout/Header'
import SEOHeader from '../../components/SEO/SEOHeader'
import Link from 'next/link'
import LitJsSdk from 'lit-js-sdk'

Modal.setAppElement('#__next')

const Connect = () => {
    const router = useRouter()

    const chains = Object.keys(LIT_CHAINS);
    const wallets = ['MetaMask', 'WalletConnect'];
    
    //
    // Mounted
    //
    useEffect(() => {
        router.prefetch('/')

        const network = localStorage['lit-network'];

        if(network != null){
            console.log(`Has Chosen Network: ${network}`);
            const href = `/connect-wallet#${network}`;
            router.push(href);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // 
    // Event:: When a network is chosen
    // @param { String } string
    // @return { void } 
    //
    const onClickNetwork = (chain) => {
        const href = `/connect-wallet#${chain}`;
        router.push(href);
        localStorage['lit-network'] = chain;
    }


    const onClickWallet = async (wallet) => {
        console.log(`onClickWallet: ${wallet}`);

        // -- validate
        if(localStorage['lit-network'] == null){
            alert("Please select a network to connect");
            return;
        }

        // -- reset
        localStorage.removeItem('lit-auth-signature');
        localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');

        // -- prepare
        const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: localStorage['lit-network']});        
    }


    return (
        <>
            <SEOHeader subtitle="Connect Wallet" />
            <LayoutHeader/>
            <Modal
                isOpen={true} // The modal should always be shown on page load, it is the 'page'
                onRequestClose={() => router.push('/')}
                contentLabel="Connect Wallet"
                className="Modal-Connect-Wallet bg-base-main rounded-3xl"
            >
                <h1 className="text-white text-h1">Connect Lit-Gather</h1>
                
                <div className="overflow-auto h-5/6">
                    <h2 className="text-white text-base mt-4 flex justify-start">
                        <div className="rounded-full w-6 h-6 text-xs bg-orange bg-lit-400 text-center flex justify-center">
                            <span className="m-auto">1</span>
                        </div>
                        <div className="ml-2 m-t-auto my-auto">Choose Network</div>
                    </h2>
                    
                    <div className="mt-4 grid grid-cols-5">
                        { chains.map((chain, i) => {

                            const hash = router.asPath.split('#')[1];
                            const bgColor = `bg-color-${chain}`;
                            const bgImage = `bg-image-${chain}`;
                            const selectedNetwork = hash == chain ? 'bg-lit-400/.75' : '';
                            
                            return (
                                <button key={i} onClick={() => onClickNetwork(chain)}>
                                    <div className={`block cursor-pointer hover:bg-lit-400/.75 rounded-2xl py-2 m-1 border-box ${selectedNetwork}`}>
                                            <div className={`rounded-full w-12 h-12 flex m-auto ${bgColor}`}>
                                                <div className="m-auto w-full h-full p-3 box-border">
                                                    <div className={`w-full h-full bg-contain ${bgImage}`}></div>
                                                </div>
                                            </div>
                                        <div className="text-xs text-white m-auto flex justify-center">
                                            <span className="mt-1 capitalize">{chain} </span>
                                        </div>
                                    </div>
                                </button>
                            )
                        }) }
                    </div>

                    <h2 className="text-white text-base mt-4 flex justify-start">
                        <div className="rounded-full w-6 h-6 text-xs bg-orange bg-lit-400 text-center flex justify-center">
                            <span className="m-auto">2</span>
                        </div>
                        <div className="ml-2 m-t-auto my-auto">Choose Wallet</div>
                    </h2>

                    <div className="mt-4 grid grid-cols-5">
                        {  wallets.map((wallet, i) => {

                            const bgColor = `bg-color-${wallet}`;
                            const bgImage = `bg-image-${wallet}`;

                            return (
                                <button key={i}  onClick={() => onClickWallet(wallet)}>
                                    <div className={`block cursor-pointer hover:bg-lit-400/.75 rounded-2xl py-2 m-1 border-box`}>
                                            <div className={`rounded-full w-12 h-12 flex m-auto ${bgColor}`}>
                                                <div className="m-auto w-full h-full p-3 box-border">
                                                    <div className={`w-full h-full bg-contain ${bgImage}`}></div>
                                                </div>
                                            </div>
                                        <div className="text-xs text-white m-auto flex justify-center">
                                            <span className="mt-1 capitalize">{wallet} </span>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>


                </div>
            </Modal>
        </>
    )
}

export default Connect