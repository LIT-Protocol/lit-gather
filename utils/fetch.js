// (POST) Check if wallet address is registered from the backend
// @param { String } wallet address
// @param { String } jwt token
// @return { Object } data
// @prop { Boolean } isRegistered
// @prop { String } gatherId
// @prop { String } walletAddress
//
export const fetchWalletInfo = async (walletAddress, jwt) => {

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


//
// (POST) Store locked spaces to the database
// @param { Object } compiledData
// @return { Object } result
//
export const storeLockedSpaces = async (compiledData) => {
    
    console.warn("↓↓↓↓↓ fetch.js/storeLockedSpaces ↓↓↓↓↓");
    
    // -- validate
    if( ! compiledData ){
        console.error('storeLockedSpaces() -> compiledData cannot be empty.')
        return;
    }

    // -- prepare
    const API = process.env.NEXT_PUBLIC_BACKEND + '/oauth/gather/store-locked-spaces';

    // -- fetch
    const res = await fetch(API,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(compiledData)
    });

    const data = await res.json();

    return data;

}

//
// (GET) Get all locked spaces
//
export const fetchLockedSpaces = async () => {
    console.warn("↓↓↓↓↓ fetch.js/fetchLockedSpaces ↓↓↓↓↓");

    // -- prepare
    const API = process.env.NEXT_PUBLIC_BACKEND + '/oauth/gather/locked-spaces';

    const res = await fetch(API);

    const data = await res.json();

    return data;
}