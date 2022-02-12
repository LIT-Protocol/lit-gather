//
// Shorten wallet address
// @param { String } wallet address
// @return { String } wallet address
//
export const shortenWalletAddress = (addr) => {
return addr.substring(0, 5) + '...' + addr.substring(addr.length - 4, addr.length);
}
