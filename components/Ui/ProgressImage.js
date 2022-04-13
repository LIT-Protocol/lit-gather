const ProgressImage = ({src, src2}) => {
    return (
        ! src2 ? 
        <div className="p-6 w-full min-h-[256px] h-full bg-lit-dark rounded-lg">
            <div className="rounded-lg overflow-hidden border border-lit-400 border-2">
                <img src={src} />
            </div>
        </div> : 
        <div className="p-6 w-full min-h-[500px] bg-lit-dark rounded-lg relative">
            <div className="rounded-lg overflow-hidden border border-lit-400 border-2 w-1/2">
                <img src={src} />
            </div>
            <div className="rounded-lg overflow-hidden border border-lit-400 border-2 w-3/4  ml-auto mt-4">
                <img src={src2} />
            </div>
        </div>
    );
}

export default ProgressImage;