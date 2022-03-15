import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import SpaceCard from "../../components/SpaceCard";
import LoadingIcon from "../../components/Icon/LoadingIcon";
import { useAppContext } from "../../state/AppProvider";
import { fetchSpace } from "../../utils/fetch";
import SEOHeader from "../../components/SEO/SEOHeader";

const SpacePage = () => {

    // -- app context
    const appContext = useAppContext();
    const { joinSpace, auth, onDisconnect } = appContext.methods;

    const router = useRouter()
    const { pid } = router.query;
    const isInGame = router.query.ingame || false;
    const inGameJoined = router.query.done || false;
    
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
    
    return (
        <>
            <SEOHeader
                subtitle={space?.spaceId?.split('/')[1]?.replace('-', ' ')}
                description={`You're invited to join a space!`}
            />
            <div className='text-white'>
                {
                    ! space 
                    ? <LoadingIcon/> 
                    : 
                    <>
                    {
                        !inGameJoined
                        ?
                        <>
                            <h1 className="leading-tight text-5xl text-white text-center mt-16">
                            {
                                isInGame
                                ? <>Click below to unlock restricted areas!</>
                                : <div className="mb-20">You've been invited to a Gather space:</div>
                            }
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
                        :
                        <>
                        <div className="flex justify-center h-screen fixed content-area">
                            <div className="leading-tight text-5xl text-white text-center m-auto">
                            You can close the window now, please re-join the space to access to restricted areas.
                            </div>
                        </div>
                        </>
                    }
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
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}