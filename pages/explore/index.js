import MainLayout from "../../components/Layout/MainLayout";
import MaxWidth from "../../components/Layout/MaxWidth";

const Explore = () => {
    return (
        <MaxWidth>
            <div className="text-white text-5xl mt-12 text-center">
                Explore Spaces
            </div>
        </MaxWidth>
    );
}

export default Explore;

Explore.getLayout = function getLayout(page){
    return (
        <MainLayout>
            {page}
        </MainLayout>
    )
}