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
import { LogoutIcon } from '@heroicons/react/solid'


Modal.setAppElement('#__next')

const Connect = () => {

    // -- prepare
    const router = useRouter()
    const chains = Object.keys(LIT_CHAINS);
    const wallets = ['MetaMask', 'WalletConnect'];
    
    // -- state
    const [network, setNetwork] = useState(null)
    const [walletConnected, setWalletConnected] = useState(false)
    const [walletAddress, setWalletAddress] = useState(null)

    //
    // Mounted
    //
    useEffect(() => {
        console.log("--- Mounted Connect ---")
        router.prefetch('/')

        setNetwork(localStorage['lit-network'])
       

        if(localStorage['lit-auth-signature'] != null){
            setWalletConnected(true)
            setWalletAddress(JSON.parse(localStorage['lit-auth-signature']).address)
        }
        

        if(network != null){
            console.log(`Has Chosen Network: ${network}`);
            const href = `/connect-wallet#${network}`;
            router.push(href);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getWalletAddress = () => {
        return localStorage.getItem('lit-auth-signature')
    }

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
    const onClickConnectWallet = async (wallet) => {
        console.log(`onClickConnectWallet: ${wallet}`);
        console.log(`Network: ${network}`);

        // -- prepare
        const hash = router.asPath.split('#')[1];

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
        // router.push('/');
        // document.getElementById('connect-wallet').click()
        setWalletConnected(true)
    }

    //
    // Event:: When disconnect wallet button is clicked
    //
    const onClickDisconnect = async () => {
        console.log("onClickDisconnect()")
        setWalletConnected(false)
        console.log(walletConnected)
        localStorage.removeItem('lit-auth-signature');
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

                    
                    {
                        ! walletConnected ? (
                        <>
                            {/* === Connect Wallet - Step 1 === */}
                            <H2Step step="1" text="Choose Network" />

                            <div className="mt-4 grid grid-cols-5">
                                { chains.map((chain, i) => {
                                    
                                    const hash = router.asPath.split('#')[1];
                                    const selectedNetwork = hash == chain ? 'bg-lit-400/.75' : '';
                                    
                                    return <IconButton key={i} name={chain} callback={() => onClickNetwork(chain)} selected={selectedNetwork}/>
                                }) }
                            </div>

                            {/* === Connected Wallet - Step 2 === */}
                            <H2Step step="2" text="Choose Wallet" />

                            <div className="mt-4 grid grid-cols-5">
                                {  wallets.map((wallet, i) => {
                                    return <IconButton key={i} name={wallet} callback={() => onClickConnectWallet(wallet)}/>
                                })}
                            </div>

                        </>) : (
                        <>
                            {/* === Connected Wallet Info === */}
                            <div>
                                <h1 className="mt-4 text-white">Connected Wallet:</h1>
                                <div className="mt-2 bg-main rounded-2xl p-2 flex justify-between text-white flex justify-center">
                                    <span className="m-auto capitalize">{network} : { walletAddress }</span>
                                </div>
                                <div onClick={() => onClickDisconnect()} className="flex justify-end cursor-pointer ml-auto w-24">
                                    <LogoutIcon className="h-5 w-5 my-auto pt-1 text-lit-400"/>
                                    <div className="my-auto text-sm text-lit-400 mt-1">Disconnect</div>
                                </div>
                            </div>

                        </>)
                    }


                    {/* === Gather.town - Step 3 === */}
                    <H2Step step="3" text="Connect Gather.town" />

                    <div>
                        Connect Gather.town
                    </div>


                </div>
            </Modal>
        </>
    )
}

export default Connect