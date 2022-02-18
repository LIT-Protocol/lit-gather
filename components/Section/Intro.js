import { useRouter } from "next/router";
import { storedAuth } from "../../utils/storage";
import MaxWidth from "../Layout/MaxWidth";
import Btn from "../Ui/Btn";



const Intro = () => {

    const router = useRouter();

    //
    // Go to /create page
    // @return { void }
    //
    const onCreateClick = () => {
        console.warn("↓↓↓↓↓ onCreateClick ↓↓↓↓↓");
        router.push('/create')
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
                                text="Create a new gather space"
                                css="flex justify-center"
                                template='inverted'
                                onClick={() => onCreateClick()}
                            />
                        </div>
                    </div>
                    
                </div>

                {/* === Right Side === */}
                <div className="w-full mt-20 pt-1">
                    <div className="">
                        <div className="h-[27.3rem] w-full overflow-hidden rounded-lg cursor-pointer hover:opacity-75 transition ease-in">
                            <img className="object-cover" src="https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/lmQf14kt9sxHskoQ/h7DzTm7EfGZBt8dUe8e2W3"/>    
                        </div>
                        <div className="flex justify-between mt-2 text-white text-sm">
                            <div className="text-lit-100">Lit Protocol</div>
                            <div className="text-grey-text">6d ago</div>
                        </div>
                    </div>
                </div>
            </div>
        </MaxWidth>
    );
}

export default Intro;