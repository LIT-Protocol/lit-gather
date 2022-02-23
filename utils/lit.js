import { removeHttp } from "./helper"
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
//
// Get access control condition for the selected wallet address and chain
// @param { String } wallet address
// @param { String } chain
// @return { Array } Access Control Conditions
//
export const getWalletAccessControls = (walletAddress, chain) => {

    // -- validate
    if( ! walletAddress || ! chain){
        console.error(`getWalletAccessControls() -> params(walletAddress:${walletAddress}, chain: ${chain}) cannot be empty.`);
        return;
    }

    return [
        {
            "contractAddress": "",
            "standardContractType": "",
            "chain": chain,
            "method": "",
            "parameters": [
                ":userAddress"
            ],
            "returnValueTest": {
            "comparator": "=",
            "value": walletAddress
            }
        }
    ]
}

//
// Get resource id for backend address
// @param { String } walletAddress
// @return { Object } resourceId
//
export const getWalletResourceId = (walletAddress) => {


    const baseUrl = removeHttp(publicRuntimeConfig.BACKEND_API);

    // -- validate
    if( ! walletAddress ){
        console.error(`getWalletResourceId() -> walletAdress: ${walletAddress} cannot be empty`)
        return
    }

    if( ! baseUrl ){
        console.error(`getWalletResourceId() -> baseUrl cannot be empty`);
        return;
    }

    const resourceId = {
        baseUrl,
        path: '/oauth/gather/connected/' + walletAddress,
        orgId: "",
        role: "",
        extraData: JSON.stringify({
            created_at: Date.now()
        })
    };
    
    return resourceId; 
}


//
// Compile Resource ID base on locked space data
// @param { String } space ID
// @param { Object } restricted area (space)
// @return { Object } resourceId
//
export const compileResourceId = (spaceId, area) => {
    
    console.warn("↓↓↓↓↓ compileResourceId ↓↓↓↓↓ ");
    
    // -- validate
    if( !area.name ){
        console.log(`❌ area name cannot be empty.`)
        return;
    }
    if( !area.topLeft ){
        console.log(`❌ area topLeft cannot be empty.`)
        return;
    }
    if( !area.bottomRight ){
        console.log(`❌ area bottomRight cannot be empty.`)
        return;
    }

    // -- pass    
    const resourceId = {
        baseUrl: 'gather.town',
        path: '/app/' + spaceId,
        orgId: "",
        role: "",
        extraData: JSON.stringify({
            name: area.name,
            topLeft: area.topLeft,
            bottomRight: area.bottomRight,
            wallThickness: area.wallThickness || 0,
        }),
    }

    return resourceId;
}