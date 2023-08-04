
import { useAccount, } from 'wagmi'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import { getAccount,getNetwork,getWalletClient } from '@wagmi/core'




export default function Interact() {

  const { address, isConnected } = useAccount()

  
  if (isConnected) {
    return <div>Connected to {address}</div> 
  }
  async function upload() {
    const account = getAccount() 
    const { chain, chains } = getNetwork()
    const walletClient = await getWalletClient()

    console.log(walletClient)

    if (!account.isConnected) {
      alert("Please Connect your Wallet")
    }
    else if (chain?.id !== 1287) {
      alert("Please connect to Moonbean Alpha network")
    }
    else {
      await walletClient?.writeContract({
        
      })
      console.log(account.isConnected)
      console.log(chain?.name)
      console.log(walletClient)

    }
  }

  return (
    <>
      <div>Welcome</div>
    </>
  )
 
}