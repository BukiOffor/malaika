import { createPublicClient, http } from 'viem'
import { mainnet,sepolia, hardhat,goerli} from 'viem/chains'

export const publicClient = createPublicClient({
  chain: hardhat,
  transport: http()
})