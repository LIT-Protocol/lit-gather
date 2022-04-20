import { GlobeIcon, PlusIcon } from "@heroicons/react/solid";
import { Router, useRouter } from "next/router";
import { useState, useEffect } from "react";

const SideMenu = () => {

    const router = useRouter()

    const [selected, setSelected] = useState(null)

    useEffect(() => {
        if(location.pathname == '/dashboard'){
            setSelected(0);
        }
        if(location.pathname == '/token-gate'){
            setSelected(1);
        }
    }, [])


    const onClick = (i) => {
        if(i == 0){
            router.push('/dashboard')
        }

        if(i == 1){
            router.push('/token-gate')
        }
    }

    return (
        <>

            <div className="ml-6 text-grey-text text-xs">
                Dashboard
            </div>

            {/* Todo: turn into component */}
            <div onClick={() => onClick(0)} className={`text-white text-sm h-12 w-48 flex justify-center rounded-xl mt-2 ml-4 cursor-pointer transition transition-lit hover:bg-lit-400 ${selected == 0 ? 'bg-lit-400' : ''}`}>
                <GlobeIcon className="w-6 ml-2"/>
                <span className="m-auto ml-2 text-sm">Your Spaces</span>
            </div>

            <div onClick={() => onClick(1)} className={`text-white text-sm h-12 w-48 flex justify-center rounded-xl mt-2 ml-4 cursor-pointer transition transition-lit hover:bg-lit-400 ${selected == 1 ? 'bg-lit-400' : ''}`}>
                <PlusIcon className="w-6 ml-2"/>
                <span className="m-auto ml-2 text-sm">Add Access Control</span>
            </div>

        </>


    );
}

export default SideMenu;