import { useEffect, useState } from "react";
import MainLayout from "../../components/Layout/MainLayout";
import MaxWidth from "../../components/Layout/MaxWidth";
import { fetchLockedSpaces } from "../../utils/fetch";

const Explore = ({data}) => {

    useEffect( async () => {
        console.log("Data:", data)

    }, []);

    const getNames = (space) => {
        var lockedAreas = JSON.parse(space.restrictedSpaces);
        var names = lockedAreas.map((area) => area.name);

        return names
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
                    <li className="opacity-10">Coming soon..</li>
                    <li className="opacity-10">Coming soon..</li>
                    <li className="opacity-10">Coming soon..</li>
                    <li className="opacity-10">Coming soon..</li>
                </ul>
            </div>

            {/* --- List of Spaces --- */}
            <div className="mt-10 grid grid-cols-3">
                { data.spaces.map((space) => {
                    return (
                        <div className="text-lit-100 bg-lit-400 p-2 text-xs rounded">
                            <div>id: { space.id }</div>
                            <div>spaceId: { space.spaceId }</div>
                            <div>creator wallet: { space.walletAddress }</div>
                            <div>locked spaces: { getNames(space) }</div>
                            <div className="text-base flex w-full justify-end">
                                <span className="ml-auto px-2 py-1 rounded-lg bg-lit-900">Join</span>    
                            </div>
                        </div>
                    )
                })}
            </div>
        </MaxWidth>
    );
}

export default Explore;

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