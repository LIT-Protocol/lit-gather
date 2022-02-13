import React, { useEffect, useState } from 'react';
import IconButton from '../components/IconButton'
import { storedAuth } from '../utils/storage';

export const InfoBox = () => {

    const [network, setNetwork] = useState('');

    useEffect(() => {
        if(storedAuth() != null){
            setNetwork(localStorage['lit-network']);
            console.log("Network:", network);
        }
    }, [])

    return <div className="">
        {network != null ? (
            <IconButton name={network} size={'sm'}/>
        ): ''}
    </div>;
};
