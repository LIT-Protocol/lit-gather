import MainLayout from "../../components/Layout/MainLayout";
import DashboardLayout from "../../components/Layout/Dashboard";
import { deleteMySpace, fetchMySpaces } from "../../utils/fetch";
import { useEffect, useState } from "react";
import { useAppContext } from "../../state/AppProvider";
import { storedNetwork } from "../../utils/storage";
import SpaceCard from "../../components/SpaceCard";

const Dashboard = () => {

    // -- app context
    const appContext = useAppContext();
    const { auth } = appContext.methods;
    const { LitJsSdk } = appContext.lit;

    // -- state
    const [spaces, setSpaces] = useState(null);
    
    // -- mounted
    useEffect(() => {
        auth(async () => {
            const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: storedNetwork()});
            const res = await fetchMySpaces({authSig}); 
            setSpaces(res.spaces);
            console.log("res.spaces:", res.spaces)
        });
    }, []);
    
    // -- event:: onClick space card
    const onClick = (space) => {
        
        // -- prompt user
        const sure = confirm("Are you sure you want to delete this?") == true;
        
        // -- validate
        if( ! sure ){
            return;
        }
        
        auth(async () => {
            const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: storedNetwork()});
            await deleteMySpace({authSig, space});
            const res = await fetchMySpaces({authSig}); 
            setSpaces(res.spaces);
        });

        
    }

    return (
        <DashboardLayout>
            {
                ! spaces 
                ? 'Oops.. cannot find any spaces'
                : <div className="grid grid-cols-3 gap-8">
                    {
                        spaces.map((space, i) => {
                            return (
                                <SpaceCard key={i}
                                    space={space}
                                    restrictedAreas={JSON.parse(space.restrictedSpaces)}
                                    buttonAction={() => onClick(space)}
                                />
                            )
                        })
                    }
                </div>
            }
            
        </DashboardLayout>
    );
}

export default Dashboard;

// ========== Next.js Hooks ==========
//
// Prefetch data for this component
//
// export async function getServerSideProps() {
//     const data = await fetchMySpaces();

//     // Pass data to the page via props
//     return { props: { data } }
// }

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