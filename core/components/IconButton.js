import React from 'react';

//
// @param { * } required | when in a loop
// @param { String } required | will be used to generate dynamic css class name
// @param { Function } callback function when this component is clicked
// @param { Boolean } selected condition that returns true/false from the parent component
//
const IconButton = ({name = 'unnamed', callback, selected, size}) => {

const bgColor = size == 'sm' ? `bg-color-${name}-gradient` : `bg-color-${name}`;
const bgImage = `bg-image-${name}`;
const iconSize = size == 'sm' ? 'w-6 h-6' : 'w-12 h-12';
const iconPadding = size == 'sm' ? 'p-1' : 'p-3';
const roundedIcon = size == 'sm' ? 'rounded-full' : ''; 
const structure = size == 'sm' ? 'mr-4 flex px-1' : 'py-2 hover:bg-lit-400/.75';
const textPadding = size == 'sm' ? 'pl-2' : 'mt-1 ';
const textSize = size == 'sm' ? 'text-base' : 'text-xs';
const buttonStyle = size == 'sm' ? `${bgColor} mr-4 rounded-full h-10` : '';

  return <button id={`icon-${name}`} onClick={callback} className={buttonStyle}>
            <div className={`block cursor-pointer rounded-2xl  m-1 border-box ${structure} ${selected}`}>
                <div className={`rounded-full ${iconSize} flex m-auto ${bgColor}`}>
                    <div className={`m-auto w-full h-full ${iconPadding} box-border`}>
                        <div className={`w-full h-full bg-contain ${roundedIcon} ${bgImage}`}></div>
                    </div>
                </div>
                <div className={`${textSize} text-white m-auto flex justify-center`}>
                    <span className={`capitalize ${textPadding}`}>{name} </span>
                </div>
            </div>
        </button>
};

export default IconButton;