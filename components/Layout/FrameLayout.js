import { AppProvider } from "../../state/AppProvider";
import LitLogo from "../Ui/LitLogo";

const FrameLayout = ({children}) => {
    return (
        <AppProvider>
            <header className="sticky top-0 w-full bg-[#2D0C72] relative mx-auto flex justify-between items-center h-16 py-9 px-6 z-10">
                <div className="relative">
                    <LitLogo subtitleColor={'text-[#CDC5DD]'}/>
                </div>
            </header>

            { children }
            
        </AppProvider>
    );
}

export default FrameLayout;