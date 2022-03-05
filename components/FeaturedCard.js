const FeaturedCard = ({callback, thumbnail, title, createdAt}) => {
    return (<div onClick={() => callback()} className="">
        <div className="h-[27.3rem] w-full overflow-hidden rounded-lg cursor-pointer hover:opacity-75 transition ease-in">
            <img className="object-cover w-full h-full" src={thumbnail} />    
        </div>
        <div className="flex justify-between mt-2 text-white text-sm">
            <div className="text-lit-100 capitalize">{title}</div>
            <div className="text-grey-text">{createdAt}</div>
        </div>
    </div>);
}

export default FeaturedCard;