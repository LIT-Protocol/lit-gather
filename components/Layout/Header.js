import BtnConnectWallet from "../BtnConnectWallet";
import LitLogo from "../Ui/LitLogo";
import React from 'react'
import { InfoBox } from "../InfoBox";

export default function LayoutHeader({subtitle}){
    
    return (
        <header className="sticky top-0 w-full bg-lit-dark relative mx-auto flex justify-between items-center h-16 py-9 px-6 z-10">
            <div className="relative">
                <LitLogo></LitLogo>
            </div>

            {/* Nav: Links */}
            <div className="flex items-center">
                {/* <InfoBox/> */}
                <BtnConnectWallet/>
            </div>
        </header>
    );
}