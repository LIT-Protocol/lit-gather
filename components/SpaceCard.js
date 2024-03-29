//
// @param { Object } space
// @param { Array<String> } list of names
// @param { String } button text
// @param { Function } buttonActio / callback
//
const SpaceCard = ({space, restrictedAreas, buttonAction, hover=true, style}) => {

    const idToTitle = (spaceId) =>{
        let title;
        try{
            title = spaceId.split('/')[1].replace('-', ' ');
        }catch(e){
            console.error("Unable to convert id to title");
            return;
        }

        return title;
    }

    const useMinimalisedStyle = style == 'minimalised';

    return (
        useMinimalisedStyle ?

        // ========== Minimalised Style ==========
        <>
            <div onClick={() => buttonAction(space) }>
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
                        <ul className="rounded-sm bg-[#200F3B] h-30 overflow-auto mt-6 w-full px-4 text-sm">
                            {
                                restrictedAreas.map((area, i) => {

                                    const border = (restrictedAreas.length - 1) == i ? '' : 'border-b border-[#483C5B]';

                                    return (
                                        <div key={i}>
                                            <li key={area.name} className={`mb-2 flex px-2 py-3 ${border}`}>
                                                <div className="flex justify-center">
                                                    <div className="m-auto w-6">
                                                        <img className="m-auto" src="/lit-logo.png" />
                                                    </div>
                                                </div>
                                                <div className="ml-6 text-left">
                                                    <div><span className="capitalize font-bold">{ area.name }</span></div>
                                                    <div className="w-72"><span className="break-words">{ area.humanised }</span></div>
                                                </div>
                                            </li>
                                        </div>
                                    )
                                })
                            }
                        </ul>
                    </>
                }
            </div>
        </> 
        :

        // ========== Default Style ==========
        <div onClick={() => buttonAction(space) } className={`border-4 border-lit-100 ${hover ? 'cursor-pointer hover:border-lit-400' : ''} transition hover:drop-shadow-2xl text-lit-100 bg-white overflow-hidden text-xs rounded-xl`}>
            <div className="h-48 flex justify-center items-center overflow-hidden">
                <img className="object-cover w-full h-full" src={space.thumbnailUrl }/>
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
                        <ul className="h-30 overflow-auto mt-6 w-full text-lit-900">
                            <div className="m-auto mb-1 text-lg text-left">
                                Restricted Rooms
                            </div>
                            {
                                restrictedAreas.map((area) => {
                                    return (
                                        <li key={area.name} className="mb-2 pb-1 border-b flex">
                                            <div className="flex justify-center">
                                                <div className="m-auto w-6">
                                                    <img className="m-auto" src="/lit-logo.png" />
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