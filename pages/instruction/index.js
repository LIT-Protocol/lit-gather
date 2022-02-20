import MainLayout from '../../components/Layout/MainLayout'
import { useEffect } from 'react';
import LitJsSdk from 'lit-js-sdk'
import MaxWidth from '../../components/Layout/MaxWidth';
import Image from 'next/image'

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
                <div className="grid grid-cols-1">
                    {/* === Left Side */}
                    <div id="1" className="w-full mt-12 pt-10">
                        <h1 className="leading-tight text-3xl text-white">
                        1. How to create a space within Gather.town
                        </h1>

                        {/* ===== Form Area ===== */}
                        <div className='mt-4'>

                            {/* Step 1 */}
                            <div className='text-base text-white mt-2 text-purple-text pr-12'>
                                <p>
                                <ul className='list-decimal list-outside pl-5'>
                                    <li>Go to "My Spaces"</li>
                                    <li>Enter to your space</li>
                                    <li>Copy the Gather Space ID from your URL eg. kMY0MBgjUhkuNb9k/test2</li>
                                </ul>
                                </p>
                            </div>

                        </div>
                        {/* ===== ...Form Area ===== */}
                    </div>

                    {/* === Right Side === */}
                    <div className="w-full mt-14 pt-2">
                        <div className="rounded-lg overflow-hidden">
                            <img src="/instruction/1a.png"/>
                        </div>
                    </div>
                </div>
            </MaxWidth>
            <MaxWidth>
                <div className="grid grid-cols-1">
                    {/* === Left Side */}
                    <div id="2" className="w-full mt-12 pt-10">
                        <h1 className="leading-tight text-3xl text-white">
                        2. How to grant gather@litprotocol.com admin access to your gather space
                        </h1>

                        {/* ===== Form Area ===== */}
                        <div className='mt-4'>

                            {/* Step 1 */}
                            <div className='text-base text-white mt-2 text-purple-text pr-12'>
                                <p>
                                <ul className='list-decimal list-outside pl-5'>
                                    <li>Go to "My Spaces"</li>
                                    <li>Click the 3 vertically-aligned dots next to your space thumbnail, and click on "Manage Space"</li>
                                    <li>On the side of the menu, click "User Roles"</li>
                                    <li>Under the "Add Members" field, type "gather@litprotocol.com" and click "Add"</li>
                                    <li>Once it's been added, under "Manage Members", click on the 3 vertically-aligned dots and click on "Edit roles", check "Admin" role and "Apply"</li>
                                </ul>
                                </p>
                            </div>

                        </div>
                        {/* ===== ...Form Area ===== */}
                    </div>

                    {/* === Right Side === */}
                    <div className="w-full mt-14 pt-2">
                        <div className="rounded-lg overflow-hidden">
                            <img src="/instruction/2a.png"/>
                        </div>
                        <div className="mt-4 rounded-lg overflow-hidden">
                            <img src="/instruction/2b.png"/>
                        </div>
                    </div>
                </div>
            </MaxWidth>
            <MaxWidth>
                <div className="grid grid-cols-1 mb-24">
                    {/* === Left Side */}
                    <div id="3" className="w-full mt-12 pt-10">
                        <h1 className="leading-tight text-3xl text-white">
                        3. How to collect the x,y coordinates and wall thickness for the bounding box of her private space
                        </h1>

                        {/* ===== Form Area ===== */}
                        <div className='mt-4'>

                            {/* Step 1 */}
                            <div className='text-base text-white mt-2 text-purple-text pr-12'>
                                <p>
                                <ul className='list-decimal list-outside pl-5'>
                                    <li>Go to "My Spaces"</li>
                                    <li>Click the 3 vertically-aligned dots next to your space thumbnail, and click on "Edit Map"</li>
                                    <li>Use your mouse cursor to hover to the top-left cornor of your private space, then record the coordinates shown on the bottom right</li>
                                    <li>Repeat the same step above but for the bottom-right cornor of your private space</li>
                                    <li>Get the wall thickness for the bounding box</li>
                                </ul>
                                </p>
                            </div>

                        </div>
                        {/* ===== ...Form Area ===== */}
                    </div>

                    {/* === Right Side === */}
                    <div className="w-full mt-14 pt-2">
                        <div className="rounded-lg overflow-hidden">
                            <img src="/instruction/3a.png"/>
                        </div>
                        <div className="mt-4 rounded-lg overflow-hidden">
                            <img src="/instruction/3b.png"/>
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