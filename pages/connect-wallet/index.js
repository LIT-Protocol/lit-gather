import { LIT_CHAINS } from 'lit-js-sdk'
import { useRouter, withRouter } from 'next/router'
import { useEffect } from 'react'
import Modal from 'react-modal'
import LayoutHeader from '../../components/Layout/Header'
import SEOHeader from '../../components/SEO/SEOHeader'

Modal.setAppElement('#__next')

const Connect = () => {
    const router = useRouter()

    useEffect(() => {
    router.prefetch('/')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // 
    // Event:: When a network is chosen
    // @param { String } string
    // @return { void } 
    //
    const onClickNetwork = async (chain) => {
        console.log(chain);
    }


    return (
        <>
            <SEOHeader subtitle="Connect Wallet" />
            <LayoutHeader/>
            <Modal
                isOpen={true} // The modal should always be shown on page load, it is the 'page'
                onRequestClose={() => router.push('/')}
                contentLabel="Connect Wallet"
                className="Modal-Connect-Wallet bg-base-main rounded-3xl"
            >
                <h1 className="text-white text-h1">Connect Wallet</h1>
                
                <div className="overflow-auto">
                    <h2 className="text-white text-base mt-4 flex justify-start">
                        <div className="rounded-full w-6 text-xs bg-orange bg-lit-400 text-center flex justify-center">
                            <span class="m-auto">1</span>
                        </div>
                        <div className="ml-2 m-t-auto my-auto">Choose Network</div>
                    </h2>
                    
                    <div className="mt-4 grid grid-cols-5">
                        { Object.keys(LIT_CHAINS).map((chain, i) => {
                            
                            return (<>
                                <div onClick={() => onClickNetwork(chain)} className="block cursor-pointer hover:bg-lit-400 rounded-2xl py-2 border-box">
                                    <div className={`rounded-full w-12 h-12 flex m-auto bg-color-${chain}`}>
                                        <div className="m-auto w-full h-full p-3 box-border">
                                            <div className={`w-full h-full bg-image-${chain} bg-contain`}></div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-white m-auto flex justify-center">
                                        <span className="mt-1 capitalize">{chain}</span>
                                    </div>
                                </div>
                            </>)
                        }) }
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default Connect