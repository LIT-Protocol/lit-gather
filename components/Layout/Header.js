import BtnConnectWallet from "../BtnConnectWallet";
import LitLogo from "../LitLogo";
import React from 'react'

export default function LayoutHeader({subtitle}){

    const title = `Lit-Gather Space${subtitle == null ? '' : `::${subtitle}`}`;
    const description = 'Token-gate your gather space!';

    return (
        <>
            {/* Header */}
            <header className="relative h-screen w-11/12 m-auto h-10 mt-8 flex justify-between items-center">
                <div className="relative">
                <LitLogo></LitLogo>
                </div>

                {/* Nav: Links */}
                <div className="flex items-center">
                <BtnConnectWallet></BtnConnectWallet>
                </div>
            </header>{/* ...Header */}
        </>
    );
}