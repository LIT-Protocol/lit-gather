import React, { useEffect, useState } from 'react';
import Btn from './Ui/Btn';
import { shortenWalletAddress } from '../utils/helper'
import { useAppContext } from '../state/AppProvider';

function BtnConnectWallet() {

  // context
  const appContext = useAppContext()
  const { connectedWalletAddress } = appContext.state;

  return <Btn
    id="connect-wallet"
    text={ shortenWalletAddress(connectedWalletAddress) || 'Connect Lit-Gather' }
    href="/connect-wallet"
  />


}

export default BtnConnectWallet;
