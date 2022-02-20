import MainLayout from "../../components/Layout/MainLayout";
import SideMenu from "../../components/SideMenu";
import DashboardLayout from "../../components/Layout/Dashboard";
import { fetchLockedSpaces } from "../../utils/fetch";
import { storedAuth } from "../../utils/storage";

const Dashboard = ({data}) => {

    

    console.log("DAT!,", data);

    return (
        <DashboardLayout>
            Oops.. cannot find any spaces
            
        </DashboardLayout>
    );
}

export default Dashboard;

// ========== Next.js Hooks ==========
//
// Prefetch data for this component
//
export async function getServerSideProps() {
    const data = await fetchLockedSpaces();

    // Pass data to the page via props
    return { props: { data } }
}

//
// Use Layout
//
Dashboard.getLayout = function getLayout(page){
    return (
        <MainLayout>
            { page }
        </MainLayout>
    )
}