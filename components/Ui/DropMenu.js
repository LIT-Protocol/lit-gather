import { CogIcon } from "@heroicons/react/solid";
import { useState } from 'react';

const DropMenu = ({links}) => {

    const [toggle, setToggle] = useState(false);

    // -- close modal when clicked outside
    document.addEventListener('click', (e) => {
        if(! e.target.matches('.dropmenu')){
            setToggle(false);
        }
    });


    //
    // Event:: when button is clicked
    // @param { Element } clicked element
    // @return { void } 
    //
    const onToggle = (e) => {
        console.warn("--- onToggle ---");
        console.log(e.target);
        setToggle(!toggle);
    }

    return (
        <div className="relative inline-block text-left">
            <div onClick={(e) => onToggle(e)} className="dropmenu text-lit-100 p-1">
                <div className='m-auto flex w-6 pointer-events-none'>
                    <CogIcon className="w-6 pointer-events-none"/>
                </div>
            </div>

            { 
                ! toggle
                ? '' 
                : 
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                    
                        {
                            links.map((link) => {

                                const color = link.color ?? 'text-gray-700';

                                const style = `${color} block px-4 py-2 text-sm hover:bg-lit-100 cursor-pointer`;

                                const border = link.border ? `border-b border-grey-100` : '';

                                return (
                                    <div className={`py-1 ${border}`} role="none">
                                    <a key={link.text} onClick={(e) => link?.onClick(e)} className={style} role="menuitem" tabindex="-1" id="menu-item-0">{ link.text }</a>
                                    </div>
                                )
                            })
                        }
                    
                    {/* <div className="py-1" role="none">
                        <a onClick={() => {console.log("testing")}} className="text-gray-700 block px-4 py-2 text-sm hover:bg-lit-100 cursor-pointer" role="menuitem" tabindex="-1" id="menu-item-0">Edit</a>
                    </div> */}
                </div>
            }

            
        </div>
    );
}

export default DropMenu;