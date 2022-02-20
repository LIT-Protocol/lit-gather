import { useEffect, useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import MaxWidth from "../../components/Layout/MaxWidth";
import SpaceCard from "../../components/SpaceCard";
import { useAppContext } from "../../state/AppProvider";
import { fetchLockedSpaces, storeUserPermittedResources } from "../../utils/fetch";
import { getGatherRedirectUrl } from "../../utils/gather";
import { asyncForEach, disableNativeAlert, enableNativeAlert } from "../../utils/helper";
import { compileResourceId } from "../../utils/lit";
import { storedNetwork } from "../../utils/storage";

const Explore = ({data}) => {

    const appContext = useAppContext();
    const { litNodeClient, LitJsSdk } = appContext.lit;
    
    // 
    // Get a list of arguments to be passed to the 
    // getSignedToken function to request JWT
    // @param { String } spaceId eg.  tXVe5OYt6nHS9Ey5\lit-protocol
    // @param { Array } locked spaces
    // @return { Array } list
    //
    const getJwtArguments = (spaceId, lockedSpaces) => {

        return lockedSpaces.map((area) => {

            // -- prepare
            var accessControlConditions = JSON.parse(area.accessControls);
            var resourceId = compileResourceId(spaceId, area);
            
            // -- add to list
            return {
                accessControlConditions,
                resourceId
            };
        });

    }

    //
    // Get return jwts from list of arguments
    // @param { String } chain/network
    // @param { Object } authSig
    // @param { Array } jwt argumnets
    // @return { Array } list of jwts
    //
    const getJwts = async (chain, authSig, args) => {

        const jwts = [];

        await asyncForEach(args, async (arg) => {
            let jwt;
            try{
                jwt = await litNodeClient.getSignedToken({ 
                    chain,
                    authSig, 
                    accessControlConditions: arg.accessControlConditions, 
                    resourceId: arg.resourceId,
                })
            }catch{
                console.error("❌ Failed to request jwt for ", arg);
            }
            jwts.push(jwt);
        })

        return jwts;
    }

    //
    // event:: onClick join space button
    // @parma { Object } space
    // @return { void } 
    //
    const onClickJoin = async (space) => {
        console.warn("↓↓↓↓↓ onClickJoin ↓↓↓↓↓ ");

        // -- disable native alert
        disableNativeAlert();

        // -- prepare
        const lockedSpaces = JSON.parse(space.restrictedSpaces);
        console.log("👉 lockedSpaces:", lockedSpaces)

        // -- prepare spaceId eg. tXVe5OYt6nHS9Ey5\lit-protocol
        const spaceId = space.spaceId;
        console.log("👉 spaceId:", spaceId)

        // -- prepare access to resource via jwt
        
        // -- chain & auth
        const chain = storedNetwork();
        const authSig = await LitJsSdk.checkAndSignAuthMessage({chain});
        
        // -- get jwt arguments to be passed 
        const jwtArguments = getJwtArguments(spaceId, lockedSpaces);
        console.log("👉 jwtArguments:", jwtArguments);
        
        // -- get jwts
        const jwts = await getJwts(chain, authSig, jwtArguments);

        // -- valid jwts
        const validJwts = jwts.filter((jwt) => jwt);

        console.log("👉 validJwts:", validJwts);

        // -- store user's gather permitted resources
        const store = await storeUserPermittedResources({authSig, jwts: validJwts})

        console.log("👉 Permitted Resources Stored:", store)

        // -- prepare queries
        const queryAuthSig = { authSig: JSON.stringify(authSig) }
        const queryGatherUrl = { gatherUrl: (window.location.origin + window.location.pathname) }
        const querySpace = { spaceId }

        // -- prepare redirect query
        const redirectUrl = getGatherRedirectUrl({
            host: process.env.NEXT_PUBLIC_BACKEND, 
            endpoint: '/oauth/gather/callback2?',
            queries: [
                queryAuthSig,
                queryGatherUrl,
                querySpace,
            ],
        });

        console.log("👉 redirectUrl:", redirectUrl)

        // -- enable native alert once its done
        enableNativeAlert();
    }

    return (
        <MaxWidth>

            {/* --- Title --- */}
            <div className="text-white text-4xl mt-12 text-center">
                Explore Spaces
            </div>
            
            {/* --- Nav --- */}
            <div className="mt-24 text-white">
                <ul className="flex justify-between border-b border-lit-400/.5">
                    <li className="border-b border-lit-400 border-b-2 px-4 pb-1">Trending</li>
                    <li className="opacity-5">Lit Genesis</li>
                    <li className="opacity-5">Coming soon..</li>
                    <li className="opacity-5">Coming soon..</li>
                    <li className="opacity-5">Coming soon..</li>
                </ul>
            </div>

            {/* --- List of Spaces --- */}
            { 
                data.length <= 0
                ?
                // -- (error) not spaces found
                <div className="text-center text-white w-full mt-10">
                    <span className="">Oops... cannot find any spaces at the moment.</span>
                </div>
                :
                // -- (success) render List
                <div className="mt-10 grid grid-cols-3 gap-2">
                    { data.spaces.map((space) => {
                        return (
                            <SpaceCard
                                space={space}
                                restrictedAreas={JSON.parse(space.restrictedSpaces)}
                                buttonText="Join"
                                buttonAction={() => onClickJoin(space)}
                            />
                        )
                    })}
                </div>
            }
            
        </MaxWidth>
    );
}

export default Explore;

// ========== Next.js Hooks ==========
//
// Prefetch data for this component
//
export async function getServerSideProps() {
    const data = await fetchLockedSpaces();

    // Pass data to the page via props
    return { props: { data } }
}

//
// Use Layout
//
Explore.getLayout = function getLayout(page){
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}