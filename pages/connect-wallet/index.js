import { LIT_CHAINS } from 'lit-js-sdk'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import LayoutHeader from '../../components/Layout/Header'
import SEOHeader from '../../components/SEO/SEOHeader'
import LitJsSdk from 'lit-js-sdk'
import IconButton from '../../components/IconButton'
import { H2Step } from '../../components/Ui/H2Step'
import { LogoutIcon } from '@heroicons/react/solid'
import resourceIds from '../../utils/resources-ids'
import accessControlConditionTemplate from '../../utils/access-control-condition-template'
import getConfig from "next/config";
import { storedAuth, setStoredNetwork, removeStoredAuth, removeWeb3Modal } from '../../utils/storage'
import { getGatherRedirectUrl } from '../../utils/gather'

// -- get env vars
const { publicRuntimeConfig } = getConfig();

Modal.setAppElement('#__next')

const Connect = () => {

    // -- prepare
    const router = useRouter()
    const chains = Object.keys(LIT_CHAINS);
    const wallets = ['MetaMask', 'WalletConnect'];
    
    // -- state
    const [connectedNetwork, setConnectedNetwork] = useState(null)
    const [walletIsConnected, setWalletIsConnected] = useState(false)
    const [walletAddress, setWalletAddress] = useState(null)

    // -- (non-reactive) storage getter
    let storedNetwork;

    //
    // Mounted
    //
    useEffect(() => {
        console.log("--- Mounted Connect ---")
        router.prefetch('/')

        // -- prepare
        storedNetwork = localStorage.getItem('lit-network');
        setConnectedNetwork(storedNetwork);
        
        // -- validate if wallet connected
        if(storedAuth() != null){

            // -- set wallet states
            setWalletIsConnected(true)
            setWalletAddress(JSON.parse(storedAuth()).address)
        }

        // -- validate is network is chosen
        if(connectedNetwork != null){

            // -- push hash to url
            console.log(`Has Chosen Network: ${connectedNetwork}`);
            const href = `/connect-wallet#${connectedNetwork}`;
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

        // -- prepare
        const href = `/connect-wallet#${chain}`;

        // -- setter
        setConnectedNetwork(chain)
        setStoredNetwork(chain);

        // -- execute
        router.push(href);
    }


    //
    // Event:: When a wallet is chosen
    // @param { String } wallet address
    // @return { void } 
    //
    const onClickConnectWallet = async (wallet) => {
        console.log(`onClickConnectWallet: ${wallet}`);
        console.log(`Network: ${connectedNetwork}`);

        // == before validation ==
        // -- prepare
        const hash = router.asPath.split('#')[1];

        // -- validate
        if(connectedNetwork == null){
            alert("Please select a network to connect");
            return;
        }

        // == after validation ==
        // -- reset
        removeStoredAuth();
        removeWeb3Modal();

        // -- prepare
        const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: connectedNetwork});   
        
        // -- setter
        setStoredNetwork(connectedNetwork);
        setWalletIsConnected(true)
        setWalletAddress(authSig.address)
        console.log("Authed:", authSig);

        // router.push('/');
        // document.getElementById('connect-wallet').click()
    }

    //
    // Event:: When disconnect wallet button is clicked
    // @return { void } 
    //
    const onClickDisconnect = async () => {
        console.log("onClickDisconnect()")

        // -- execute
        setWalletIsConnected(false)
        removeStoredAuth();
    }

    //
    // Event:: When Connect Gather.town button is clicked
    // Redirect user to gather auth page which will then calls the 
    // backend API to store user credential (wallet address, and gather id)
    // @return { void } 
    //
    const onClickConnectGather = async() => {
        console.log(accessControlConditionTemplate)
        console.log(resourceIds)

        // -- prepare
        const authSig = JSON.parse(storedAuth());

        // -- prepare queries
        const queryAuthSig = { authSig: JSON.stringify(authSig) }
        const queryGatherUrl = { gatherUrl: window.location.origin + window.location.pathname + '#connect-gather' }
        
        // -- prepare redirect url
        const redirectUrl = getGatherRedirectUrl({
            host: publicRuntimeConfig.BACKEND_API, // eg. http://localhost:3000 (backend app)
            endpoint: '/oauth/gather/callback?',
            queries: [
                queryAuthSig,
                queryGatherUrl
            ],
        });

        // -- redirect user to gather auth page
        window.location.href = redirectUrl;
        
        // window.location = `https://gather.town/getPublicId?redirectTo=${encodeURIComponent(
        // redirectUrl,
        // )}`
        // console.log("Location:", `https://gather.town/getPublicId?redirectTo=${encodeURIComponent(
        //     redirectUrl,
        //     )}`)


        // const jwts = await Promise.all(
        // resourceIds.map(async (rid) => {
        //     const resourceId = rid.resourceId
        //     const chain = rid.chain

        //     let accessControlConditions
        //     if (rid.accessControlConditions) {
        //     accessControlConditions = rid.accessControlConditions
        //     } else {
        //     accessControlConditions = [...accessControlConditionTemplate]
        //     accessControlConditions[0].contractAddress = rid.addr
        //     accessControlConditions[0].chain = chain
        //     }

        //     try {
        //     const jwt = await litNodeClient.getSignedToken({
        //         accessControlConditions,
        //         chain,
        //         authSig,
        //         resourceId,
        //     })
        //     return { rid, jwt }
        //     } catch (e) {
        //     return { rid, error: e }
        //     }
        // }),
        // )
        // console.log('jwts:', jwts)
        // const validJwts = jwts.filter((j) => j.jwt)
        // console.log('validJwts: ', validJwts)
    }

    //
    // Event:: When modal is closed
    // @return { void } 
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
                        ! walletIsConnected ? (
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
                                    <span className="m-auto capitalize">{connectedNetwork} : { walletAddress }</span>
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

                    <div onClick={() => onClickConnectGather()} className="text-white bg-lit-400 mt-2 ml-1">
                        Connect Gather.town
                    </div>


                </div>
            </Modal>
        </>
    )
}

export default Connect