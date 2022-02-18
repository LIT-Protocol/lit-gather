import SideMenu from "../SideMenu";

const DashboardLayout = ({children}) => {
    return (
        <div className="w-full flex">
            {/* ===== Left ===== */}
            <div className="h-screen pt-4 w-64 bg-lit-dark pr-12">
                <SideMenu/>
            </div>

            {/* ===== Right ===== */}
            <div className="p-12 w-full">
                <div className="text-white">
                    {children}    
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;