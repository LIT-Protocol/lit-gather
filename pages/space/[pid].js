import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import SpaceCard from "../../components/SpaceCard";
import LoadingIcon from "../../components/Icon/LoadingIcon";
import { useAppContext } from "../../state/AppProvider";
import { fetchSpace } from "../../utils/fetch";
import SEOHeader from "../../components/SEO/SEOHeader";
import FrameLayout from "../../components/Layout/FrameLayout";
import BtnConnectWallet from "../../components/BtnConnectWallet";
import { CheckIcon } from "@heroicons/react/solid";

const SpacePage = () => {

    // -- app context
    const appContext = useAppContext();
    const { joinSpace, auth, onDisconnect } = appContext.methods;

    const router = useRouter()
    const { pid } = router.query;
    const isInGame = router.query.ingame || false;
    const inGameJoinedSuccessfully = router.query.done || false;
    
    const [space, setSpace] = useState(null);

    useEffect(() => {

        if( ! pid ){
            return;
        }

        if( isInGame ){
            onDisconnect();
        }
        
        // 
        // Filter the space out of all spaces
        //
        const getSpace = async () => {
            
            const _space = await fetchSpace(pid);

            setSpace(_space)
            console.log(_space);

            
            return _space;
            
        }

        if( ! space ){
            getSpace();
        }

    }, [pid])

    // -- conditions
    const isWebsite = !inGameJoinedSuccessfully && !isInGame;
    const spaceLoaded = space;
    
    return (
        <>
            <SEOHeader
                subtitle={space?.spaceId?.split('/')[1]?.replace('-', ' ')}
                description={`You're invited to join a space!`}
            />
 
            <div className='text-white'>

                {/* ==== If this page is loaded from the website ===== */}
                {
                    !isWebsite ? '' :
                        !spaceLoaded ? <div className="w-full pt-12 flex justify-center"><LoadingIcon/></div> :
                            <>
                                <h1 className="leading-tight text-5xl text-white text-center mt-16">
                                    <div className="mb-20">You&apos;ve been invited to a Gather space:</div>
                                </h1>

                                <div className="w-96 m-auto mt-12">
                                    <SpaceCard
                                        key={space.spaceId}
                                        space={space}
                                        restrictedAreas={JSON.parse(space.restrictedSpaces)}
                                        buttonAction={() => auth(() => joinSpace(space, JSON.parse(isInGame)))}
                                    />
                                </div>
                            </>
                }

                {/* ==== If this page is loaded as an object frame inside the game ===== */}
                {
                    !isInGame ? '' :
                        !spaceLoaded ? <div className="w-full pt-12 flex justify-center"><LoadingIcon/></div> :
                            <>
                                <h1 className="leading-tight text-base text-white text-center mt-16">
                                    <div className="">
                                        Connect wallet to enter access-controlled<br/>
                                        areas in this Gather space
                                    </div>
                                </h1>

                                <div className="w-40 m-auto mt-6">
                                    <BtnConnectWallet 
                                        bgColor={'bg-[#8847A7]'}
                                        hoverColor={'bg-[#8847A7]'}
                                        onClick={() => auth(() => joinSpace(space, JSON.parse(isInGame)))}
                                    />    
                                </div>

                                <div className="w-96 m-auto mt-10">
                                    <SpaceCard
                                        key={space.spaceId}
                                        space={space}
                                        restrictedAreas={JSON.parse(space.restrictedSpaces)}
                                        buttonAction={() => {}}
                                        style="minimalised"
                                    />
                                </div>

                            </>
                }    

                {/* ==== It game is joined successfully ===== */}
                {
                    !inGameJoinedSuccessfully ? '' :
                        !spaceLoaded ? <div className="w-full pt-12 flex justify-center"><LoadingIcon/></div> :
                            <>
                                <h1 className="leading-tight text-base text-white text-center mt-16">
                                    <div className="">
                                        Youre connected!<br/>
                                        <span className="text-[#B8B1C5]">close this window in the upper right corner</span>
                                    </div>
                                </h1>

                                <div className="w-7 m-auto mt-7">
                                    <CheckIcon/>
                                </div>

                                <div className="w-96 m-auto mt-10">
                                    <SpaceCard
                                        key={space.spaceId}
                                        space={space}
                                        restrictedAreas={JSON.parse(space.restrictedSpaces)}
                                        buttonAction={() => {}}
                                        style="minimalised"
                                    />
                                </div>
                            </>
                }

            </div>
        </>
    );
}

export default SpacePage;


//
// Use Layout
//
SpacePage.getLayout = function getLayout(page){

    const router = useRouter()
    const isInGame = router.query.ingame || false;
    const isDone = router.query.done || false;
    const useFrame = isInGame || isDone;
    // const useFrame = false;
    
    return !useFrame 
    ? <>
        <MainLayout>
            {page}
        </MainLayout>
    </> 
    : <>
        <FrameLayout>
            { page }
        </FrameLayout>
    </>
}