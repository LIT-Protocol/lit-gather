import { LIT_CHAINS } from 'lit-js-sdk'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import LitJsSdk from 'lit-js-sdk'
import { LogoutIcon } from '@heroicons/react/solid'
import accessControlConditionTemplate from '../../utils/access-control-condition-template'
import { storedAuth, storedNetwork, setStoredNetwork, removeStoredAuth, removeWeb3Modal, storedGatherPlayerId, setStoredGatherPlayerId, removeStoredGatherPlayerId, removeStoredNetwork, storedResourceId, setStoredResourceId, removeStoredResourceId } from '../../utils/storage'
import { getGatherRedirectUrl } from '../../utils/gather'
import fetchWalletInfo from '../../utils/fetch'
import resourceIds from '../../utils/resources-ids'
import LayoutHeader from '../../components/Layout/Header'
import SEOHeader from '../../components/SEO/SEOHeader'
import IconButton from '../../components/IconButton'
import { H2Step } from '../../components/Ui/H2Step'
import LoadingIcon from '../../components/Icon/LoadingIcon'
import InfoRow from '../../components/InfoRow'
import { getWalletAccessControls, getWalletResourceId } from '../../utils/lit'

Modal.setAppElement('#__next')

const Connect = () => {

    const litNodeClient = new LitJsSdk.LitNodeClient()
    litNodeClient.connect();

    // -- prepare
    const router = useRouter()
    const chains = Object.keys(LIT_CHAINS);
    const wallets = ['MetaMask', 'WalletConnect'];
    
    // -- state
    const [connectedNetwork, setConnectedNetwork] = useState(null)
    const [walletIsConnected, setWalletIsConnected] = useState(false)
    const [walletAddress, setWalletAddress] = useState(null)
    const [connectingGather, setConnectingGather] = useState(false)
    const [connectedGatherId, setConnectedGatherId] = useState(null)
    const [action, setAction] = useState(null)

    useEffect(async () => {
        console.log("--- Mounted Connect ---")
        router.prefetch('/')

        // -- prepare params
        const params = (new URL(document.location)).searchParams;
        const action = params.get('action');
        const next = params.get('next')
        setAction(action)
        
        // -- states
        var _isConnectingGather = action == 'connect-gather';

        var _hasStoredAuth = storedAuth() != null;
        var _storedWalletAddress = JSON.parse(storedAuth())?.address;

        // var _hasStoredNetwork = storedNetwork() != null;
        var _storedNetwork = storedNetwork();

        var _hasStoredGatherId = storedGatherPlayerId() != null;
        var _storedGatherId = storedGatherPlayerId();

        // -- set connected network
        setConnectedNetwork(_storedNetwork);
        
        // -- reset is connecting to gather.town to false
        setConnectingGather(false)
        
        // -- check if wallet connected
        if( _hasStoredAuth ){

            // -- set wallet states
            setWalletIsConnected(true)
            setWalletAddress(_storedWalletAddress)
        }

        // -- check if gather id is registered
        if( _hasStoredGatherId ){
            setConnectedGatherId(_storedGatherId);
        }
        
        // -- connect gather account
        // -- get hash is connect-gather
        console.log("## Location Hash:", location.hash)

        // -- check if param is `connect-gather`
        if( _isConnectingGather ){
            console.log("Connecting Gather Account");
            setConnectingGather(true)

            setTimeout( async () => {

                // -- prepare
                // access a resource via a JWT
                const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: _storedNetwork});

                const walletAccessControl = getWalletAccessControls(authSig.address, _storedNetwork);
                
                const walletResourceId = JSON.parse(storedResourceId())

                const jwt = await litNodeClient.getSignedToken({ 
                    accessControlConditions: walletAccessControl, 
                    chain: _storedNetwork, 
                    authSig, 
                    resourceId: walletResourceId
                })

                // -- validate
                if( ! walletAccessControl ) {
                    console.error("useEffect() -> walletAccessControl cannot be empty.");
                    return;
                }

                if( ! walletResourceId ) {
                    console.error("useEffect() -> walletResourceId cannot be empty.");
                    return;
                }
                
                if( ! jwt ) {
                    console.error("useEffect() -> jwt cannot be empty.");
                    return;
                }

                console.log("walletAccessControl: ", walletAccessControl);
                console.log("walletResourceId: ", walletResourceId);
                console.log("jwt: ", walletResourceId);
                console.log("JWT:", jwt);

                // -- good down there
                const { isRegistered, gatherPlayerId } = await fetchWalletInfo(_storedWalletAddress, jwt);
                console.log("isRegistered:", isRegistered)
                console.log("gatherPlayerId:", gatherPlayerId)

                if( ! isRegistered){
                    console.warn("Failed to fetchWalletInfo()");
                    setConnectingGather(false);
                    return;
                }

                setStoredGatherPlayerId(gatherPlayerId);
                setConnectedGatherId(gatherPlayerId);
                setConnectingGather(false);

                // -- push to page based on action
                if(next == 'create'){
                    router.push('/create')
                }
            }, 2000);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 
    // Event:: When a network is chosen
    // @param { String } chain name eg. ethereum, polygon, etc.
    // @return { void } 
    //
    const onClickNetwork = (chain) => {
        console.warn("↓↓↓↓↓ onClickNetwork ↓↓↓↓↓");

        // -- validate
        if( ! chain ){
            console.error("onClickNetwork() -> chain cannot be empty");
            return;
        }
        
        // -- prepare
        // const href = `/connect-wallet#${chain}`;

        // -- setter
        setConnectedNetwork(chain)
        // setStoredNetwork(chain);

        // -- execute
        // router.push(href);
    }


    //
    // Event:: When a wallet is chosen
    // @param { String } walletProvider (eg. MetaMask, TrustWallet) etc.
    // @return { void } 
    //
    const onClickConnectWallet = async (walletProvider) => {
        console.warn("↓↓↓↓↓ onClickConnectWallet ↓↓↓↓↓");
    
        // == before validation ==
        // -- validate
        if(connectedNetwork == null){
            alert("Please select a network to connect");
            return;
        }
        if( ! walletProvider){
            console.error("onClickConnectWallet() -> walletProvider cannot be empty.")
        }

        // == after validation ==
        // -- reset
        removeStoredAuth();
        removeWeb3Modal();
        
        // -- auth
        const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: connectedNetwork});
        
        // -- Provisoning access to a resource
        const walletAccessControls = getWalletAccessControls(authSig.address, connectedNetwork);
        const walletResourceId = getWalletResourceId(authSig.address);

        const signed = await litNodeClient.saveSigningCondition({ 
            accessControlConditions: walletAccessControls, 
            chain: connectedNetwork, 
            authSig, 
            resourceId: walletResourceId,
        });

        if( ! signed ){
            console.error("onClickConnectWallet() -> not signed");
            return;
        }

        console.log("Signed:", signed);

        // -- setter
        setStoredNetwork(connectedNetwork);
        setWalletIsConnected(true)
        setWalletAddress(authSig.address)
        setStoredResourceId(JSON.stringify(walletResourceId));

        // router.push('/');
        // document.getElementById('connect-wallet').click()
    }

    //
    // Event:: When disconnect wallet button is clicked
    // @return { void } 
    //
    const onClickDisconnect = async () => {
        console.warn("↓↓↓↓↓ onClickDisconnect ↓↓↓↓↓");

        // -- reset states
        setWalletIsConnected(false)
        setConnectedGatherId(null)
        setConnectedNetwork(null)

        // -- reset storage
        removeStoredAuth();
        removeStoredGatherPlayerId()
        removeStoredNetwork()
        removeWeb3Modal()
        removeStoredResourceId()
    }

    //
    // Event:: When Connect Gather.town button is clicked
    // Redirect user to gather auth page which will then calls the 
    // backend API to store user credential (wallet address, and gather id)
    // @return { void } 
    //
    const onClickConnectGather = async() => {
        console.warn("↓↓↓↓↓ onClickConnectGather ↓↓↓↓↓");

        // -- prepare
        const authSig = JSON.parse(storedAuth());

        // -- prepare queries
        const queryAuthSig = { authSig: JSON.stringify(authSig) }
        const queryGatherUrl = { gatherUrl: `${window.location.origin}${window.location.pathname}?action=connect-gather${action != null ? `&next=create` : ''}` }
        
        // -- prepare redirect url
        const redirectUrl = getGatherRedirectUrl({
            host: process.env.NEXT_PUBLIC_BACKEND, // eg. http://localhost:3000 (backend app)
            endpoint: '/oauth/gather/callback?',
            queries: [
                queryAuthSig,
                queryGatherUrl
            ],
        });

        // -- redirect user to gather auth page
        window.location.href = redirectUrl;
        
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
                                    
                                    const isSelected = connectedNetwork == chain ? 'bg-lit-400/.75' : '';
                                    
                                    return <IconButton key={i} name={chain} callback={() => onClickNetwork(chain)} selected={isSelected}/>
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
                                <InfoRow 
                                    text={`${connectedNetwork} : ${ walletAddress }`}
                                    action={{
                                        callback: onClickDisconnect,
                                        icon: <LogoutIcon/>,
                                        text: 'Disconnect',
                                    }}
                                />
                            </div>

                        </>)
                    }

                    
                    {
                        // -- GatherId NOT stored/connecteds
                        (connectedGatherId == null && ! connectingGather)
                        ?
                        <>
                             {/* === Gather.town - Step 3 === */}
                            <H2Step step="3" text="Connect Gather.town" />
                            <div className="mt-2 ml-1 ">
                                <IconButton name="gather"
                                    callback={onClickConnectGather}
                                />
                            </div>
                        </>
                        :
                        ''
                    }

                    {
                        // -- Connecting to Gather.town
                        connectingGather
                        ?
                        <div className="text-white flex ml-2 mt-2">
                            <LoadingIcon/>
                            Connecting Gather.town...
                        </div>
                        :
                        ''
                    }

                    {
                        (connectedGatherId != null && ! connectingGather)
                        ?
                        <>
                            <h1 className="mt-4 text-white">Linked Gather Player ID:</h1>
                            <InfoRow text={connectedGatherId} />
                        </>
                        :
                        ''
                    }



                </div>
            </Modal>
        </>
    )
}

export default Connect