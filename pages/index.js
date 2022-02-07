import { useRouter } from 'next/router'
import Modal from 'react-modal'
import Image from 'next/image'

import styles from '../styles/Home.module.css'
import HeaderLink from '../components/HeaderLink'
import { useEffect } from 'react'
import LayoutHeader from '../components/Layout/Header'
import SEOHeader from '../components/SEO/SEOHeader'

Modal.setAppElement('#__next')

export default function Home() {

  const router = useRouter();
  
  return (
    <>
      <SEOHeader/>
      <LayoutHeader />      
    </>
  )
}
