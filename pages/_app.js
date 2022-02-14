import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  
  // get layout from component or use default
  const getLayout = Component.getLayout || ((page) => page)
  
  return getLayout(
      <Component {...pageProps} />
  )

}

export default MyApp
