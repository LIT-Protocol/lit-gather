import BtnConnectWallet from "../BtnConnectWallet";
import LitLogo from "../Ui/LitLogo";
import React from 'react'
import { InfoBox } from "../InfoBox";
import { useAppContext } from "../../state/AppProvider";
import Link from "next/link";

export default function LayoutHeader({subtitle}){

    // -- app context
    const appContext = useAppContext();
    const { walletIsConnected } = appContext.state;
    
    return (
        <header className="sticky top-0 w-full bg-lit-dark relative mx-auto flex justify-between items-center h-16 py-9 px-6 z-10">
            <div className="relative">
                <LitLogo/>
            </div>

            {/* Nav: Links */}
            <div className="flex items-center">
                {/* <InfoBox/> */}
                <div className="text-white">
                { 
                    !walletIsConnected ? '' 
                    :
                    <div className="mr-10">
                        <Link href="/dashboard">Dashboard</Link>
                    </div>
                }
                </div>
                <BtnConnectWallet/>
            </div>
        </header>
    );
}