import type { ethers } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import type { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { FactoryOptionsWithSignerAddress } from './types';
export declare function getContractFactoryWithSignerAddress(hre: HardhatRuntimeEnvironment, name: string, signerOrOptions: string | FactoryOptionsWithSignerAddress): Promise<ethers.ContractFactory>;
export declare function getContractFactoryWithSignerAddress(hre: HardhatRuntimeEnvironment, abi: any[], bytecode: ethers.BytesLike, signer: string): Promise<ethers.ContractFactory>;
export declare function getContractAtWithSignerAddress<ContractType extends ethers.BaseContract = ethers.BaseContract>(hre: HardhatRuntimeEnvironment, nameOrAbi: string | any[], address: string, signer: string): Promise<ContractType>;
export declare function getSignerOrNull(hre: HardhatRuntimeEnvironment, address: string): Promise<SignerWithAddress | null>;
export declare function getNamedSigners(hre: HardhatRuntimeEnvironment): Promise<Record<string, SignerWithAddress>>;
export declare function getNamedSigner(hre: HardhatRuntimeEnvironment, name: string): Promise<SignerWithAddress>;
export declare function getNamedSignerOrNull(hre: HardhatRuntimeEnvironment, name: string): Promise<SignerWithAddress | null>;
export declare function getUnnamedSigners(hre: HardhatRuntimeEnvironment): Promise<SignerWithAddress[]>;
export declare function getContract<ContractType extends ethers.BaseContract = ethers.BaseContract>(hre: HardhatRuntimeEnvironment, name: string, signer?: ethers.Signer | string): Promise<ContractType>;
export declare function getContractOrNull<ContractType extends ethers.BaseContract = ethers.BaseContract>(hre: HardhatRuntimeEnvironment, name: string, signer?: ethers.Signer | string): Promise<ContractType | null>;
//# sourceMappingURL=helpers.d.ts.map