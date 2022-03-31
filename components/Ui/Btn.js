import Link from "next/link";


const Btn = ({
    text, 
    href = '/', 
    id, 
    onClick = null,
    template='solid',
    css='',
    bgColor='bg-lit-400',
    hoverColor='bg-lit-500',
}) => {

    const styles = {
        'solid' : `${css} ${bgColor} hover:${hoverColor} text-white rounded-3xl flex transition duration-300 ease-lit`,
        'inverted' : `${css} bg-transparent text-lit-100 rounded-3xl flex transition duration-300 ease-lit border border-lit-100 hover:text-white hover:border-white`
    }

    const pStyle = 'md:text-base text-sm m-auto'

    return (
        <div className={styles[template]}>

            {
                onClick == null
                ?
                <Link href={href} as={href} >
                    <a id={id} className="flex pl-4 pr-4 p-2 w-full">
                        <p className={pStyle}>{ text }</p>
                    </a>
                </Link>
                :
                <button onClick={() => onClick()} className="flex pl-4 pr-4 p-2 w-full">
                    <p className={pStyle}>{ text }</p>
                </button>
            }
        </div>
    );
}

export default Btn;