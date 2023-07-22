import React from "react";
import { useMoralis } from "react-moralis";
import { ConnectButton } from 'web3uikit';


export default function Header() {
  const { isWeb3Enabled } = useMoralis();

  if (false) {
    return (
        <div>
            
        </div>
    );
  } else {
      return (
        <ConnectButton moralisAuth={false}/>
      )
  }

 
}