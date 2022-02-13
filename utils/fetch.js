//
// Check if wallet address is registered from the backend
// @param { String } wallet address
// @param { String } jwt token
// @return { Object } data
// @prop { Boolean } isRegistered
// @prop { String } gatherId
// @prop { String } walletAddress
//
const fetchWalletInfo = async (walletAddress, jwt) => {

    console.warn("↓↓↓↓↓ fetch.js/fetchWalletInfo ↓↓↓↓↓");

    // -- validate
    if( ! walletAddress ){
        console.error('fetchWalletInfo() -> walletAddress cannot be empty.');
        return;
    }

    if ( ! jwt ){
        console.error('fetchWalletInfo() -> jwt cannot be empty.');
        return;
    }

    // -- prepare
    const API = process.env.NEXT_PUBLIC_BACKEND + '/oauth/gather/connected';
    const param_1 = '/' + walletAddress;
    const url = API + param_1;
    
    console.log("fetchWalletInfo()->URL:", JSON.stringify(url))

    // -- fetch
    const res = await fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jwt: jwt
        })
    });
    const data = await res.json();
    
    return data
}

export default fetchWalletInfo