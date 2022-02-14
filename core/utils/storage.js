// + ====================================================================================
// +                      Bunch for local storage helper functions                      +
// + ====================================================================================


// ------------------------- Network -------------------------
// 
// (GET) Get network from storage
// @retunr { String } network
//
export const storedNetwork = () => localStorage.getItem('lit-network');

//
// (SETTER) Set stored network
// @param { String } chain, network eg. ethereum, polygon, etc.
// @return { void }
//
export const setStoredNetwork = (chain) => localStorage.setItem('lit-network', chain);


// ------------------------- Lit Auth -------------------------
// 
// (GET) Get auth from storage
// @retunr { String } auth
//
export const storedAuth = () => localStorage.getItem('lit-auth-signature');

//
// (SETTER) Set stored auth
// @param { String } value {"sig":"0x3..1b","derivedVia":"web3.eth.personal.sign","signedMessage":"I am creating an
// account to use Lit Protocol at 2022-02-11T01:59:07.106Z","address":"0xdd..bc"}
// @return { void }
//
export const setStoredAuth = (value) => localStorage.setItem('lit-auth-signature', value);

//
// (DELETE) stored auth
// @return { void }
//
export const removeStoredAuth = () => localStorage.removeItem('lit-auth-signature');

//
// (DELETE) web 3 modal and remove all duplicated elements
// @return { void }
//
export const removeWeb3Modal = () => {
    localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
    [...document.querySelectorAll('#WEB3_CONNECT_MODAL_ID')].forEach((e) => {
        e.remove(); // remove duplicate modal doms
    });
}


// ------------------------- Gather -------------------------
// 
// (GET) Get gather from storage
// @retunr { String } gather
//
export const storedGatherPlayerId = () => localStorage.getItem('lit-gather-player-id');

//
// (SETTER) Set gather account details
// @param { String } value
// @return { void }
//
export const setStoredGatherPlayerId = (value) => localStorage.setItem('lit-gather-player-id', value);