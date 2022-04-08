import { createContext } from "react"
import { useContext, useState, useEffect } from "react"
import LitJsSdk from 'lit-js-sdk'
import { removeStoredAuth, removeStoredGatherPlayerId, removeStoredNetwork, removeStoredResourceId, removeWeb3Modal, setStoredNetwork, storedAuth, storedGatherPlayerId, storedNetwork } from "../utils/storage";
import ConnectModal from "../pages/connect-wallet";
import { asyncForEach, disableNativeAlert, enableNativeAlert } from "../utils/helper";
import { compileResourceId } from "../utils/lit";
import { storeUserPermittedResources } from "../utils/fetch";
import { getGatherRedirectUrl } from "../utils/gather";

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

// Create Context Object
const AppContext = createContext();

// Export Provider
export function AppProvider({ children }){


    // ======================================================
    // +           Actions for joining a space              +
    // ======================================================
    // 
    // Get a list of arguments to be passed to the 
    // getSignedToken function to request JWT
    // @param { String } spaceId eg.  tXVe5OYt6nHS9Ey5\lit-protocol
    // @param { Array } locked spaces
    // @return { Array } list
    //
    const getJwtArguments = (spaceId, lockedSpaces) => {

        return lockedSpaces.map((area) => {

            // -- prepare
            var accessControlConditions = JSON.parse(area.accessControls);
            var resourceId = compileResourceId(spaceId, area);
            
            // -- add to list
            return {
                accessControlConditions,
                resourceId
            };
        });

    }

    //
    // Get return jwts from list of arguments
    // @param { String } chain/network
    // @param { Object } authSig
    // @param { Array } jwt argumnets
    // @return { Array } list of jwts
    //
    const getJwts = async (chain, authSig, args) => {

        
        const jwts = [];
        
        await asyncForEach(args, async (arg) => {
            let jwt;
            try{
                jwt = await litNodeClient.getSignedToken({ 
                    chain,
                    authSig, 
                    accessControlConditions: arg.accessControlConditions.accessControlConditions, 
                    resourceId: arg.resourceId,
                })
            }catch{
                console.error("❌ Failed to request jwt for ", arg);
            }
            jwts.push(jwt);
        })

        return jwts;
    }

    //
    // event::  Join space button
    // @parma { Object } space
    // @param { bool } isInGame (only true if joining inside a game)
    // @return { void } 
    //
    const joinSpace = async (space, isInGame = false) => {
        console.warn("↓↓↓↓↓ onClickJoin ↓↓↓↓↓ ");
        setLoaded(false);
        setMsg(`Joining ${space.spaceId}...`)

        // -- disable native alert
        disableNativeAlert();

        // -- prepare
        const lockedSpaces = JSON.parse(space.restrictedSpaces);
        console.log("👉 lockedSpaces:", lockedSpaces)

        // -- prepare spaceId eg. tXVe5OYt6nHS9Ey5\lit-protocol
        const spaceId = space.spaceId;
        console.log("👉 spaceId:", spaceId)

        // -- prepare access to resource via jwt
        
        // -- chain & auth
        const chain = storedNetwork();
        const authSig = await LitJsSdk.checkAndSignAuthMessage({chain});
        
        // -- get jwt arguments to be passed 
        const jwtArguments = getJwtArguments(spaceId, lockedSpaces);
        console.log("👉 jwtArguments:", jwtArguments);
        
        // -- get jwts
        const jwts = await getJwts(chain, authSig, jwtArguments);

        // -- valid jwts
        const validJwts = jwts.filter((jwt) => jwt);

        console.log("👉 validJwts:", validJwts);

        // -- store user's gather permitted resources
        const store = await storeUserPermittedResources({authSig, jwts: validJwts, spaceId})
        
        console.log("👉 Permitted Resources Stored:", store)

        // -- prepare queries
        const queryAuthSig = { authSig: JSON.stringify(authSig) }
        const queryGatherUrl = { gatherUrl: (window.location.origin + window.location.pathname) }
        const querySpace = { spaceId }
        const queryIsInGame = { isInGame: JSON.parse(isInGame)}

        // -- prepare redirect query
        const redirectUrl = getGatherRedirectUrl({
            host: publicRuntimeConfig.BACKEND_API, 
            endpoint: '/oauth/gather/callback2?',
            queries: [
                queryAuthSig,
                queryGatherUrl,
                querySpace,
                queryIsInGame
            ],
        });

        console.log("👉 redirectUrl:", redirectUrl)
        
        // -- enable native alert once its done
        enableNativeAlert();
    
        setTimeout(() => {
            setLoaded(true);
            setMsg('')
            window.location = redirectUrl;
        }, 2000);
    }

    //
    // Event:: when disconnect button is clicked
    // @return { void }
    //
    const onDisconnect = () => {
        console.warn("↓↓↓↓↓ onDisconnect ↓↓↓↓↓");

        // -- reset states
        setConnectedGatherId(null)
        setConnectedNetwork(null)
        setConnectedWalletAddress(null)
        setWalletIsConnected(false)

        // -- reset storage
        removeStoredAuth();
        removeStoredGatherPlayerId();
        removeStoredNetwork();
        removeWeb3Modal();
        removeStoredResourceId();

        // -- close modal
        setConnectModalOpened(false);
    }

    //
    // Handler:: when wallet is NOT connected
    // @param { Object } callback
    // @return { void }
    //
    const handleWhenWalletNotConnected = async (callback = null) => {
        console.warn("↓↓↓↓↓ handleWhenWalletNotConnected ↓↓↓↓↓");

        // -- prepare
        const chain = 'ethereum';
        const authSig = await LitJsSdk.checkAndSignAuthMessage({chain});
        
        // -- validate
        if( ! authSig ){
            console.error("❗ Failed to connect wallet");
            return;
        }

        console.log("👉 authSig:", authSig);

        setWalletIsConnected(true);
        setConnectedWalletAddress(authSig.address);
        setConnectedNetwork(chain);
        setStoredNetwork(chain);

        if ( callback ){
            console.warn("Performing callback: ", callback);
            callback.exec();
        }
        
    }

    //
    // Handler:: when wallet IS connected
    // @return { void }
    //
    const handleWalletIsConnected = async () => {
        setConnectModalOpened(true);
    }

    // 
    // Event:: When `Connect Wallet` button is clicked
    // @param { Object } callback
    // @return { void }
    //
    const onClickConnectWallet = async (callback = null) => {
        console.warn("↓↓↓↓↓ onClickConnectWallet ↓↓↓↓↓");

        // -- validate: if wallet is connected
        console.log("👉 connectedWalletAddress:", connectedWalletAddress);
        if( ! connectedWalletAddress ){
            await handleWhenWalletNotConnected(callback);
            return;
        }

        handleWalletIsConnected();

    }


    //
    // Check is authed
    // @return { Boolean } 
    //
    const isAuthed = () => {
        return storedAuth && storedNetwork(); 
    }

    // 
    // Middleware function that makes sure user is metamask logged
    // @param { Function } callback
    // @return { void } 
    //
    const auth = (callback) => {

        // -- validate
        if( ! storedAuth() || ! storedNetwork() ){
            onClickConnectWallet({
                origin: 'auth()',
                exec: callback
            });
            return;
        }

        // -- execute
        callback();
    }

    // -- Access Control Conditions Modal 
    
    // 
    // Close Access Control Conditions Modal
    // @return { void } 
    //
    function closeModal() {
        console.log("close share modal");
        ACCM.ReactContentRenderer.unmount(document.getElementById("shareModal"));
    }

    //
    // Open the Access Control Conditions Modal
    // @param { HTMLElement } 
    // @return { void }
    //
    function openShareModal(e) {
        console.log("open share modal");
        ACCM.ReactContentRenderer.render(
            ACCM.ShareModal,
            // props to be passed to the ShareModal component.  These are documented here: https://github.com/LIT-Protocol/lit-access-control-conditions-modal#props
            {
            sharingItems: [],
            onAccessControlConditionsSelected: function (accessControlConditions) {
                console.log(
                    "accessControlConditions from ShareModal: ",
                    accessControlConditions
                );
                e.value = JSON.stringify(accessControlConditions);
                closeModal();
                // now, use the accessControlConditions to provision access using one of the methods below:
                // https://github.com/LIT-Protocol/lit-js-sdk#dynamic-content---provisoning-access-to-a-resource
                // or https://github.com/LIT-Protocol/lit-js-sdk#static-content---storing-any-static-content-and-manually-storing-the-metadata
            },
            onClose: closeModal,
            getSharingLink: function (sharingItem) {
                console.log("getSharingLink", sharingItem);
                return "";
            },
            showStep: "ableToAccess",
            },
            // target DOM node
            document.getElementById("shareModal")
        );
    }
    
    // -- prepare router
    // const router = useRouter()

    // -- prepare
    const litNodeClient = new LitJsSdk.LitNodeClient()
    litNodeClient.connect();

    // -- connection state
    const [connectedWalletAddress, setConnectedWalletAddress] = useState(null)
    const [connectedNetwork, setConnectedNetwork] = useState(null)
    const [connectedGatherId, setConnectedGatherId] = useState(null)

    // -- (Boolean)
    const [walletIsConnected, setWalletIsConnected] = useState(false)
    const [connectingGather, setConnectingGather] = useState(false)

    // -- (Deprecated?) (String) page action based on param
    const [action, setAction] = useState(null)

    // -- Modal
    const [connectModalOpened, setConnectModalOpened] = useState(false);
    
    // -- web 3 wallet
    const [hasWeb3Wallet, setHasWeb3Wallet] = useState(true);
    const [loaded, setLoaded] = useState(true);
    const [msg, setMsg] = useState('Loading...');
    
    // 
    // event: listen to metamask changes
    //
    const handleMetamaskChanges = () => {

        const reset = () => {
            removeStoredAuth()
            removeStoredNetwork()
            setConnectedNetwork(null)
            setConnectedWalletAddress(null)
            setConnectedGatherId(null)
        }

        // -- validate
        if( !window?.ethereum ){
            setHasWeb3Wallet(false);
            return;
        }

        window.ethereum.on('accountChanged', () => {
            console.log('accountsChanged')
            reset()
        })

        window.ethereum.on('networkChanged', () => {
            console.log('networkChanged')
            reset()
        })
    }

    // -- useEffect
    useEffect(() => {
        // -- init 
        setConnectedNetwork(storedNetwork() || null)
        setConnectedWalletAddress(JSON.parse(storedAuth())?.address || null)
        setConnectedGatherId(storedGatherPlayerId() || null)

        // -- handle listeners
        handleMetamaskChanges()
    }, [])
    


    // -- things to be provided in the context
    let sharedState = {
        state: {
            // -- connection state
            connectedWalletAddress,
            connectedNetwork,
            connectedGatherId,

            // -- true/false
            walletIsConnected,
            connectingGather,
            
            // -- page action based on param
            action,

            // -- modals
            connectModalOpened,
        },
        methods: {
            // -- connection state
            setConnectedWalletAddress,
            setConnectedNetwork,
            setConnectedGatherId,

            // -- true/false
            setWalletIsConnected,
            setConnectingGather,
            
            // -- page action
            setAction,
            joinSpace,
            onClickConnectWallet,
            onDisconnect,

            // -- libraries
            openShareModal,

            // -- authentication
            auth,
            isAuthed,

            // -- modals
            setConnectModalOpened,

            // -- visuals
            setMsg,
            setLoaded,


        },
        lit:{
            litNodeClient,
            LitJsSdk,
        }
    }

    return (
        <AppContext.Provider value={sharedState}>

            {/* --- Global Loading --- */}
            <div className={`fixed top-0 w-full bg-color-gather-gradient py-1 flex justify-center transition pointer-events-none`} style={{zIndex: 99, opacity: loaded ? 0 : 1}}>
                <span className="text-white text-center m-auto">{msg}</span>
            </div>
    
            {/* ----- No Web3 Wallet Exception ----- */}
            { ! hasWeb3Wallet ? <div className="w-full text-center text-red">No web3 wallet was found. Please connect to your wallet and refresh the page</div> : ''}

            {/* ----- Modals ----- */}
            <ConnectModal/>
                
            <div id="shareModal" className="z-10"></div>
            
            {/* ----- CONTENT AREA ----- */}
            { children }
            {/* ----- ...CONTENT AREA ----- */}

            {/* ----- Required JS libraries ----- */}
            {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lit-access-control-conditions-modal-vanilla-js/dist/main.css"/> */}
            <script src="https://cdn.jsdelivr.net/npm/lit-share-modal-v2-vanilla-js@latest/dist/index.js"></script>

        </AppContext.Provider>
    )
}

// Export useContext Hook.
export function useAppContext(){
    return useContext(AppContext)
}

// .lsm-top-modal {
//     position: fixed;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     width: 37.5rem;
//     height: 46rem;
// }
// .lsm-top-modal {
//     height: 100vh;
//     overflow-y: hidden;
//     z-index: 11;
// }