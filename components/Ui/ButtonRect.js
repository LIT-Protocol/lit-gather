
const ButtonRect = ({
    icon, 
    text='Lorem Ipsum',
    onClick={},
    iconFirst = true,
    hideIcon = false,
    hidden = false,
}) => {
    return (
        iconFirst ? 
        <button onClick={(e) => onClick(e)} className={`flex bg-black border border-white px-2 py-1 ${ ! hidden ? '' : 'invisible'}`}>
            {
                hideIcon ? '' :
                <div className="flex justify-center m-auto">
                    <div className="m-auto w-4">
                        { icon }
                    </div>
                </div>
            }
            <div className={`flex justify-center ${hideIcon ? '' : 'ml-1'}`}>
                <div className="m-auto">{text}</div>
            </div>
        </button>
        :
        <button onClick={(e) => onClick(e)} className={`flex bg-black border border-white px-2 py-1 ${ ! hidden ? '' : 'invisible'}`}>
            <div className="flex justify-center">
                <div className="m-auto">{text}</div>
            </div>
            {
                hideIcon ? '' : 
                <div className="ml-1 flex justify-center m-auto">
                    <div className="m-auto w-4">
                        { icon }
                    </div>
                </div>
            }
             
        </button>
    )
}

export default ButtonRect;