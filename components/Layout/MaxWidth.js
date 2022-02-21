const MaxWidth = ({children}) => {
    return (
        <div className="flex justify-center pb-24">
            <section className="px-6 max-w-screen-xl w-full m-auto">
                { children }
            </section>
        </div>
    );
}

export default MaxWidth;