import { AppProvider } from "../../state/AppProvider";
import TwitterIcon from "../Icon/TwitterIcon";
import DiscordIcon from "../Icon/DiscordIcon";
import LayoutHeader from "./Header";
import Link from "next/link";

const MainLayout = ({ children }) => {
    return (
        <>
            <AppProvider>
                <LayoutHeader/>
                <main className="pb-24">
                    {children}
                </main>

                {/* Footer */}
                <div className="fixed bottom-0 text-[#9E77F3] bg-black w-full h-24 flex justify-center">
                    <ul className="m-auto flex gap-12">
                        <li><a target="_blank" href="https://twitter.com/litprotocol"><TwitterIcon/></a></li>
                        <li><a target="_blank" href="https://litgateway.com/discord"><DiscordIcon/></a></li>
                        <li><a target="_blank" href="https://litprotocol.com/">Protocol</a></li>
                        <li><a target="_blank" href="https://developer.litprotocol.com/docs/intro">Developer Docs</a></li>
                        <li><Link href="/instructions">Instructions</Link></li>
                        <li><a target="_blank" href="https://airtable.com/shr2NWJbH1Y6Y3kOU">Contacts</a></li>
                    </ul>
                </div>
            </AppProvider>
        </>
    );
}

export default MainLayout;