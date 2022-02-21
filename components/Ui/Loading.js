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

            loading.innerText = 'Loading' + dots.join('') || '.';
        }, 500)
    }, [])
    
    return (
        <div className="flex justify-center text-white">
            <span id="text-loading" className="m-auto"></span>
        </div>
    );
}

export default Loading;