import { useEffect } from "react";

const Loading = () => {

    useEffect(() => {

        var dots = [];
        var loading = document.getElementById('text-loading');

        setInterval(() => {

            dots.push('.');

            if(dots.length > 3){
                dots = ['.'];
            }

            loading.innerText = dots.join('') || '.';
        }, 333)
    }, [])
    
    return (
        <div className="w-full h-screen flex justify-center text-white">
            <span id="text-loading" className="m-auto"></span>
        </div>
    );
}

export default Loading;