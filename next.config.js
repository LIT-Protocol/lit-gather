module.exports = {
  // reactStrictMode: true,
  images: {
    domains: ['litprotocol.com', 'gather.town'],
  },
  publicRuntimeConfig: {
    BACKEND_API: process.env.REACT_APP_LIT_GATEWAY_FRONTEND_API_URL,
    HOST: process.env.REACT_APP_LIT_GATEWAY_FRONTEND_HOST,
    ENV: process.env.REACT_APP_LIT_GATEWAY_ENVIRONMENT,
    LIT_OG_NFT_TOKEN_ADDRESS: process.env.REACT_APP_LIT_GATEWAY_LIT_OG_NFT_TOKEN_ADDRESS,
    REACT_APP_LIT_GATEWAY_DISCORD_CLIENT_ID: process.env.REACT_APP_LIT_GATEWAY_DISCORD_CLIENT_ID,
  }
}
