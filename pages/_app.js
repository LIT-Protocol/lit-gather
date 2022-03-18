import '../styles/globals.css'
import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as ga from '../utils/ga'

//Binding events. 
Router.events.on('routeChangeStart', () => NProgress.start()); Router.events.on('routeChangeComplete', () => NProgress.done()); Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {

  const router = useRouter()

  useEffect(() => {

    const handleRouteChange = (url) => {
      console.log("Handle Router Change:", url);
      ga.pageview(url)
    }

    // When the component is mounted, subscribe to router changes
    // and log those page views
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  
  // get layout from component or use default
  const getLayout = Component.getLayout || ((page) => page)
  
  return getLayout(
      <Component {...pageProps} />
  )

}

export default MyApp
