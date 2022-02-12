//
// Check if wallet address is registered from the backend
// @param { String } wallet address
// @return { Boolean } true/false
//
const fetchIsWalletRegistered = async (walletAddress) => {

    console.warn("↓↓↓↓↓ fetch.js/fetchIsWalletRegistered ↓↓↓↓↓");

    // -- prepare
    const API = process.env.NEXT_PUBLIC_BACKEND + '/oauth/gather/connected';
    const params = `?walletAddress=${walletAddress}`
    const url = API + params;

    // -- fetch
    const res = await fetch(url);
    const data = await res.json();
    
    return data
}

export default fetchIsWalletRegistered