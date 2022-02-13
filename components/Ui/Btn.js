import Link from "next/link";


const Btn = ({
    text, 
    href = '/', 
    id, 
    onClick = null,
    template='solid',
    css=''
}) => {

    const styles = {
        'solid' : `${css} bg-lit-400 hover:bg-lit-500 text-white rounded-3xl flex transition duration-300 ease-lit`,
        'inverted' : `${css} bg-transparent text-lit-100 rounded-3xl flex transition duration-300 ease-lit border border-lit-100 hover:text-white hover:border-white`
    }

    const pStyle = 'md:text-base text-sm'

    return (
        <div className={styles[template]}>

            {
                onClick == null
                ?
                <Link href={href} as={href} >
                    <a id={id} className="flex pl-4 pr-4 p-2">
                        <p className={pStyle}>{ text }</p>
                    </a>
                </Link>
                :
                <button onClick={() => onClick()} className="flex pl-4 pr-4 p-2">
                    <p className={pStyle}>{ text }</p>
                </button>
            }
        </div>
    );
}

export default Btn;