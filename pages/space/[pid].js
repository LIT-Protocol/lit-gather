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
    const { joinSpace, auth } = appContext.methods;

    const router = useRouter()
    const { pid } = router.query;

    const [space, setSpace] = useState(null);

    useEffect(() => {

        if( ! pid ){
            return;
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
                image={space?.thumbnailUrl}
            />
            <div className='text-white'>
                {
                    ! space 
                    ? <LoadingIcon/> 
                    : 
                    <>
                    <h1 className="leading-tight text-5xl text-white text-center mt-12">
                    You're invited to join {space.spaceId.split('/')[1].replace('-', ' ')}!
                    </h1>
                    <div className="w-96 m-auto mt-12">
                        <SpaceCard
                            key={space.spaceId}
                            space={space}
                            restrictedAreas={JSON.parse(space.restrictedSpaces)}
                            buttonAction={() => auth(() => joinSpace(space))}
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
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}