//
// @param { Object } space
// @param { Array<String> } list of names
// @param { String } button text
// @param { Function } buttonActio / callback

import { LockClosedIcon } from "@heroicons/react/solid";

//
const SpaceCard = ({space, restrictedAreas, buttonAction}) => {

    const idToTitle = (spaceId) =>{
        return spaceId.split('/')[1].replace('-', ' ');
    }

    return (
        <div onClick={() => buttonAction(space) } className="cursor-pointer hover:hover:drop-shadow-2xl text-lit-100 bg-white overflow-hidden text-xs rounded-xl">

            <div className="h-48 flex justify-center items-center overflow-hidden">
                <img className="object-cover w-full h-full" src="https://picsum.photos/seed/picsum/1000/1000"/>
            </div>

            <div className="p-4 text-center">
                <div className="text-lit-900 font-bold text-base capitalize">{ idToTitle(space.spaceId) }</div>
                <div className="text-grey-text">By: <span className="text-lit-400">{ space.walletAddress }</span></div>

                {
                    restrictedAreas.length <= 0
                    ?<>
                        <div className="mt-6 text-left">
                            <span className="m-auto text-lg text-lit-900">
                                No Restricted Rooms
                            </span>
                        </div>
                    </>
                    :<>
                        <ul className="h-28 overflow-auto mt-6 w-full text-lit-900">
                            <div className="m-auto mb-1 text-lg text-left">
                                Restricted Rooms
                            </div>
                            {
                                restrictedAreas.map((area) => {
                                    return (
                                        // <li className="h-10 flex bg-lit-500 p-1 mb-1 rounded-lg">
                                             
                                        //     <div className="w-24 flex justify-center">
                                        //     <span className="m-auto capitalize">{ area.name }</span>
                                        //     </div>
                                        //     <div className="text-left w-full flex">
                                        //         <span className="mt-auto mb-auto">{ area.humanised }</span>
                                        //     </div>
                                        // </li>
                                        <li className="mb-2 pb-1 border-b flex">
                                            <div className="flex justify-center">
                                                <div className="m-auto w-6">
                                                    <LockClosedIcon className="m-auto"/>
                                                </div>
                                            </div>
                                            <div className="ml-2 text-left">
                                                <div><span className="capitalize font-bold">{ area.name }</span></div>
                                                <div><span>{ area.humanised }</span></div>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </>
                }
                
            </div>
        </div>
    );
}

export default SpaceCard;