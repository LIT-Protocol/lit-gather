import { AppProvider } from "../../state/AppProvider";
import TwitterIcon from "../Icon/TwitterIcon";
import DiscordIcon from "../Icon/DiscordIcon";
import LayoutHeader from "./Header";
import Link from "next/link";

const MainLayout = ({ children, hideFooter = false }) => {
    return (
        <>
            <AppProvider>
                <LayoutHeader/>
                <main className="pb-24">
                    {children}
                </main>

                {/* Footer */}
                { 
                    hideFooter 
                    ? '' 
                    :
                    <div className="fixed bottom-0 text-[#9E77F3] bg-black w-full h-24 flex justify-center">
                        <ul className="m-auto flex gap-12">
                            <li><a target="_blank" rel="noreferrer" href="https://twitter.com/litprotocol"><TwitterIcon/></a></li>
                            <li><a target="_blank" rel="noreferrer" href="https://litgateway.com/discord"><DiscordIcon/></a></li>
                            <li><a target="_blank" rel="noreferrer" href="https://litprotocol.com/">Lit Protocol</a></li>
                            {/* <li><a target="_blank" rel="noreferrer" href="https://developer.litprotocol.com/docs/intro">Developer Docs</a></li>
                            <li><Link href="/instructions">Instructions</Link></li> */}
                            <li><a target="_blank" rel="noreferrer" href="https://airtable.com/shr2NWJbH1Y6Y3kOU">Contact</a></li>
                            <li><a target="_blank" rel="noreferrer" href="https://discord.com/channels/896185694857343026/951253127028437002">Support</a></li>
                        </ul>
                    </div>

                }
            </AppProvider>
        </>
    );
}

export default MainLayout;