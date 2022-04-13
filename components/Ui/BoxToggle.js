const BoxToggle = ({
    current = false, 
    isLast = false,
    checked = false,
    onClick = {},
}) => {
    return (
        <div onClick={onClick} className="flex h-10 cursor-pointer">
            {/* Box */}
            <div className="w-10 h-10 border border-white flex justify-center">

                {/* If current */}
                {
                    ! current ? '' : 
                    <div className="bg-white rounded-full w-2 h-2 m-auto"></div>
                }

                {/* If checked */}
                {
                    ! checked ? '' : 
                    <div className="bg-[#1A800A] w-full h-full"></div>
                }
            </div>

            {/* Extension */}
            {
                isLast ? '' : 
                <div className="flex justify-center m-auto">
                    <div className="bg-white h-[1px] w-12"></div>
                </div>
            }
        </div>
    );
}

export default BoxToggle;