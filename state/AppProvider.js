import { createContext } from "react"
import { useContext, useState, useEffect } from "react"
import LitJsSdk from 'lit-js-sdk'
import { removeStoredAuth, removeStoredNetwork, storedAuth, storedGatherPlayerId, storedNetwork } from "../utils/storage";
import ConnectModal from "../pages/connect-wallet";
import { asyncForEach, disableNativeAlert, enableNativeAlert } from "../utils/helper";
import { compileResourceId } from "../utils/lit";
import { storeUserPermittedResources } from "../utils/fetch";
import { getGatherRedirectUrl } from "../utils/gather";
import { info } from "autoprefixer";
import Loading from "../components/Ui/Loading";
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
                    accessControlConditions: arg.accessControlConditions, 
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
    // @return { void } 
    //
    const joinSpace = async (space) => {
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
        
        // -- get jwts
        const jwts = await getJwts(chain, authSig, jwtArguments);
        
        // -- valid jwts
        const validJwts = jwts.filter((jwt) => jwt);
        
        
        // -- store user's gather permitted resources
        const store = await storeUserPermittedResources({authSig, jwts: validJwts, spaceId})
        
        console.log("👉 jwtArguments:", jwtArguments);
        console.log("👉 jwts:", jwts);
        console.log("👉 validJwts:", validJwts);
        console.log("👉 Permitted Resources Stored:", store)
        return;
        // -- prepare queries
        const queryAuthSig = { authSig: JSON.stringify(authSig) }
        const queryGatherUrl = { gatherUrl: (window.location.origin + window.location.pathname) }
        const querySpace = { spaceId }

        // -- prepare redirect query
        const redirectUrl = getGatherRedirectUrl({
            host: publicRuntimeConfig.BACKEND_API, 
            endpoint: '/oauth/gather/callback2?',
            queries: [
                queryAuthSig,
                queryGatherUrl,
                querySpace,
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
        if( ! storedAuth() || !storedNetwork()){
            setConnectModalOpened(true);
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
            
            // -- page action based on param
            setAction,
            joinSpace,

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
                
            <div id="shareModal"></div>
            
            {/* ----- CONTENT AREA ----- */}
            { children }
            {/* ----- ...CONTENT AREA ----- */}

            {/* ----- Required JS libraries ----- */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lit-access-control-conditions-modal-vanilla-js/dist/main.css"/>
            <script src="https://cdn.jsdelivr.net/npm/lit-access-control-conditions-modal-vanilla-js/dist/index.js"></script>

        </AppContext.Provider>
    )
}

// Export useContext Hook.
export function useAppContext(){
    return useContext(AppContext)
}