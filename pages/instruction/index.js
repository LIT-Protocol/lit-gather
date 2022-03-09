import { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout'
import MaxWidth from '../../components/Layout/MaxWidth';
import SEOHeader from '../../components/SEO/SEOHeader';

const Instruction = () => {

    // -- mounted
    const [instructions, setInstructions] = useState([
        {
            id: 1,
            title: 'How to create a space within Gather.town',
            steps: [
                'Go to "My Spaces"',
                'Enter to your space',
                'Copy the Gather Space ID from your URL eg. kMY0MBgjUhkuNb9k/test2',
            ],
            images: [
                '/instruction/1a.png',
            ]
        },
        {
            id: 2,
            title: 'How to grant gatheradmin@litprotocol.com admin access to your gather space',
            steps: [
                'Go to "My Spaces"',
                'Click the 3 vertically-aligned dots next to your space thumbnail, and click on "Manage Space"',
                'On the side of the menu, click "User Roles"',
                'Under the "Add Members" field, type "gatheradmin@litprotocol.com" and click "Add"',
                'Once it\'s been added, under "Manage Members", click on the 3 vertically-aligned dots and click on "Edit roles", check "Admin" role and "Apply"',
            ],
            images: [
                '/instruction/2a.png',
                '/instruction/2b.png',
            ]
        },
        {
            id: 3,
            title: 'How to collect the x,y coordinates for the bounding box of her private space',
            steps: [
                'Go to "My Spaces"',
                'Click the 3 vertically-aligned dots next to your space thumbnail, and click on "Edit Map"',
                'Use your mouse cursor to hover to the top-left cornor of your private space, then record the coordinates shown on the bottom right',
                'Repeat the same step above but for the bottom-right cornor of your private space'
            ],
            images: [
                '/instruction/3a.png',
                '/instruction/3b.png',
            ]
        }
    ]);

    return (
        <>
            <SEOHeader subtitle="Instruction"/>
            <h1 className="leading-tight text-5xl text-white text-center mt-16">Instruction</h1>

            {/* --- titles --- */}
            <ul className='text-white max-w-[623px] m-auto mt-4 list-decimal list-outside'>
                {
                    instructions.map((info) => {
                        return (
                            <li key={info.id} className='pt-3 hover:text-lit-400 transition ease-in'>
                                <a href={`#${info.id}`}>{info.title}</a>    
                            </li>
                        )
                    })
                }
            </ul>

            <div className='bg-lit-500 h-[1px] w-full mt-16'></div>

            {
                instructions.map((info) => {
                    
                    return (
                        <MaxWidth key={info.id}>
                            <div id={info.id} className="grid grid-cols-1">
                                {/* === Left Side */}
                                <div className="w-full mt-12 pt-10">
                                    <h1 className="leading-tight text-3xl text-white">
                                    {info.id}. { info.title }
                                    </h1>
            
                                    {/* ===== Form Area ===== */}
                                    <div className='mt-4'>
            
                                        {/* Step 1 */}
                                        <div className='text-base text-white mt-2 text-purple-text pr-12'>
                                            <p>
                                            <ul className='list-decimal list-outside pl-5'>
                                            {
                                                info.steps.map((step) => {
                                                    return (
                                                        <li key={step}>{ step }</li>
                                                    )
                                                })
                                            }
                                            </ul>
                                            </p>
                                        </div>
            
                                    </div>
                                    {/* ===== ...Form Area ===== */}
                                </div>
            
                                {/* === Right Side === */}
                                <div className="w-full mt-10 pt-2">
                                    {
                                        info.images.map((image) => {
                                            return (
                                                <div key={image} className="mt-4 rounded-lg overflow-hidden">
                                                    <img src={image} alt="" />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </MaxWidth>
                    ) 
                })
            }
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