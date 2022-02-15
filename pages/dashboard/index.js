import MainLayout from "../../components/Layout/MainLayout";
import SideMenu from "../../components/SideMenu";

const Dashboard = () => {
    return (

        <div className="bg-lit-dark w-64">
            {/* ===== Left ===== */}
            <div className="h-screen pt-4">

                <SideMenu/>

            </div>

            {/* ===== Right ===== */}
            <div>

            </div>
        </div>

    );
}

export default Dashboard;

Dashboard.getLayout = function getLayout(page){
    return (
        <MainLayout>
            { page }
        </MainLayout>
    )
}