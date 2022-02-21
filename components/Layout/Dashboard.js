import SideMenu from "../SideMenu";

const DashboardLayout = ({children}) => {
    return (
        <div >
            {/* ===== Left ===== */}
            <div className="fixed top-[72px] h-screen pt-4 w-64 bg-lit-dark pr-12">
                <SideMenu/>
            </div>

            {/* ===== Right ===== */}
            <div className="ml-64 p-12">
                <div className="text-white">
                    {children}    
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;