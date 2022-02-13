import Modal from 'react-modal'
import MainLayout from '../components/Layout/MainLayout'
import Intro from '../components/Section/Intro'
import SEOHeader from '../components/SEO/SEOHeader'

Modal.setAppElement('#__next')

const Home = () => {
  return (
    <>
      <SEOHeader/>
      <Intro></Intro>
    </>
  )
}

export default Home;

Home.getLayout = function getLayout(page) {
  return (
    <MainLayout>
      { page }
    </MainLayout>
  )
}