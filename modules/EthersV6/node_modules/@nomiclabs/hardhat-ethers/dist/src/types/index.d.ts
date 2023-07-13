import type * as ethers from 'ethers';
import type { Libraries } from '@nomicfoundation/hardhat-ethers/types';
export declare interface FactoryOptionsWithSignerAddress {
    signer: string;
    libraries?: Libraries;
}
export declare function getContractFactoryWithSignerAddress<ContractType extends ethers.BaseContract = ethers.BaseContract>(name: string, signerOrOptions: string | FactoryOptionsWithSignerAddress): Promise<ethers.ContractFactory<any[], ContractType>>;
export declare function getContractFactoryWithSignerAddress<ContractType extends ethers.BaseContract = ethers.BaseContract>(abi: any[], bytecode: ethers.BytesLike, signer: string): Promise<ethers.ContractFactory<any[], ContractType>>;
//# sourceMappingURL=index.d.ts.map