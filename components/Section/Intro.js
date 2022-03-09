import { useRouter } from "next/router";
import { useEffect, useState} from 'react';
import { useAppContext } from "../../state/AppProvider";
import { fetchLockedSpaces } from "../../utils/fetch";
import FeaturedCard from "../FeaturedCard";
import MaxWidth from "../Layout/MaxWidth";
import Btn from "../Ui/Btn";
import moment from 'moment';

const Intro = () => {

    // -- app context
    const appContext = useAppContext();
    const { auth, joinSpace } = appContext.methods; 

    // -- router
    const router = useRouter();

    // -- state
    const [featured, setFeatured] = useState(null);

    //
    // Go to /create page
    // @return { void }
    //
    const onCreateClick = () => {
        auth(() => {
            console.warn("↓↓↓↓↓ onCreateClick ↓↓↓↓↓");
            router.push('/create')
        })
    }

    // -- mounted
    useEffect(() => {
        const getFeaturedSpaces = async () => {
            const data = await fetchLockedSpaces();

            // -- validate if there is data
            if(data?.spaces?.length <= 0 || ! data?.spaces){
                setFeatured({
                    thumbnail: 'https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/lmQf14kt9sxHskoQ/h7DzTm7EfGZBt8dUe8e2W3',
                    title: 'Lit Protocol',
                    createdAt: '6 days ago',
                    space: null,
                });
                console.warn("❗ No featured data found. Using default.");
                return;
            }

            const featuredSpace = data.spaces[Math.floor(Math.random() * data.spaces.length)];

            setFeatured({
                thumbnail: featuredSpace.thumbnailUrl,
                title: featuredSpace.spaceId.split('/')[1],
                createdAt: moment(featuredSpace.createdAt).fromNow(),
                space: featuredSpace,
            })
        }

        getFeaturedSpaces();
    }, [])

    return (
        <MaxWidth>
            <div className="grid md:grid-cols-2 md:gap-28 grid-cols-1">

                {/* === Left Side === */}
                <div className="w-full mt-12 md:mt-20 pt-2">
                    <h1 className="leading-tight text-5xl text-white">
                        Discover, create, and join
                        token-gated Gather spaces
                    </h1>

                    <div className="text-purple-text text-2xl mt-5">
                        Creators, DAOs and NFT projects use Lit Protocol to grant and restrict access to their Gather spaces.
                    </div>

                    <div className="mt-10 flex">
                        <div className="w-32">
                            <Btn
                                text="Explore"
                                href="/explore"
                                css="flex justify-center"
                            />
                        </div>
                        <div className="ml-4">
                            <Btn
                                text="Add access control"
                                css="flex justify-center"
                                template='inverted'
                                onClick={() => onCreateClick()}
                            />
                        </div>
                    </div>
                    
                </div>

                {/* === Right Side === */}
                <div className="w-full mt-16 pt-1 text-white">
                    {
                        ! featured 
                        ? '' 
                        : <FeaturedCard 
                            callback={() => auth(() => {
                                if( ! featured.space ){
                                    router.push('/explore');
                                    return;
                                }
                                joinSpace(featured.space);
                            })} 
                            thumbnail={featured.thumbnail} 
                            title={featured.title} 
                            createdAt={featured.createdAt}  
                        />
                    }
                    
                </div>
            </div>
        </MaxWidth>
    );
}
  
export default Intro;

// ========== Next.js Hooks ==========
//
// Prefetch data for this component
//
export async function getServerSideProps() {

    const data = await fetchLockedSpaces();

    const featuredSpace = data?.spaces[Math.floor(Math.random() * data?.spaces.legth)];

    console.log("featuredSpace:", featuredSpace);
    // Pass data to the page via props
    return { props: { featuredSpace } }
}