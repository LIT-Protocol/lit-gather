import { AppProvider } from "../../state/AppProvider";
import LayoutHeader from "./Header";

const MainLayout = ({ children }) => {
    return (
        <>
            <AppProvider>
                <LayoutHeader/>
                <main>
                    {children}
                </main>
            </AppProvider>
        </>
    );
}

export default MainLayout;