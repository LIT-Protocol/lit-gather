import { removeHttp } from "./helper"

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


    const baseUrl = removeHttp(process.env.NEXT_PUBLIC_BACKEND);

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