const InfoRow = ({text, action = null}) => {
    return (
        <>
            <div className="max-w-fit m-auto px-8 mt-2 bg-main rounded-2xl p-2 flex justify-between text-white flex justify-center">
                <span className="m-auto capitalize">{text}</span>
            </div>
            {
                action == null
                ?
                ''
                :
                <div onClick={() => action?.callback()} className="m-auto max-w-fit px-4 py-1 mt-16 flex justify-center cursor-pointer ml-auto border border-[#BFA1FF] hover:border-lit-500 rounded-full text-[#BFA1FF] hover:text-lit-500 transition ease-in mb-6">
                    <div className="my-auto">{ action?.icon ?? action?.svg }</div>
                    <div className="my-auto text-sm flex justify-center">
                        <span className="m-auto">{ action.text }</span>    
                    </div>
                </div>
            }
        </>
    );
}

export default InfoRow;