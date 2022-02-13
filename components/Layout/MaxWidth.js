const MaxWidth = ({children}) => {
    return (
        <div className="flex justify-center">
            <section className="px-6 max-w-screen-xl w-full m-auto">
                { children }
            </section>
        </div>
    );
}

export default MaxWidth;