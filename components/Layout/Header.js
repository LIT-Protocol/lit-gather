import BtnConnectWallet from "../BtnConnectWallet";
import LitLogo from "../Ui/LitLogo";
import React from 'react'
import { InfoBox } from "../InfoBox";

export default function LayoutHeader({subtitle}){

    return (
        <header className="bg-lit-dark relative w-full px-6 mx-auto flex justify-between items-center h-16 py-9">
            <div className="relative">
                <LitLogo></LitLogo>
            </div>

            {/* Nav: Links */}
            <div className="flex items-center">
                <InfoBox/>
                <BtnConnectWallet/>
            </div>
        </header>
    );
}