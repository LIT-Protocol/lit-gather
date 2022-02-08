import BtnConnectWallet from "../BtnConnectWallet";
import LitLogo from "../LitLogo";
import React, { useEffect } from 'react'
import { useRouter, withRouter } from 'next/router'
import { InfoBox } from "../InfoBox";

export default function LayoutHeader({subtitle}){

    const router = useRouter()
    let network;

    // -- mounted
    useEffect(() => {
        console.log("--- LayoutHeader Mounted ---");
    }, []);

    return (
        <>
            <header className="sticky top-0 relative w-11/12 mx-auto h-10 mt-8 flex justify-between items-center">
                <div className="relative">
                    <LitLogo></LitLogo>
                </div>

                {/* Nav: Links */}
                <div className="flex items-center">
                    <InfoBox/>
                    <BtnConnectWallet/>
                </div>
            </header>
        </>
    );
}