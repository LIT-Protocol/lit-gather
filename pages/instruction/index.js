import MainLayout from '../../components/Layout/MainLayout'
import { useEffect } from 'react';
import LitJsSdk from 'lit-js-sdk'
import MaxWidth from '../../components/Layout/MaxWidth';

const Instruction = () => {

    // -- prepare
    const litNodeClient = new LitJsSdk.LitNodeClient()
    litNodeClient.connect()

    useEffect(() => {
        console.log("LitNodeClient: ", litNodeClient);
    }, []);

    return (
        <>
            <h1 className="leading-tight text-5xl text-white text-center mt-16">
            Instruction
            </h1>

            <div className='bg-lit-500 h-[1px] w-full mt-16'>

            </div>

            <MaxWidth>
                <div className="grid md:grid-cols-2 md:gap-28 grid-cols-1">
                    {/* === Left Side */}
                    <div id="instruction-1" className="w-full mt-12 pt-2">
                        <h1 className="leading-tight text-3xl text-white">
                        How to create a space within Gather.town
                        </h1>

                        {/* ===== Form Area ===== */}
                        <div className='mt-4'>

                            {/* Step 1 */}
                            <div className='text-base text-white mt-2 text-purple-text pr-36'>
                                <p>
                                She is shown instructions on how to create a space within Gather.  She is told to do that, and then come back to the Lit Gather website
                                </p>
                            </div>

                        </div>
                        {/* ===== ...Form Area ===== */}
                    </div>

                    {/* === Right Side === */}
                    <div className="w-full mt-14 pt-2">
                        <div className="rounded-lg overflow-hidden">
                            <video controls>
                                <source src="https://assets-global.website-files.com/60ca686c96b42034829a80d3/6181e2838f1b6a1e97422065_Gather%20Events%20020-025-transcode.mp4" type="video/mp4"></source>
                            </video>
                        </div>
                    </div>
                </div>
            </MaxWidth>
            <MaxWidth>
                <div className="grid md:grid-cols-2 md:gap-28 grid-cols-1">
                    {/* === Left Side */}
                    <div  id="instruction-2" className="w-full mt-12 pt-2">
                        <h1 className="leading-tight text-3xl text-white">
                        How to grant gather@litprotocol.com admin access to your gather space
                        </h1>

                        {/* ===== Form Area ===== */}
                        <div className='mt-4'>

                            {/* Step 1 */}
                            <div className='text-base text-white mt-2 text-purple-text pr-36'>
                                <p>
                                She is shown instructions on how to create a space within Gather.  She is told to do that, and then come back to the Lit Gather website
                                </p>
                            </div>

                        </div>
                        {/* ===== ...Form Area ===== */}
                    </div>

                    {/* === Right Side === */}
                    <div className="w-full mt-14 pt-2">
                        <div className="rounded-lg overflow-hidden">
                            <video controls>
                                <source src="https://assets-global.website-files.com/60ca686c96b42034829a80d3/60de1355907e2b42a571998f_lunch-transcode.mp4" type="video/mp4"></source>
                            </video>
                        </div>
                    </div>
                </div>
            </MaxWidth>
            <MaxWidth>
                <div className="grid md:grid-cols-2 md:gap-28 grid-cols-1">
                    {/* === Left Side */}
                    <div  id="instruction-3" className="w-full mt-12 pt-2">
                        <h1 className="leading-tight text-3xl text-white">
                        How to collect the x,y coordinates and wall thickness for the bounding box of her private space

                        </h1>

                        {/* ===== Form Area ===== */}
                        <div className='mt-4'>

                            {/* Step 1 */}
                            <div className='text-base text-white mt-2 text-purple-text pr-36'>
                                <p>
                                She is shown instructions on how to create a space within Gather.  She is told to do that, and then come back to the Lit Gather website
                                </p>
                            </div>

                        </div>
                        {/* ===== ...Form Area ===== */}
                    </div>

                    {/* === Right Side === */}
                    <div className="w-full mt-14 pt-2">
                        <div className="rounded-lg overflow-hidden">
                            <video controls>
                                <source src="https://assets-global.website-files.com/60ca686c96b42034829a80d3/60de409fbed90c0d4d13ee22_whiteboard-transcode.mp4" type="video/mp4"></source>
                            </video>
                        </div>
                    </div>
                </div>
            </MaxWidth>
        </>
    );
}

export default Instruction;

Instruction.getLayout = function getLayout(page) {
    return (
      <MainLayout>
        { page }
      </MainLayout>
    )
  }