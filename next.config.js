module.exports = {
  // reactStrictMode: true,
  images: {
    domains: ['litprotocol.com', 'gather.town'],
  },
  publicRuntimeConfig: {
    BACKEND_API: process.env.REACT_APP_LIT_GATEWAY_FRONTEND_API_URL
  }
}
