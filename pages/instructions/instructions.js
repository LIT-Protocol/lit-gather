import { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout'
import MaxWidth from '../../components/Layout/MaxWidth';
import SEOHeader from '../../components/SEO/SEOHeader';

const Instruction = () => {

    // -- mounted
    const [instructions, setInstructions] = useState({
        title: 'Instruction',
        data: [
            {
                id: 1,
                title: 'Copy your Gather space ID',
                steps: [
                    'Go to "My Spaces"',
                    'Enter to your space you would like to add access control to',
                    'Copy the Gather Space ID from your URL eg. kMY0MBgjUhkuNb9k/test2',
                ],
                images: [
                    '/instruction/1a.png',
                ]
            },
            {
                id: 2,
                title: 'Grant gatheradmin@litprotocol.com admin access',
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
                title: 'Select a default map to be spawned into',
                steps: [
                    'Go to "My Spaces"',
                    'Click the 3 vertically-aligned dots next to your space thumbnail, and click on "Edit Map"',
                    'On the right side-panel, copy the name of the chosen default room, eg. "tavern-main"',
                ],
                images: [
                    '/instruction/3a.png',
                    '/instruction/3b.png',
                ]
            },
            {
                id: 4,
                title: 'Determine (X ,Y) coordinates',
                steps: [
                    'Go to "My Spaces"',
                    'Click the 3 vertically-aligned dots next to your space thumbnail, and click on "Edit Map"',
                    'Use your mouse cursor to hover to the top-left cornor of your private space, then record the coordinates shown on the bottom right',
                    'Repeat the same step above but for the bottom-right cornor of your private space'
                ],
                images: [
                    '/instruction/4a.png',
                    '/instruction/4b.png',
                ]
            },
            {
                id: 5,
                title: 'Unlocking restricted areas in-game',
                steps: [
                    `On this website, go to "Dashboard" > "My Spaces"`,
                    'Click on the cogwheel icon at the top-right of your chosen space, and click "Copy in-game link"',
                    'Go to app.gather.town/app website and go to "My Spaces"',
                    'Click the 3 vertically-aligned dots next to your space thumbnail, and click on "Edit Map"',
                    'Go to "More Objects" > "Upload New (bottom-left)" > "Upload image"',
                    'Click "Embedded website" and paste your in-game link in the "Website(URL)" field',
                    'Click "Select" and place your image anywhere outside the restricted areas',
                    'Users will now be able to request access in-game by interacting this object',
                ],
                images: [
                    '/instruction/5a.png',
                    '/instruction/5b.png',
                    '/instruction/5c.png',
                    '/instruction/5d.png',
                    '/instruction/5e.png',
                ]
            },
        ]
    });

    return (
        <>
            <SEOHeader subtitle="Instruction"/>
            <h1 className="leading-tight text-5xl text-white text-center mt-16">{ instructions.title }</h1>

            {/* --- titles --- */}
            <ul className='text-white max-w-[623px] m-auto mt-4 list-decimal list-outside'>
                {
                    instructions.data.map((info) => {
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
                instructions.data.map((info) => {
                    
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
                                        <div className='text-base text-[rgba(158,119,243,1)] mt-2 text-purple-text pr-12'>
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