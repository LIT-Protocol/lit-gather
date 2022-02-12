import Link from "next/link";


const Btn = ({text, href, id, onClick = null}) => {

    return (
        <div className="bg-lit-400 hover:bg-lit-500 text-white rounded-3xl flex transition duration-300 ease-lit">

            {
                onClick == null
                ?
                <Link href={href} as={href} >
                    <a id={id} className="flex pl-4 pr-4 p-2">
                        <p className="text-base">{ text }</p>
                    </a>
                </Link>
                :
                <button onClick={() => onClick()} className="flex pl-4 pr-4 p-2">
                    <p className="text-base">{ text }</p>
                </button>
            }
        </div>
    );
}

export default Btn;