import { createContext } from "react"
import { useContext, useState, useEffect } from "react"
import LitJsSdk from 'lit-js-sdk'
import { removeStoredAuth, removeStoredNetwork, storedAuth, storedGatherPlayerId, storedNetwork } from "../utils/storage";
import { useRouter } from "next/router";

// Create Context Object
const AppContext = createContext();

// Export Provider
export function AppProvider({ children }){

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
            action
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
            setAction
        },
        lit:{
            litNodeClient,
            LitJsSdk,
        }
    }

    return (
        <AppContext.Provider value={sharedState}>
            { children }
        </AppContext.Provider>
    )
}

// Export useContext Hook.
export function useAppContext(){
    return useContext(AppContext)
}