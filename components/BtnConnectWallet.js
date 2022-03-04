import Btn from './Ui/Btn';
import { shortenWalletAddress } from '../utils/helper'
import { useAppContext } from '../state/AppProvider';

function BtnConnectWallet() {

  // context
  const appContext = useAppContext()
  const { connectedWalletAddress } = appContext.state;
  const { onClickConnectWallet } = appContext.methods;

  return <Btn
    id="connect-wallet"
    text={ shortenWalletAddress(connectedWalletAddress) || 'Connect Wallet' }
    onClick={() => onClickConnectWallet()}
  />


}

export default BtnConnectWallet;
