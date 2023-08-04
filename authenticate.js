import { getAccount,getNetwork,getWalletClient } from '@wagmi/core'

export default async function authenticate() {
    const account = getAccount() 
    const { chain, chains } = getNetwork()
    const walletClient = await getWalletClient()

    if (!account.isConnected) {
      alert("Please Connect your Wallet")
    }else {
      //await walletClient?.writeContract({})
      console.log(account.isConnected)
      console.log(chain?.name)
      console.log(walletClient)

    }
}
