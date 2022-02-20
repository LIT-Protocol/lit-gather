//
// @param { Object } space
// @param { Array<String> } list of names
// @param { String } button text
// @param { Function } buttonActio / callback
//
const SpaceCard = ({space, restrictedAreas, buttonText, buttonAction}) => {
    return (
        <div className="text-lit-100 bg-lit-400 p-2 text-xs rounded">
            <div className="text-lit-900 mb-2 font-bold text-base">{ space.spaceId }</div>
            <div className="mb-2">Creator Wallet: { space.walletAddress }</div>
            <ul className="list-disc list-inside w-full">
                <div>Locked Rooms:</div>
                { restrictedAreas.map((area) => {
                    return (
                        <li className="h-10 flex bg-lit-500 p-1 mb-1 rounded-lg">
                            <div className="w-24 flex justify-center">
                            <span className="m-auto">{ area.name }</span>
                            </div>
                            <div className="text-left w-full flex">
                                <span className="mt-auto mb-auto">{ area.humanised }</span>
                            </div>
                        </li>
                    )
                })}
            </ul>
            <div className="text-base flex w-full justify-end">
                <span onClick={() => buttonAction(space) } className="ml-auto px-2 py-1 rounded-lg bg-lit-900 cursor-pointer hover:bg-lit-dark transition">{buttonText}</span>    
            </div>
        </div>
    );
}

export default SpaceCard;