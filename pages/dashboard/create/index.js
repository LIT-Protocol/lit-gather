import MainLayout from '../../../components/Layout/MainLayout'
import { useEffect } from 'react';
import LitJsSdk from 'lit-js-sdk'
import MaxWidth from '../../../components/Layout/MaxWidth';

const create = () => {

    // -- prepare
    const litNodeClient = new LitJsSdk.LitNodeClient()
    litNodeClient.connect()

    useEffect(() => {
        console.log("LitNodeClient: ", litNodeClient);
    }, []);

    return (
        <MaxWidth>
            <div className="grid md:grid-cols-2 md:gap-28 grid-cols-1">
                {/* === Left Side */}
                <div className="w-full mt-24 pt-2">
                    <h1 className="leading-tight text-5xl text-white">
                       Create New Space
                    </h1>

                    {/* ===== Form Area ===== */}
                    <div className='mt-4'>
                        <div className='text-purple-text text-sm'>
                            <span className='text-red'>*</span> Required fields
                        </div>

                        {/* Step 1 */}
                        <div className='text-base text-white mt-2'>
                            Gather Space ID  <span className='text-red'>*</span>
                        </div>
                        <div className='mt-2'>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="form-id" type="text" placeholder="tXV...y5" />
                        </div>

                        {/* Step 2 */}
                        {/* <div className="form-check mt-8">
                            <input class="form-check-input  h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckDefault" />
                                <label class="text-white form-check-label inline-block" for="flexCheckDefault">
                                I've granted <a href="#" className="text-purple-text underline underline-offset-4">gather@litprotocol.com</a> admin access <br/>to my gather space <span className='text-red'>*</span>
                            </label>
                        </div> */}


                    </div>
                    {/* ===== ...Form Area ===== */}
                </div>

                {/* === Right Side === */}
                <div className="w-full mt-20 pt-1">
                    <div className="rounded-lg overflow-hidden">
                        <video controls>
                            <source src="https://assets-global.website-files.com/60ca686c96b42034829a80d3/6181e2838f1b6a1e97422065_Gather%20Events%20020-025-transcode.mp4" type="video/mp4"></source>
                        </video>
                    </div>
                </div>
            </div>
        </MaxWidth>
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