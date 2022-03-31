import Btn from './Ui/Btn';
import { shortenWalletAddress } from '../utils/helper'
import { useAppContext } from '../state/AppProvider';

function BtnConnectWallet({bgColor, hoverColor, css, onClick}) {

  // context
  const appContext = useAppContext()
  const { connectedWalletAddress } = appContext.state;
  const { onClickConnectWallet } = appContext.methods;

  const _onClick = () => {
    if(onClick){
      onClick();
    }else{
      onClickConnectWallet();
    }
  }

  return <Btn
    id="connect-wallet"
    text={ shortenWalletAddress(connectedWalletAddress) || 'Connect Wallet' }
    onClick={() => _onClick()}
    bgColor={bgColor}
    hoverColor={hoverColor}
    css={css}
  />


}

export default BtnConnectWallet;
