//
// Shorten wallet address
// @param { String } wallet address
// @return { String } wallet address
//
export const shortenWalletAddress = (addr) => {

    if( ! addr ){
        console.error("shortenWalletAddress() -> addr cannot be empty.");
        return null;
    }

    return addr.substring(0, 5) + '...' + addr.substring(addr.length - 4, addr.length);
}

//
// Remove HTTP or HTTPS from string
// @param { String } url
// @return { String } url
//
export const removeHttp = (url) => {
    return url.replace(/^https?:\/\//, '');
}

//
// Custom async foreach function
// @param { Array } array
// @param { Function } callback
// @return { void }
//
export const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

//
// Disable native alert 
// @return { void } 
//
export const disableNativeAlert = () => {
    window.nativeAlert = window.alert;
    window.alert = function() {}
}

//
// Enable native alert 
// @return { void } 
//
export const enableNativeAlert = () => {
    window.alert = window.nativeAlert;
}

//
// Generate an unique id based on length
// @param { Int } length of the random string
// @returns { String } random string
export const makeId = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
