import MainLayout from "../../components/Layout/MainLayout";
import MaxWidth from "../../components/Layout/MaxWidth";
import SEOHeader from "../../components/SEO/SEOHeader";
import SpaceCard from "../../components/SpaceCard";
import { useAppContext } from "../../state/AppProvider";
import { fetchLockedSpaces } from "../../utils/fetch";

const Explore = ({data}) => {

    // -- context
    const appContext = useAppContext();
    const { auth, joinSpace } = appContext.methods;
    
    return (
        <>
            <SEOHeader subtitle="Explore Spaces" />
            <MaxWidth>

                {/* --- Title --- */}
                <div className="text-white text-5xl mt-16 pt-1 text-center">
                    Explore Spaces
                </div>
                
                {/* --- Nav --- */}
                <div className="mt-24 text-white ">
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
                    data?.error
                    ?
                    // -- (error) not spaces found
                    <div className="text-center text-white w-full mt-10">
                        <span className="">Oops... cannot find any spaces at the moment.</span>
                    </div>
                    :
                    // -- (success) render List
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        { data.spaces.map((space) => {
                            return (
                                <SpaceCard
                                    key={space.spaceId}
                                    space={space}
                                    restrictedAreas={JSON.parse(space.restrictedSpaces)}
                                    buttonAction={() => auth(() => joinSpace(space))}
                                />
                            )
                        })}
                    </div>
                }
                
            </MaxWidth>
        </>
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