import { useRouter } from "next/router";
import { useState} from 'react';
import { useAppContext } from "../../state/AppProvider";
// import { storedAuth } from "../../utils/storage";
import MaxWidth from "../Layout/MaxWidth";
import Btn from "../Ui/Btn";
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const Intro = () => {

    // -- app context
    const appContext = useAppContext();
    const { auth } = appContext.methods; 

    // -- router
    const router = useRouter();

    // -- state
    const [featured, setFeatured] = useState({
        thumbnail: 'https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/lmQf14kt9sxHskoQ/h7DzTm7EfGZBt8dUe8e2W3',
        title: 'Lit Protocol',
        createdAt: '6 days ago',
    });

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

    return (
        <MaxWidth>
            <div className="grid md:grid-cols-2 md:gap-28 grid-cols-1">

                {/* === Left Side === */}
                <div className="w-full mt-12 md:mt-24 pt-2">
                    <h1 className="leading-tight text-5xl text-white">
                        Discover, create, and join
                        token-gated Gather Spaces
                    </h1>

                    <div className="text-purple-text text-2xl mt-5">
                        Creators, NFT, DAO representative use Lit Protocol to grant and restrict access to your gather spaces
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
                <div className="w-full mt-20 pt-1">
                    <div onClick={() => router.push('/explore')} className="">
                        <div className="h-[27.3rem] w-full overflow-hidden rounded-lg cursor-pointer hover:opacity-75 transition ease-in">
                            <img className="object-cover" src={featured.thumbnail}/>    
                        </div>
                        <div className="flex justify-between mt-2 text-white text-sm">
                            <div className="text-lit-100">{ featured.title }</div>
                            <div className="text-grey-text">{ featured.createdAt }</div>
                        </div>
                    </div>
                </div>
            </div>
        </MaxWidth>
    );
}

export default Intro;