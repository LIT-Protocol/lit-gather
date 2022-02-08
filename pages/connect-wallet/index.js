import { LIT_CHAINS } from 'lit-js-sdk'
import { useRouter, withRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import LayoutHeader from '../../components/Layout/Header'
import SEOHeader from '../../components/SEO/SEOHeader'
import Link from 'next/link'
import LitJsSdk from 'lit-js-sdk'
import IconButton from '../../components/IconButton'
import { H2Step } from '../../components/Ui/H2Step'

Modal.setAppElement('#__next')

const Connect = () => {

    // -- prepare
    const router = useRouter()
    const chains = Object.keys(LIT_CHAINS);
    const wallets = ['MetaMask', 'WalletConnect'];
    
    // -- state
    const [network, setNetwork] = useState('')

    //
    // Mounted
    //
    useEffect(() => {
        console.log("--- Mounted Connect ---")
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
    // @param { String } chain name eg. ethereum, polygon, etc.
    // @return { void } 
    //
    const onClickNetwork = (chain) => {
        console.log("onClickNetwork:", chain)
        const href = `/connect-wallet#${chain}`;
        router.push(href);
        setNetwork(chain)
        // localStorage['lit-network'] = chain;
    }


    //
    // Event:: When a wallet is chosen
    // @param { String } wallet address
    // @return { void } 
    //
    const onClickWallet = async (wallet) => {
        console.log(`onClickWallet: ${wallet}`);
        console.log(`Network: ${network}`);

        // -- validate
        if(network == null){
            alert("Please select a network to connect");
            return;
        }

        // -- reset
        localStorage.removeItem('lit-auth-signature');
        localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
        [...document.querySelectorAll('#WEB3_CONNECT_MODAL_ID')].forEach((e) => {
            e.remove(); // remove duplicate modal doms
        });

        // -- prepare
        const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: network});   
        
        // -- execute
        console.log("SIGNED!", authSig);
        localStorage['lit-network'] = network;
        router.push('/');
    }

    //
    // Event:: When modal is closed
    // 
    const onModalClosed = () => {
        router.push('/')
    }


    return (
        <>
            <SEOHeader subtitle="Connect Wallet" />
            <LayoutHeader/>
            <Modal
                isOpen={true} // The modal should always be shown on page load, it is the 'page'
                onRequestClose={() => onModalClosed()}
                contentLabel="Connect Wallet"
                className="Modal-Connect-Wallet bg-base-main rounded-3xl"
            >
                <h1 className="text-white text-h1">Connect Lit-Gather</h1>

                <div className="overflow-auto h-5/6">
                    
                    {/* === Step 1 === */}
                    <H2Step step="1" text="Choose Network" />

                    <div className="mt-4 grid grid-cols-5">
                        { chains.map((chain, i) => {
                            
                            const hash = router.asPath.split('#')[1];
                            const selectedNetwork = hash == chain ? 'bg-lit-400/.75' : '';
                            
                            return <IconButton key={i} name={chain} callback={() => onClickNetwork(chain)} selected={selectedNetwork}/>
                        }) }
                    </div>

                    {/* === Step 2 === */}
                    <H2Step step="2" text="Choose Wallet" />

                    <div className="mt-4 grid grid-cols-5">
                        {  wallets.map((wallet, i) => {

                            return <IconButton key={i} name={wallet} callback={() => onClickWallet(wallet)}/>
                        })}
                    </div>

                </div>
            </Modal>
        </>
    )
}

export default Connect