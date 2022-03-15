import MainLayout from "../../components/Layout/MainLayout";
import DashboardLayout from "../../components/Layout/Dashboard";
import { deleteMySpace, fetchMySpaces } from "../../utils/fetch";
import { useEffect, useState } from "react";
import { useAppContext } from "../../state/AppProvider";
import { storedNetwork } from "../../utils/storage";
import SpaceCard from "../../components/SpaceCard";
import { TrashIcon } from "@heroicons/react/solid";
import DropMenu from "../../components/Ui/DropMenu";

const Dashboard = () => {

    // -- app context
    const appContext = useAppContext();
    const { auth, joinSpace } = appContext.methods;
    const { LitJsSdk } = appContext.lit;

    // -- state
    const [spaces, setSpaces] = useState(null);
    
    // -- mounted
    useEffect(() => {
        auth(async () => {
            const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: storedNetwork()});
            const res = await fetchMySpaces({authSig}); 
            setSpaces(res.spaces);
            // console.log("res.spaces:", res.spaces)
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    
    // 
    // event:: onDelete space card
    // @param { Object } space
    // @return { void } 
    // 
    const onDelete = (space) => {

        // -- validate
        if( ! space ){
            console.error("❗ Space cannot be empty.");
            return;
        }
        
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

    //
    // event:: copy link
    // @param { String } space id on the table (NOT spaceId)
    // @return { String } url
    //
    const onCopyLink = (e, id) => {
        const url = window.location.protocol + '//' + window.location.host + '/space/' + id;

        var temp = e.target.innerText;

        navigator.clipboard.writeText(url).then(() => {

            e.target.innerText = 'Copied!';

            setTimeout(() => {
                e.target.innerText = temp;
            }, 2000)
        
        }, (err) => {
            console.error('Async: Could not copy text: ', err);
        });
    }

    return (
        <DashboardLayout>

            {/* ===== Title ===== */}
            <h1 className="leading-tight text-5xl text-white">
                Your Spaces

                

            </h1>

            <h5 className="text-[#FF3743] border border-[#FF3743] p-2 rounded-lg mt-2">
                <span>
                ** Please note that you can only <span className="text-red border-b border-red">delete</span> at the moment, you will need to re-create your space if you want to <span className="text-red border-b border-red">edit</span>
                </span>
            </h5>

            {/* ===== Content Area ===== */}
            <div className="mt-4">
            {
                ! spaces 
                ? 'Oops.. cannot find any spaces'
                : <div className="grid grid-cols-3 gap-8">
                    {
                        spaces.map((space) => {
                            
                            return (
                                <div key={space.id} className="flex relative max-w-sm">
                                    <SpaceCard
                                        space={space}
                                        restrictedAreas={JSON.parse(space.restrictedSpaces)}
                                        buttonAction={() => {}}
                                        // joinSpace(space)
                                        hover={false}
                                    />
                                    {/* onDelete(space) */}
                                    <div className="absolute top-0 p-2 w-full flex justify-right">
                                        <div onClick={() => {}} className="cursor-pointer border border-lit-400 bg-lit-900 ml-auto flex justify-center rounded text-sm hover:bg-lit-500 ">
                                            {/* <span className="w-6 p-1"><TrashIcon/></span> */}
                                            <DropMenu
                                                links={[
                                                    {
                                                        text: 'Join',
                                                        onClick: (e) => joinSpace(space),
                                                        border: true,
                                                    },
                                                    {
                                                        text: 'Copy invite link',
                                                        onClick: (e) => onCopyLink(e, space.id)
                                                    },
                                                    {
                                                        text: 'Copy in-game link',
                                                        onClick: (e) => onCopyLink(e, space.id + '?ingame=true'),
                                                        border: true,
                                                    },
                                                    {
                                                        text: 'Delete',
                                                        onClick: (e) => onDelete(space),
                                                        color: 'text-red',
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </div>            
                            )
                        })
                    }
                </div>
            }
            </div>
            
        </DashboardLayout>
    );
}

export default Dashboard;

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