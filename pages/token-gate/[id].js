import MainLayout from '../../components/Layout/MainLayout'
import { useEffect, useState } from 'react';
import LitJsSdk from 'lit-js-sdk'
import DashboardLayout from '../../components/Layout/Dashboard';
import { useRouter } from 'next/router';
import { useAppContext } from '../../state/AppProvider';
import { storedNetwork } from '../../utils/storage';
import { fetchMySpaces, fetchSpace, storeLockedSpaces } from '../../utils/fetch';
import { compileResourceId } from '../../utils/lit';
import SEOHeader from '../../components/SEO/SEOHeader';
import Loading from '../../components/Ui/Loading';
import ImageUploader from '../../components/ImageUploader';
import ProgressContent from '../../components/Section/ProgressContent';
import ProgressImage from '../../components/Ui/ProgressImage';
import LitSwitch from '../../components/Ui/LitSwitch';

const TokenGate = () => {

    // -- prepare app context methods
    const appContext = useAppContext()
    const { openShareModal, isAuthed } = appContext.methods;

    // -- prepare
    const litNodeClient = new LitJsSdk.LitNodeClient()
    litNodeClient.connect()
    
    // -- state
    const [value, setValue] = useState(0); // integer state
    const [spaceId, setSpaceId] = useState('')
    const [initialMap, setInitialMap] = useState('');
    const [initXCoor, setInitXCoor] = useState()
    const [initYCoor, setInitYCoor] = useState()
    const [restrictedSpaces, setRestrictedSpaces] = useState([])
    const [isPrivate, setIsPrivate] = useState(false)
    const [currentSpace, setCurrentSpace] = useState(null);

    // -- exclusive to edit mode
    const router = useRouter();
    const { id } = router.query;
    const [editMode, setEditMode] = useState(false);
    const [space, setSpace] = useState('');

    // -- restricted coordinates form
    const [name, setName] = useState(null)
    const [map, setMap] = useState('')
    const [topLeftX, setTopLeftX] = useState(null)
    const [topLeftY, setTopLeftY] = useState(null)
    const [bottomRightX, setBottomRightX] = useState(null)
    const [bottomRightY, setBottomRightY] = useState(null)
    const [accessControls, setAccessControls] = useState(null)
    const [thumbnail, setThumbnail] = useState(null);

    // -- page state
    const [loaded, setLoaded] = useState(false)

    // -- use effect
    useEffect(() => {
        
        if( ! isAuthed() ){
            router.push('/')
            return;
        }

        console.warn("ID: ", id);

        // ===== Edit Mode =====
        // -- Edit mode: has { id } param 
        if( id ){
            console.warn("-- Edit Mode --");

            // 
            // Filter the space out of all spaces
            //
            const getSpace = async () => {
                
                const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: storedNetwork()});
                const res = await fetchMySpaces({authSig});
                const _space = (res.spaces.filter((space) => space.id == id))[0];

                if(! _space ){
                    alert("❗You are not authorised to access this space.");
                    router.push('/dashboard');
                    return;
                }

                let _spaceId = _space.spaceId.replaceAll(' ', '%20')

                setSpace(_space)

                // -- set states
                setSpaceId(_spaceId);
                setIsPrivate(_space.private);
                setThumbnail(_space.thumbnailUrl);
                setInitialMap(_space.initialMap);
                setInitXCoor(_space.initialCoordinates.split(',')[0])
                setInitYCoor(_space.initialCoordinates.split(',')[1])
                setRestrictedSpaces(JSON.parse(_space.restrictedSpaces));

                return _space;
                
            }

            if( ! space ){
                getSpace();
            }

            setEditMode(true);
            setLoaded(true);
        
            return;
        }

        // ===== Default Mode =====
        setEditMode(false);
        setLoaded(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, space]);

    // -- force update specifically for adding new row
    function forceRender(){
        setValue(value => value + 1); // update the state to force render
    }

    //
    // Translate access control conditions to humanised version
    // @param { Array } access control conditions
    //
    const getHumanised = async (accs) => {
        let humanised;
        let toBeHumanised = JSON.parse(accs).accessControlConditions;
        console.log("TRY HUMANISING:", toBeHumanised);

        try{
            humanised = await LitJsSdk.humanizeAccessControlConditions({accessControlConditions: toBeHumanised})
        }catch(e){
            console.error("ERROR:", e);
            alert("❗ Invalid access control conditions");
            return;
        }

        return humanised;
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
        if( ! map ){
            alert("❗ map cannot be empty");
            return;
        }
        if( ! topLeftX ){
            alert("❗ Top-LeftX cannot be empty");
            return;
        }
        if( ! topLeftY ){
            alert("❗ Top-LeftY cannot be empty");
            return;
        }
        if( ! bottomRightX ){
            alert("❗ Bottom-RightX cannot be empty");
            return;
        }
        if( ! bottomRightY ){
            alert("❗ Bottom-RightY cannot be empty");
            return;
        }
        if( ! accs ){
            alert("❗ Access Control Conditions cannot be empty");
            return;
        }

        // -- validate and prepare humanised version of access control conditions
        const humanised = await getHumanised(accs)

        // -- execute
        const _restrictedSpaces = restrictedSpaces;

        console.log("topLeftX + ',' + topLeftY:", topLeftX + ',' + topLeftY);

        _restrictedSpaces.push({
            name, 
            map: map.trimEnd(),
            topLeft: topLeftX + ',' + topLeftY,
            bottomRight: bottomRightX + ',' + bottomRightY,
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
        openShareModal(document.getElementById('form-accs'), (accessControlConditions) => {
            console.warn("onOpenShareModal!");
            onClickAddRestrictedArea()
        });
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
            spaceId: decodeURIComponent(spaceId),
            initialMap,
            initialCoordinates: initXCoor + ',' + initYCoor,
            restrictedSpaces,
            isPrivate,
            thumbnailUrl: thumbnail || 'https://ipfs.io/ipfs/QmQbRchcTsjcds8iz8BXwSAUvsvX3wN5XhteLMGgqM4TCa',
        }
    }


    //
    // Submit form
    // @return { void }
    //
    const onSubmit = async () => {

        // -- validate
        if( ! spaceId || spaceId == ''){
            alert("❗ Gather Space ID cannot be empty")
            return
        }

        // -- validate if slash '/' is included in the space id
        if( ! spaceId.includes('/') ){
            alert("❗ Gather Space ID format is wrong. Did you include a '/' in your space id?");
            return;
        }

        // -- prepare
        const compiledData = await getCompiledData();
        console.log("compiledData: ", compiledData);

        // -- sign all spaces
        compiledData.restrictedSpaces.forEach(async (space) => {

            // -- prepare
            const accessControlConditions = JSON.parse(space.accessControls).accessControlConditions;

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
        const stored = await storeLockedSpaces(compiledData, !editMode ? 'add' : 'update');
        
        if(stored?.error){
            console.error("❗ Error:", stored.error)
            alert(stored.error);
            return;
        }

        console.warn("Stored: ", stored);

        setCurrentSpace(stored.data);
        if(stored?.success){
            console.log("✅ Store: ", stored);
        }
        
        return;

    }

    return (
        !loaded
        ? <Loading/> : 
        <>
            <SEOHeader subtitle="Add access control"/>
            <DashboardLayout>
                <div className="w-full">
                    {/* Edit Mode: { editMode ? 'Yes' : 'No'} */}
                    {/* ===== Progress Content ===== */}
                    <ProgressContent steps={[

                        // ========== Step 1 ==========
                        {
                            content: 
                            <>
                                <ProgressImage src="/steps/1.png"/>
    
                                {/* ----- Form Area ----- */}
                                <div className="w-full ml-12">
                                    <div className='text-base text-white mt-2'>
                                        Gather Space ID 
                                    </div>
                                    <div className='mt-2'>
                                        <input disabled={editMode} onChange={(e) => setSpaceId(e.target.value)} value={spaceId} className="shadow appearance-none border border-grey-main rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-black placeholder:text-grey-main" type="text" placeholder="tXVe5OYt6nHS9Ey5/lit-protocol" />
                                    </div>

                                    <div className='text-base text-white mt-7'>
                                        
                                        <span>
                                        Display this space on our explore page
                                        </span>
                                        
                                        <LitSwitch checked={!isPrivate} onChange={() => setIsPrivate(!isPrivate)}  />
                                    </div>
    
                                    <div className='text-base text-white mt-6'>
                                       Add a thumbnail image (Please wait until the image appears)
                                    </div>

                                    <ImageUploader
                                        onUploaded={(imagePath) => setThumbnail(imagePath)}
                                        onCancelled={() => setThumbnail(null)}
                                        defaultImage={space.thumbnailUrl}
                                    />
    
    
                                </div>
                            </>,
                            onNext: (next) => {
                                // -- validate
                                if( ! spaceId || spaceId == ''){
                                    alert("❗ Gather Space ID cannot be empty")
                                    return
                                }

                                // -- validate if slash '/' is included in the space id
                                if( ! spaceId.includes('/') ){
                                    alert("❗ Gather Space ID format is wrong. Did you include a '/' in your space id?");
                                    return;
                                }
                                next?.callback()
                            }
                        },

                        // ========== Step 2 ==========
                        {
                            content:
                            <>
                                <ProgressImage 
                                    src="/steps/2b.png"
                                />
    
                                {/* ----- Form Area ----- */}
                                <div className="w-full ml-12">
                                    <div className='text-base text-white mt-2'>
                                        Go to Manage Space
                                    </div>
    
                                    <div className='text-base text-white mt-12'>
                                        Add this email as an admin account
                                    </div>
                                    <div className='mt-2'>
                                        <pre className="shadow appearance-none border border-grey-main rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-black placeholder:text-grey-main text-sm">
                                            <code>
                                            gatheradmin@litprotocol.com
                                            </code>
                                        </pre>
                                    </div>
    
                                </div>
                            </>,
                        },

                        // ========== Step 3 ==========
                        {
                            content:
                            <>
                                <ProgressImage 
                                    src="/steps/3b.png"
                                />
    
                                {/* ----- Form Area ----- */}
                                <div className="w-full ml-12">
                                    <div className='text-base text-white mt-2'>
                                        Go to Edit Map
                                    </div>
                                    
                                    <div className='text-base text-white mt-12'>
                                        Choose a room for visitors to spawn at
                                    </div>
                                    <div className='mt-2'>
    
                                        <input onChange={(e) => setInitialMap(e.target.value)} value={initialMap} className="shadow appearance-none border border-grey-main rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-black placeholder:text-grey-main" type="text" placeholder="Default Map" />
                                    </div>
    
                                    <div className='text-base text-white mt-7'>
                                        Coordinates for visitors to spawn at
                                    </div>
                                    <div className='text-base text-grey-text italic mt-1'>
                                        Select a location outside of the token gated area
                                    </div>
                                    <div className='mt-2 flex gap-12'>
    
                                        <div className="flex">
                                            <div className="my-auto">X:</div>
                                            <input onChange={(e) => setInitXCoor(e.target.value)} value={initXCoor} className="ml-4 shadow appearance-none border border-grey-main rounded w-full py-2 px-3 text-white placeholder:italic leading-tight focus:outline-none focus:shadow-outline bg-black placeholder:text-grey-main w-24" type="text" placeholder="##" />
                                        </div>
    
                                        <div className="flex justify-center">
                                            <div className="my-auto">Y:</div>
                                            <input onChange={(e) => setInitYCoor(e.target.value)} value={initYCoor} className="ml-4 shadow appearance-none border border-grey-main rounded w-full py-2 px-3 text-white placeholder:italic leading-tight focus:outline-none focus:shadow-outline bg-black placeholder:text-grey-main w-24" type="text" placeholder="##" />
                                        </div>
    
                                    </div>
                                </div>
                            </>,
                            onNext: (next) => {
                                if( ! initialMap ){
                                    alert("❗ room cannot be empty");
                                    return;
                                }
                                if( ! initXCoor ){
                                    alert("❗ X cannot be empty");
                                    return;
                                }
                                if( ! initYCoor ){
                                    alert("❗ Y cannot be empty");
                                    return;
                                }
                                next?.callback()
                            }
                        },

                        // ========== Step 4 ==========
                        {
                            content:
                            <>
                                <ProgressImage src="/steps/4a.png"/>
    
                                {/* ----- Form Area ----- */}
                                <div className="w-full h-full ml-12 pr-12">
                                    <div className='text-base text-grey-text italic mt-1'>
                                        Add as many gated areas as you would like:
                                    </div>
    
                                    <div className='text-base text-white mt-4'>
                                        Name of room the gated area is being added to
                                    </div>
                                    <div className='mt-2'>
    
                                        <input onChange={(e) => setMap(e.target.value)} value={map} className="shadow appearance-none border border-grey-main rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-black placeholder:text-grey-main" type="text" placeholder="room-name" /> 

                                    </div>
    
                                    {/* -- row -- */}
                                    <div className='text-base text-white mt-7'>
                                        Top-Left coordinates of gated area
                                    </div>
    
                                    <div className='mt-2 flex gap-12'>
                                    
                                        <div className="flex">
                                            <div className="my-auto">X:</div>
                                            <input onChange={(e) => setTopLeftX(e.target.value)} className="ml-4 shadow appearance-none border border-grey-main rounded w-full py-2 px-3 text-white placeholder:italic leading-tight focus:outline-none focus:shadow-outline bg-black placeholder:text-grey-main w-24" type="text" placeholder="##" />
                                        </div>
    
                                        <div className="flex justify-center">
                                            <div className="my-auto">Y:</div>
                                            <input onChange={(e) => setTopLeftY(e.target.value)} className="ml-4 shadow appearance-none border border-grey-main rounded w-full py-2 px-3 text-white placeholder:italic leading-tight focus:outline-none focus:shadow-outline bg-black placeholder:text-grey-main w-24" type="text" placeholder="##" />
                                        </div>
    
                                    </div>
    
                                    {/* -- row -- */}
                                    <div className='text-base text-white mt-7'>
                                        Bottom-Right coordinates of gated area
                                    </div>
    
                                    <div className='mt-2 flex gap-12'>
                                    
                                        <div className="flex">
                                            <div className="my-auto">X:</div>
                                            <input onChange={(e) => setBottomRightX(e.target.value)} className="ml-4 shadow appearance-none border border-grey-main rounded w-full py-2 px-3 text-white placeholder:italic leading-tight focus:outline-none focus:shadow-outline bg-black placeholder:text-grey-main w-24" type="text" placeholder="##" />
                                        </div>
    
                                        <div className="flex justify-center">
                                            <div className="my-auto">Y:</div>
                                            <input onChange={(e) => setBottomRightY(e.target.value)} className="ml-4 shadow appearance-none border border-grey-main rounded w-full py-2 px-3 text-white placeholder:italic leading-tight focus:outline-none focus:shadow-outline bg-black placeholder:text-grey-main w-24" type="text" placeholder="##" />
                                        </div>
    
                                    </div>
    
                                    {/* -- row -- */}
                                    <div className='text-base text-white mt-7'>
                                        Give this area a name
                                    </div>
                                    <div className='mt-2'>
    
                                        <input onChange={(e) => setName(e.target.value)} className="shadow appearance-none border border-grey-main rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-black placeholder:text-grey-main" type="text" placeholder="VIP Poker Table" />
                                    </div>
                                    
                                    {/* -- row -- */}
                                    <div className='mt-7'>
                                        <input id="form-accs" onChange={(e) => setAccessControls(e.target.value)} type="text" className='hidden' />
                                        <button onClick={() =>  onOpenShareModal()} className="bg-[#462A84] rounded-md px-5 py-1">
                                        DEFINE TOKEN GATING CONDITIONS
                                        </button>
                                    </div>
    
                                    {/* -- row -- */}
                                    {
                                        restrictedSpaces?.length <= 0 ? '' : 
                                        <div className='text-base text-white mt-7'>
                                            Defined areas:
                                        </div>
                                    }
                                    
                                    <div className='mt-2'>

                                        {/* -- Defined areas -- */}
                                        {
                                            restrictedSpaces.map((space, i) => {
                                                return (
                                                    <div key={i}>

                                                        {
                                                            i <= 0 ? '' : 
                                                            <div className="bg-[#212121] w-full px-4">
                                                                <div className="bg-[#3C3C3D] w-full h-[1px]"></div>
                                                            </div>
                                                        }
                                                        <div className="bg-[#212121] w-full min-h-[120px] p-4">


                                                        <div className="relative">
                                                            <button onClick={() => onClickDeleteRow(i)} className="absolute top-0 right-0 text-xs hover:text-red text-grey-text">
                                                                Remove
                                                            </button>

                                                            <div className='flex'>
                                                                <h1>{ space.name }</h1>
                                                                <h5 className="italic ml-2">(in room "{ space.map }")</h5>
                                                            </div>
                                                            <div className='flex text-[#C2C2C5]'>
                                                                <h1>Top-Left: ({ space.topLeft })</h1>
                                                            </div>
                                                            <div className='flex text-[#C2C2C5]'>
                                                                <h1>Bottom-Right: ({ space.bottomRight })</h1>
                                                            </div>
                                                            <div className='flex'>
                                                                { space.humanised }
                                                            </div>
                                                        </div>

                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        
                                    </div>
     
                                </div>
                            </>,
                            next: editMode ? 'Update Space' : 'Create Areas' ,
                            onNext: async (next) => {
                                await onSubmit();
                                next?.callback();
                            }
                        },

                        // ========== Step 5 ==========
                        {
                            content:
                            <>
                                <ProgressImage src="/steps/5a.png"/>
    
                                {/* ----- Form Area ----- */}
                                <div className="w-full h-full overflow-y-scroll ml-12 pr-12">
                                    <div className='text-base text-white mt-4'>
                                        Place an object in your space that allows visitors to access the gated areas: 
                                    </div>
                                    <div className='text-base text-white mt-9'>
                                        Go to My Spaces
                                    </div>
                                    <div className='text-base text-white mt-4'>
                                        Choose Edit Map
                                    </div>
                                    <div className='text-base text-white mt-4'>
                                        In the Map Editor, select More Objects
                                    </div>
                                    <div className='text-base text-white mt-4'>
                                        Pick an object that visitors will interact with to connect with and gain access.
                                    </div>
                                    <div className='text-base text-white mt-4'>
                                        Select Embedded website
                                    </div>
                                    <div className='text-base text-white mt-4'>
                                        In Website (URL) add this in-game link
                                    </div>
                                    {
                                        ! currentSpace ? 'Space not stored yet.' : 
                                            <div className="mt-4 shadow appearance-none border border-grey-main rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-black placeholder:text-grey-main text-sm">
                                                <code>
                                                {
                                                    window.location.protocol + '//' + window.location.host + '/space/' + currentSpace.id + '?ingame=true'
                                                }
                                                </code>
                                            </div>

                                    }
                                    

                                </div>
                            </>,
                            back: 'Restart',
                            next: 'Finished',
                            onBack: (back) => back?.reset?.call(),
                            hideNextIcon: true,
                            onNext: async (next) => router.push('/dashboard'),
                        }
                    ]} />
                </div>
            </DashboardLayout>
        </>
    );
}

export default TokenGate;

// ========== Next.js Hooks ==========

//
// Use Layout
//
TokenGate.getLayout = function getLayout(page) {

    return (
        <MainLayout>
        { page }
        </MainLayout>
    )
}