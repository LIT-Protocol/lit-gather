import MainLayout from "../../components/Layout/MainLayout";
import SideMenu from "../../components/SideMenu";
import DashboardLayout from "../../components/Layout/Dashboard";

const Dashboard = () => {
    return (
        <DashboardLayout>
            Opps.. cannot find any spaces
        </DashboardLayout>
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