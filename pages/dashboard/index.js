import MainLayout from "../../components/Layout/MainLayout";

const Dashboard = () => {
    return (
        <div className="text-white text-5xl">
            Dashboard
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