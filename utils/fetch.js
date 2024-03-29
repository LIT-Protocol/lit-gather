import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

//
// (POST) Store locked spaces to the database
// @param { Object } compiledData
// @param { String } action
// @return { Object } result
//
export const storeLockedSpaces = async (compiledData, action) => {

    console.warn("↓↓↓↓↓ fetch.js/storeLockedSpaces ↓↓↓↓↓");

    // -- validate
    if( ! compiledData ){
        console.error('storeLockedSpaces() -> compiledData cannot be empty.')
        return;
    }

    // -- prepare
    const API = publicRuntimeConfig.BACKEND_API + '/oauth/gather/store-locked-spaces';

    // -- fetch
    const res = await fetch(API,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({compiledData, action})
    });

    const data = await res.json();

    return data;

}

//
// (GET) Get all locked spaces
// @return { Object }
// @prop { Object.space }
//
export const fetchLockedSpaces = async () => {
    console.warn("↓↓↓↓↓ fetch.js/fetchLockedSpaces ↓↓↓↓↓");

    // -- prepare
    const API = publicRuntimeConfig.BACKEND_API + '/oauth/gather/locked-spaces';

    const res = await fetch(API);
    console.log('check res', res)

    const data = await res.json();

    return data;
}

//
// (GET) Get single space
// @return { Object }
// @prop { Object.space }
//
export const fetchSpace = async (id) => {
    console.warn("↓↓↓↓↓ fetch.js/fetchSpace ↓↓↓↓↓");

    // -- prepare
    const API = publicRuntimeConfig.BACKEND_API + '/oauth/gather/space?id=' + id;

    const res = await fetch(API);

    const data = await res.json();

    return data;
}

//
// (POST) Get all of your spaces
// @param { Object } data
// @return { Object }
//
export const fetchMySpaces = async (args = {}) => {
    console.warn("↓↓↓↓↓ fetch.js/fetchMySpaces ↓↓↓↓↓");

    // -- prepare
    const API = publicRuntimeConfig.BACKEND_API + '/oauth/gather/my-spaces';

    // -- fetch
    const res = await fetch(API,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(args)
    });

    const data = await res.json();

    return data;

}

//
// (POST) Delete my space
// @param { Object } data
// @return { Object }
//
export const deleteMySpace = async (args = {}) => {
    console.warn("↓↓↓↓↓ fetch.js/deleteMySpace ↓↓↓↓↓");

    // -- prepare
    const API = publicRuntimeConfig.BACKEND_API + '/oauth/gather/delete-space';

    // -- fetch
    const res = await fetch(API,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(args)
    });

    const data = await res.json();

    return data;

}

//
// (POST) Stored user's gather permitted resources
// @param { Object } permittedResources
// @prop { Object } authSig
// @prop { Array } jwts
// @return { Object } result
//
export const storeUserPermittedResources = async (permittedResources) => {
    console.warn("↓↓↓↓↓ fetch.js/storeUserPermittedResources ↓↓↓↓↓");

    // -- prepare
    const API = publicRuntimeConfig.BACKEND_API + '/oauth/gather/user-permitted-resources';

    const res = await fetch(API,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(permittedResources)
    });

    const data = await res.json();
    console.log("storeUserPermittedResources response:", data);

    return data;
}

//
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
    const API = publicRuntimeConfig.BACKEND_API + '/oauth/gather/connected';
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
