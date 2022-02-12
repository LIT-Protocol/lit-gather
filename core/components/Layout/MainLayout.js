import LayoutHeader from "./Header";

const MainLayout = ({ children }) => {
    return (
        <>
            <LayoutHeader/>
            <main>
                {children}
            </main>
        </>
    );
}

export default MainLayout;