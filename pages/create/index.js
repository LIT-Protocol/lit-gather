import MainLayout from '../../components/Layout/MainLayout'
import { useEffect, useState } from 'react';
import LitJsSdk, { humanizeAccessControlConditions } from 'lit-js-sdk'
import DashboardLayout from '../../components/Layout/Dashboard';
import { Router, useRouter } from 'next/router';
import Btn from '../../components/Ui/Btn';
import { useAppContext } from '../../state/AppProvider';
import { CogIcon, PlusIcon } from '@heroicons/react/solid';
import { storedAuth, storedNetwork } from '../../utils/storage';
import { storeLockedSpaces } from '../../utils/fetch';
import { compileResourceId } from '../../utils/lit';
import { coordinatesStringToArray } from '../../utils/helper';
import SEOHeader from '../../components/SEO/SEOHeader';
import Loading from '../../components/Ui/Loading';

const create = () => {

    // -- prepare app context methods
    const appContext = useAppContext()
    const { openShareModal, isAuthed } = appContext.methods;

    // -- prepare
    const litNodeClient = new LitJsSdk.LitNodeClient()
    litNodeClient.connect()

    const router = useRouter();
    
    // -- state
    const [value, setValue] = useState(0); // integer state
    const [spaceId, setSpaceId] = useState(null)
    const [granted, setGranted] = useState(false)
    const [initialCoordinates, setInitialCoordinates] = useState("31,32");
    const [restrictedSpaces, setRestrictedSpaces] = useState([])

    // -- restricted coordinates form
    const [name, setName] = useState(null)
    const [topLeft, setTopLeft] = useState(null)
    const [bottomRight, setBottomRight] = useState(null)
    const [wallThickness, setWallThickness] = useState(0)
    const [accessControls, setAccessControls] = useState(null)

    // -- page state
    const [loaded, setLoaded] = useState(false)

    // -- use effect
    useEffect(() => {

        if( ! isAuthed() ){
            router.push('/')
            return;
        }

        setLoaded(true);

    }, []);

    // -- force update specifically for adding new row
    function forceRender(){
        setValue(value => value + 1); // update the state to force render
    }

    //
    // Add new restricted space
    // @return { void }
    //
    const onClickAddRestrictedArea = async () => {

        // -- prepare
        const accs = document.getElementById('form-accs').value;

        // -- validate
        if( ! name ){
            alert("❗ Name cannot be empty");
            return;
        }
        if( ! topLeft ){
            alert("❗ Top-Left cannot be empty");
            return;
        }
        if( ! bottomRight ){
            alert("❗ Bottom-Right cannot be empty");
            return;
        }
        if ( ! topLeft.includes(',') ){
            alert("❗ Invalid format for Top-Left");
            return;
        }
        if ( ! bottomRight.includes(',') ){
            alert("❗ Invalid format for Bottom-Right");
            return;
        }
        if( ! accs ){
            alert("❗ Access Control Conditions cannot be empty");
            return;
        }

        // -- validate and prepare humanised version of access control conditions
        let humanised;
        try{
            humanised = await LitJsSdk.humanizeAccessControlConditions({accessControlConditions: JSON.parse(accs)})
        }catch(e){
            alert("❗ Invalid access control conditions");
            return;
        }

        // -- execute
        const _restrictedSpaces = restrictedSpaces;

        _restrictedSpaces.push({
            name, 
            topLeft: topLeft.replaceAll(' ', ''),
            bottomRight: bottomRight.replaceAll(' ', ''),
            wallThickness: parseInt(wallThickness) || 0, 
            accessControls: accs,
            humanised
        })

        setRestrictedSpaces(_restrictedSpaces)

        forceRender()
    }

    //
    // Delete row
    // @param { Int } index
    // @return { void }
    //
    const onClickDeleteRow = (i) => {
        var _restrictedSpaces = restrictedSpaces;
        _restrictedSpaces = _restrictedSpaces.slice(0, i).concat(_restrictedSpaces.slice(i + 1, _restrictedSpaces.length))
        setRestrictedSpaces(_restrictedSpaces)
        forceRender()
    }

    // 
    // When access control conditions button is clicked
    // @return { void }
    // 
    const onOpenShareModal = async () => {
        openShareModal(document.getElementById('form-accs'))
    }

    //
    // Get compiled form data
    // @return { Object } 
    //
    const getCompiledData = async () => {

        const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: storedNetwork()})
        console.log("authSig: ", authSig)

        return {
            authSig,
            spaceId,
            initialCoordinates,
            restrictedSpaces
        }
    }


    //
    // Submit form
    // @return { void }
    //
    const onClickSubmit = async () => {
        console.log("onClick submit");

        // -- validate
        if( ! spaceId ){
            alert("❗ Gather Space ID cannot be empty")
            return
        }

        if( ! granted ){
            alert("❗ You must grant gather@litprotocol.com admin access")
            return
        }

        // -- prepare
        const compiledData = await getCompiledData();
        console.log("compiledData: ", compiledData)

        // -- sign all spaces
        compiledData.restrictedSpaces.forEach(async (space) => {

            // -- prepare
            const accessControlConditions = JSON.parse(space.accessControls);
            const chain = accessControlConditions[0].chain;
            const resourceId = compileResourceId(spaceId, space);

            // -- sign
            await litNodeClient.saveSigningCondition({
                accessControlConditions, 
                chain, 
                authSig: compiledData.authSig, 
                resourceId, 
                permanant: false,
            })
        })


        // -- store
        const stored = await storeLockedSpaces(compiledData);
        
        if(stored?.error){
            console.error("❗ Error:", stored.error)
            alert(stored.error);
            return;
        }

        if(stored?.success){
            console.log("✅ Store: ", stored)
            router.push('/dashboard');
        }

    }

    return (
        loaded ? <>
            <SEOHeader subtitle="Create New Space"/>
            <DashboardLayout>
            {/* === Left Side */}
            <div className="w-full mt-24">
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
                        1. Gather Space ID <span className='text-red'>*</span>
                        <a target="_blank" href="./instruction#1" className="ml-2 text-purple-text underline underline-offset-4">(Click here for instruction)</a>
                    </div>
                    <div className='mt-2'>
                        <input onChange={(e) => setSpaceId(e.target.value)} value={spaceId} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="form-id" type="text" placeholder="tXVe5OYt6nHS9Ey5/lit-protocol" />
                    </div>

                    {/* Step 2 */}
                    <div className="form-check mt-8">
                        <label className="text-white form-check-label inline-block" for="flexCheckDefault">
                            2. Grant <span className='text-purple-text'>gather@litprotocol.com</span> admin access <span className='text-red'>*</span>
                            <a target="_blank" href="./instruction#2" className="ml-2 text-purple-text underline underline-offset-4">(Click here for instruction)</a>
                        </label><br/>
                        <input onChange={(e) => setGranted(e.target.checked)} className="form-check-input  h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckDefault" /> I've granted Lit Protocol admin access to my gather space
                    </div>

                    {/* Step 3 */}
                    <div className='text-base text-white mt-8'>
                        3. Initial Coordinates 
                        <a target="_blank" href="./instruction#3" className="ml-2 text-purple-text underline underline-offset-4">(Click here for instruction)</a>
                    </div>
                    <div className='mt-2'>
                        <input onChange={(e) => setInitialCoordinates(e.target.value)} value={initialCoordinates} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="form-id" type="text" placeholder="31,32" />
                    </div>


                    {/* Step 3 */}
                    <div className='text-base text-white mt-7'>
                            4. Restricted Coordinates
                    </div>
                    <div className='mt-2'>

                    <div className='flex'>

                        {/* Input Form */}
                        <div className='w-96 mr-2 flex-none rounded-lg border border-lit-900 p-2'>
                            <div className='grid grid-cols-2'>
                                <div className='flex justify-start'><span className='my-auto pr-2'>Name:</span></div>
                                <div className=''>
                                    <input onChange={(e) => setName(e.target.value)} type="text" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' placeholder='eg. balcony'/>    
                                </div>
                            </div>
                            <div className='grid grid-cols-2 mt-2'>
                                <div className='flex justify-start'><span className='my-auto pr-2'>Top-Left:</span></div>
                                <div className=''>
                                    <input onChange={(e) => setTopLeft(e.target.value)} type="text" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' placeholder='44,34'/>    
                                </div>
                            </div>
                            <div className='grid grid-cols-2 mt-2'>
                                <div className='flex justify-start'><span className='my-auto pr-2'>Bottom-Right:</span></div>
                                <div className=''>
                                    <input onChange={(e) => setBottomRight(e.target.value)} type="text" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' placeholder='51,36'/>    
                                </div>
                            </div>
                            <div className='grid grid-cols-2 mt-2'>
                                <div className='flex justify-start'><span className='my-auto pr-2'>Wall Thickness:</span></div>
                                <div className=''>
                                    <input onChange={(e) => setWallThickness(e.target.value)} type="text" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' placeholder='2'/>    
                                </div>
                            </div>
                            <div className='grid grid-cols-2 mt-2'>
                                <div className='flex justify-start'><span className='my-auto pr-2'>Access Control Conditions:</span></div>
                                <div className='flex'>
                                    <input id="form-accs" onChange={(e) => setAccessControls(e.target.value)} type="text" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
                                    <div className='cursor-pointer' onClick={() => onOpenShareModal()}>
                                        <CogIcon className="w-6 ml-2 text-lit-100 hover:text-white transition ease-in"/>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-end'>
                                <button onClick={() => onClickAddRestrictedArea()} className={`text-white text-sm h-12 flex justify-center rounded-xl mt-2 ml-4 cursor-pointer transition transition-lit bg-lit-400 hover:bg-lit-400/.75`}>
                                    <div className='m-auto flex'>
                                        <PlusIcon className="w-6 ml-2"/>
                                        <span className="m-auto ml-2 text-sm mr-4">Add Restricted Area</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                        
                        {/* Results */}
                        <div className='w-full'>
                            {/* Table Headers */}
                            <div className='flex'>
                                <div className='w-full'>
                                    <div className='grid grid-cols-4 text-xs text-center'>
                                        <div className='bg-lit-900 rounded-tl flex justify-center'><span className='m-auto'>Name</span></div>
                                        <div className='bg-lit-900 flex justify-center'><span className='m-auto'>Top-Left</span></div>
                                        <div className='bg-lit-900 flex justify-center'><span className='m-auto'>Bottom-right</span></div>
                                        <div className='bg-lit-900 flex justify-center'><span className='m-auto'>Wall Thickness</span></div>
                                    </div>    
                                </div>
                                <div className='text-white text-center text-xs w-24 bg-black'>Action</div>
                            </div>

                            {/* Table Rows */}
                            {
                                restrictedSpaces.map((space, i) => {
                                    return (
                                        <div key={i} className='flex border border-lit-400 mt-2'>
                                            <div className='w-full '>
                                                <div className='grid grid-cols-4 text-sm text-center border-b border-lit-400'>
                                                    <div className=''>{ space.name }</div>
                                                    <div className=''>{ space.topLeft }</div>
                                                    <div className=''>{ space.bottomRight }</div>
                                                    <div className=''>{ space.wallThickness }</div>
                                                </div>
                                                <div className='bg-lit-400 text-xs text-center'>
                                                    { space.humanised }
                                                </div>
                                            </div>
                                            <div className='w-24 flex justify-center'>
                                                <div onClick={() => onClickDeleteRow(i) } className='w-full h-full flex justify-center text-white cursor-pointer m-auto bg-red px-2 py-1'><span className='m-auto'>Delete</span></div>
                                            </div>
                                        </div>
                                    )
                                })
                            }  
                        </div>
                    </div>

                        

                    </div>

                </div>
                {/* ===== ...Form Area ===== */}
                
                <div className='mt-8'>
                    <div onClick={() => onClickSubmit() } className='w-full bg-lit-400 px-2 py-2 rounded-full flex justify-center cursor-pointer hover:bg-lit-500 transition duration-300 ease-lit'>
                        <span className='m-auto'>Submit</span>
                    </div>
                </div>
            </div>
        </DashboardLayout>
        </> : <Loading/>
    );
}

export default create;

// ========== Next.js Hooks ==========

//
// Use Layout
//
create.getLayout = function getLayout(page) {
    return (
      <MainLayout>
        { page }
      </MainLayout>
    )
  }