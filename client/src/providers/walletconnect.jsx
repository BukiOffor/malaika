'use client';

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, polygon, sepolia, goerli,hardhat } from 'wagmi/chains'


const chains = [arbitrum, mainnet, polygon, sepolia, goerli, hardhat ]

const projectId = '34043931dedf67433e6f95bfa3205586'//process.env.API_KEY as string

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function WalletConnect() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}></WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
