import React, { useEffect, useState } from 'react';
import IconButton from '../components/IconButton'

export const InfoBox = () => {

    const [network, setNetwork] = useState('');

    useEffect(() => {
        console.log("--- Mounted InfoBox ---");
        setNetwork(localStorage['lit-network']);
        console.log("Network:", network);
    }, [])

    return <div className="">
        {network != null ? (
            <IconButton name={network} size={'sm'}/>
        ): ''}
    </div>;
};
