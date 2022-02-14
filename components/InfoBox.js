import React, { useEffect, useState } from 'react';
import IconButton from '../components/IconButton'
import { useAppContext } from '../state/AppProvider';

export const InfoBox = () => {

    const appContext = useAppContext()
    const { connectedNetwork } = appContext.state;

    return <div className="text-white">
        {connectedNetwork != null ? (
            <IconButton name={connectedNetwork} size={'sm'}/>
        ): ''}
    </div>;
};
