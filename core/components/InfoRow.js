const InfoRow = ({text, action = null}) => {
    return (
        <>
            <div className="mt-2 bg-main rounded-2xl p-2 flex justify-between text-white flex justify-center">
                <span className="m-auto capitalize">{text}</span>
            </div>
            {
                action == null
                ?
                ''
                :
                <div onClick={() => action?.callback()} className="flex justify-end cursor-pointer ml-auto w-24">
                    <div className="h-5 w-5 my-auto pt-1 text-lit-400">
                    { action?.icon }
                    </div>
                    <div className="my-auto text-sm text-lit-400 mt-1">{ action.text }</div>
                </div>
            }
        </>
    );
}

export default InfoRow;