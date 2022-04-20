import { LIT_CHAINS } from 'lit-js-sdk'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { LogoutIcon } from '@heroicons/react/solid'
import { storedAuth, storedNetwork, setStoredNetwork, removeStoredAuth, removeWeb3Modal, storedGatherPlayerId, setStoredGatherPlayerId, removeStoredGatherPlayerId, removeStoredNetwork, storedResourceId, setStoredResourceId, removeStoredResourceId } from '../../utils/storage'
import { getGatherRedirectUrl } from '../../utils/gather'
import { fetchWalletInfo } from '../../utils/fetch'
// import SEOHeader from '../../components/SEO/SEOHeader'
import IconButton from '../../components/IconButton'
import { H2Step } from '../../components/Ui/H2Step'
import InfoRow from '../../components/InfoRow'
import { getWalletAccessControls, getWalletResourceId } from '../../utils/lit'
import MainLayout from '../../components/Layout/MainLayout'
import { useAppContext } from '../../state/AppProvider'
import getConfig from 'next/config'
import { InfoBox } from '../../components/InfoBox'
const { publicRuntimeConfig } = getConfig()

Modal.setAppElement('#__next')

const ConnectModal = () => {

    // -- prepare state from context
    const appContext = useAppContext();

    const { 
        connectedWalletAddress,
        connectedNetwork,
        connectedGatherId,
        walletIsConnected,
        connectingGather,
        action,
        connectModalOpened,
    } = appContext.state;

    const { 
        setConnectedWalletAddress, 
        setConnectedNetwork, 
        setConnectedGatherId, 
        setWalletIsConnected, 
        setConnectingGather, 
        setAction, 
        setConnectModalOpened,
    } = appContext.methods;
    
    const { litNodeClient, LitJsSdk } = appContext.lit;

    // -- prepare
    const router = useRouter()
    const chains = Object.keys(LIT_CHAINS);
    const wallets = ['MetaMask', 'WalletConnect'];

    // -- local state
    const [selectedNetwork, setSelectedNetwork] = useState(null)
    
    // -- state
    useEffect(() => {
        console.log("--- useEffect ConnectModal ---")
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
            setConnectedWalletAddress(_storedWalletAddress)
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

            // -- THIS PART MAKE IT NULL
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
                    router.push('/token-gate')
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
        
        // -- setter
        // setConnectedNetwork(chain)
        setSelectedNetwork(chain)
    }


    //
    // Event:: When a wallet is chosen
    // @param { String } walletProvider (eg. MetaMask, TrustWallet) etc.
    // @return { void } 
    //
    const onClickWallet = async (walletProvider) => {
        console.warn("↓↓↓↓↓ onClickWallet ↓↓↓↓↓");
    
        // == before validation ==
        // -- validate
        if(selectedNetwork == null){
            alert("Please select a network to connect");
            return;
        }
        if( ! walletProvider){
            console.error("onClickWallet() -> walletProvider cannot be empty.")
        }

        // == after validation ==
        // -- reset
        removeStoredAuth();
        removeWeb3Modal();
        
        // -- auth
        const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: selectedNetwork});
        
        // -- Provisoning access to a resource
        const walletAccessControls = getWalletAccessControls(authSig.address, selectedNetwork);
        const walletResourceId = getWalletResourceId(authSig.address);

        const signed = await litNodeClient.saveSigningCondition({ 
            accessControlConditions: walletAccessControls, 
            chain: selectedNetwork, 
            authSig, 
            resourceId: walletResourceId,
        });

        if( ! signed ){
            console.error("onClickWallet() -> not signed");
            return;
        }

        console.log("Signed:", signed);

        // -- setter
        setWalletIsConnected(true)
        setConnectedWalletAddress(authSig.address)
        setStoredResourceId(JSON.stringify(walletResourceId));
        setConnectedNetwork(selectedNetwork)
        setStoredNetwork(selectedNetwork);

        // router.push('/');
        // document.getElementById('connect-wallet').click()
    }

    //
    // Event:: When disconnect wallet button is clicked
    // @param { Object } option
    // @return { void } 
    //
    const onClickDisconnect = async (options) => {

        // -- default
        let _options = {
            resetStates: true,
            resetLocalStates: true,
            resetStorage: true,
            closeModal: true,
            callback: () => {},
            ...options,
        }

        console.warn("↓↓↓↓↓ onClickDisconnect ↓↓↓↓↓");

        // -- reset states
        if(_options.resetStates){
            setConnectedGatherId(null)
            setConnectedNetwork(null)
            setConnectedWalletAddress(null)
            setWalletIsConnected(false)
        }

        // -- reset local state
        if(_options.resetLocalStates){
            setSelectedNetwork(null)    
        }

        // -- reset storage
        if(_options.resetStorage){
            removeStoredAuth();
            removeStoredGatherPlayerId()
            removeStoredNetwork()
            removeWeb3Modal()
            removeStoredResourceId()
        }

        // -- close modal
        if(_options.closeModal){
            setConnectModalOpened(false);
        }

        if(_options.callback){
            _options.callback();
        }

    }


    return (
        <>
            {/* <SEOHeader subtitle="Connect Wallet" /> */}
            {/* <LayoutHeader/> */}
            <Modal
                isOpen={connectModalOpened} // The modal should always be shown on page load, it is the 'page'
                onRequestClose={() => setConnectModalOpened(false)}
                contentLabel="Connect Wallet"
                className="Modal-Connect-Wallet bg-base-main rounded-3xl text-center"
            >
                <h1 className="text-white text-h1 mt-2">Connected Wallet</h1>

                <div className='mt-12'>
                    <InfoBox/>
                </div>

                <div className="overflow-auto h-[90%]">

                    {
                        // ========== Wallt IS NOT Connected ==========
                        ! walletIsConnected ? (
                        <>
                            {/* === Connect Wallet - Step 1 === */}
                            <H2Step step="1" text="Choose Network" />

                            <div className="mt-4 grid grid-cols-5">
                                { chains.map((chain, i) => {
                                    
                                    const isSelected = selectedNetwork == chain ? 'bg-lit-400/.75' : '';
                                    
                                    return <IconButton key={i} name={chain} callback={() => onClickNetwork(chain)} selected={isSelected}/>
                                }) }
                            </div>

                            {/* === Connected Wallet - Step 2 === */}
                            <H2Step step="2" text="Choose Wallet" />

                            <div className="mt-4 grid grid-cols-5">
                                {  wallets.map((wallet, i) => {
                                    return <IconButton key={i} name={wallet} callback={() => onClickWallet(wallet)}/>
                                })}
                            </div>

                        </>) : (
                        <>
                            {/* === Connected Wallet Info === */}
                            <div className='mt-4'>
                                {/* <h1 className="mt-4 text-white">Connected Wallet:</h1> */}
                                <InfoRow 
                                    text={`${ connectedWalletAddress }`}
                                    action={{
                                        callback: () => onClickDisconnect({callback: () => router.push('/')}),
                                        svg: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                      </svg>,
                                        text: 'Disconnect',
                                    }}
                                />
                            </div>

                        </>)
                    }

                    
                    {/* {
                        // -- GatherId NOT stored/connecteds
                        // === Gather.town - Step 3 ===
                        (connectedGatherId == null && ! connectingGather)
                        ?
                        <>
                            <H2Step step="3" text="Connect Gather.town" />
                            <div className="mt-2 ml-1 ">
                                <IconButton name="gather"
                                    callback={onClickGather}
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
                    } */}



                </div>
            </Modal>
        </>
    )
}

export default ConnectModal


ConnectModal.getLayout = function getLayout(page) {
    return (
        <MainLayout>
            {page }
        </MainLayout>
    )
  }