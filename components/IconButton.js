import React from 'react';

//
// @param { * } required | when in a loop
// @param { String } required | will be used to generate dynamic css class name
// @param { Function } callback function when this component is clicked
// @param { Boolean } selected condition that returns true/false from the parent component
//
const IconButton = ({key, name = 'unnamed', callback, selected}) => {

const bgColor = `bg-color-${name}`;
const bgImage = `bg-image-${name}`;

  return <button key={key} onClick={callback}>
            <div className={`block cursor-pointer hover:bg-lit-400/.75 rounded-2xl py-2 m-1 border-box ${selected}`}>
                    <div className={`rounded-full w-12 h-12 flex m-auto ${bgColor}`}>
                        <div className="m-auto w-full h-full p-3 box-border">
                            <div className={`w-full h-full bg-contain ${bgImage}`}></div>
                        </div>
                    </div>
                <div className="text-xs text-white m-auto flex justify-center">
                    <span className="mt-1 capitalize">{name} </span>
                </div>
            </div>
        </button>
};

export default IconButton;