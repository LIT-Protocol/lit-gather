import MainLayout from '../components/Layout/MainLayout'
import { useEffect } from 'react';
import LitJsSdk from 'lit-js-sdk'

const create = () => {

    // -- prepare
    const litNodeClient = new LitJsSdk.LitNodeClient()
    litNodeClient.connect()

    useEffect(() => {
        console.log("LitNodeClient: ", litNodeClient);
    }, []);

    return (
        <div>
            Enter
        </div>
    );
}

export default create;

create.getLayout = function getLayout(page) {
    return (
      <MainLayout>
        { page }
      </MainLayout>
    )
  }