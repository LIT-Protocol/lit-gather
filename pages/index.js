import Modal from 'react-modal'
import MainLayout from '../components/Layout/MainLayout'
import SEOHeader from '../components/SEO/SEOHeader'

Modal.setAppElement('#__next')

const Home = () => {
  return (
    <SEOHeader/>
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