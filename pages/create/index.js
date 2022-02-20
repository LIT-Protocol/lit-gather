import MainLayout from '../../components/Layout/MainLayout'
import { useEffect, useState } from 'react';
import LitJsSdk, { humanizeAccessControlConditions } from 'lit-js-sdk'
import DashboardLayout from '../../components/Layout/Dashboard';
import { useRouter } from 'next/router';
import Btn from '../../components/Ui/Btn';
import { useAppContext } from '../../state/AppProvider';
import { CogIcon, PlusIcon } from '@heroicons/react/solid';
import { storedAuth, storedNetwork } from '../../utils/storage';
import { storeLockedSpaces } from '../../utils/fetch';

const create = () => {

    const router = useRouter()

    // -- prepare app context methods
    const appContext = useAppContext()
    const { openShareModal } = appContext.methods;
    const { connectedWalletAddress } = appContext.state;

    // -- prepare
    const litNodeClient = new LitJsSdk.LitNodeClient()
    litNodeClient.connect()
    
    // -- state
    const [value, setValue] = useState(0); // integer state
    const [spaceId, setSpaceId] = useState('tXVe5OYt6nHS9Ey5/lit-protocol')
    const [granted, setGranted] = useState(true)
    const [initialCoordinates, setInitialCoordinates] = useState("31, 32");
    const [restrictedSpaces, setRestrictedSpaces] = useState([
        {
            name: 'test-space',
            topLeft: '44,34',
            bottomRight: '51,36',
            wallThickness: 0,
            accessControls: '[{"contractAddress":"","standardContractType":"","chain":"ethereum","method":"","parameters":[":userAddress"],"returnValueTest":{"comparator":"=","value":"0xDDaA68B3604a4550582f5E05Aab16C852eF3e3bC"}}]',
            humanised: 'Controls wallet with address  0xDDaA68B3604a4550582f5E05Aab16C852eF3e3bC'
        }
    ])

    // -- restricted coordinates form
    const [name, setName] = useState(null)
    const [topLeft, setTopLeft] = useState(null)
    const [bottomRight, setBottomRight] = useState(null)
    const [wallThickness, setWallThickness] = useState(null)
    const [accessControls, setAccessControls] = useState(null)

    // -- use effect
    useEffect(() => {
        console.log("LitNodeClient: ", litNodeClient);
    }, []);

    // -- force update specifically for adding new row
    function forceUpdate(){
        setValue(value => value + 1); // update the state to force render
    }

    //
    // Add new restricted space
    // @return { void }
    //
    const onClickAddRestrictedSpace = async () => {

        // -- prepare
        const accs = document.getElementById('form-accs').value;
        const humanised = await LitJsSdk.humanizeAccessControlConditions({accessControlConditions: JSON.parse(accs)})
        var _restrictedSpaces = restrictedSpaces;
        _restrictedSpaces.push({name, topLeft, bottomRight, wallThickness, accessControls: accs, humanised})
        setRestrictedSpaces(_restrictedSpaces)
        forceUpdate()
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
        forceUpdate()
    }

    // 
    // When access control conditions button is clicked
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
            alert("Gather Space ID cannot be empty")
            return
        }
        if( ! granted ){
            alert("You must grant Lit Protocol admin access")
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
            const resourceId = {
                baseUrl: 'gather.town',
                path: '/app/' + spaceId.split('/')[0] + '/' + spaceId.split('/')[1],
                orgId: "",
                role: "",
                extraData: JSON.stringify({
                    name: space.name,
                    topLeft: space.topLeft,
                    bottomRight: space.bottomRight,
                    wallThickness: space.wallThickness,
                }),
            }

            // console.log("resourceId:", resourceId);

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
        const store = await storeLockedSpaces(compiledData);

        console.log("Store: ", store)
    }

    return (
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
                        <a target="_blank" href="./instruction#how-to-create-a-space-within-gather" className="ml-2 text-purple-text underline underline-offset-4">(Click here for instruction)</a>
                    </div>
                    <div className='mt-2'>
                        <input onChange={(e) => setSpaceId(e.target.value)} value={spaceId} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="form-id" type="text" placeholder="tXVe5OYt6nHS9Ey5/lit-protocol" />
                    </div>

                    {/* Step 2 */}
                    <div className="form-check mt-8">
                        <label className="text-white form-check-label inline-block" for="flexCheckDefault">
                            2. Grant Lit Protocol admin access <span className='text-red'>*</span>
                            <a target="_blank" href="./instruction#how-to-grant-admin-access" className="ml-2 text-purple-text underline underline-offset-4">(Click here for instruction)</a>
                        </label><br/>
                        <input onChange={(e) => setGranted(e.target.checked)} className="form-check-input  h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckDefault" /> I've granted Lit Protocol admin access to my gather space
                    </div>

                    {/* Step 3 */}
                    <div className='text-base text-white mt-8'>
                        3. Initial Coordinates 
                        <a target="_blank" href="./instruction#how-to-create-a-space-within-gather" className="ml-2 text-purple-text underline underline-offset-4">(Click here for instruction)</a>
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
                                    <input onChange={(e) => setWallThickness(e.target.value)} type="text" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' placeholder='0'/>    
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
                                <button onClick={() => onClickAddRestrictedSpace()} className={`text-white text-sm h-12 flex justify-center rounded-xl mt-2 ml-4 cursor-pointer transition transition-lit bg-lit-400 hover:bg-lit-400/.75`}>
                                    <div className='m-auto flex'>
                                        <PlusIcon className="w-6 ml-2"/>
                                        <span className="m-auto ml-2 text-sm mr-4">Add Restricted Space</span>
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