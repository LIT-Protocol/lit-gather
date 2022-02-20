import { createContext } from "react"
import { useContext, useState, useEffect } from "react"
import LitJsSdk from 'lit-js-sdk'
import { removeStoredAuth, removeStoredNetwork, storedAuth, storedGatherPlayerId, storedNetwork } from "../utils/storage";
import { useRouter } from "next/router";
import Modal from "react-modal/lib/components/Modal";
import SEOHeader from "../components/SEO/SEOHeader";
import ConnectModal from "../pages/connect-wallet";

// Create Context Object
const AppContext = createContext();

// Export Provider
export function AppProvider({ children }){

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
    const router = useRouter()

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

    // -- (String) page action based on param
    const [action, setAction] = useState(null)

    // -- Modal
    const [connectModalOpened, setConnectModalOpened] = useState(false);

    // -- Listeners
    const handleMetamaskChanges = () => {

        const reset = () => {
            removeStoredAuth()
            removeStoredNetwork()
            setConnectedNetwork(null)
            setConnectedWalletAddress(null)
            setConnectedGatherId(null)
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

            // -- libraries
            openShareModal,

            // -- authentication
            auth,
            isAuthed,

            // -- modals
            setConnectModalOpened,


        },
        lit:{
            litNodeClient,
            LitJsSdk,
        }
    }

    return (
        <AppContext.Provider value={sharedState}>

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