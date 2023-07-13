"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
require("./type-extensions");
const plugins_1 = require("hardhat/plugins");
require("@nomicfoundation/hardhat-ethers");
const helpers_1 = require("./helpers");
(0, config_1.extendEnvironment)((hre) => {
    const prevEthers = hre.ethers;
    hre.ethers = (0, plugins_1.lazyObject)(() => {
        // We cast to any here as we hit a limitation of Function#bind and
        // overloads. See: https://github.com/microsoft/TypeScript/issues/28582
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        prevEthers.getContractFactoryWithSignerAddress = helpers_1.getContractFactoryWithSignerAddress.bind(null, hre);
        prevEthers.getContractAtWithSignerAddress = (nameOrAbi, address, signer) => (0, helpers_1.getContractAtWithSignerAddress)(hre, nameOrAbi, address, signer);
        prevEthers.getSignerOrNull = (address) => (0, helpers_1.getSignerOrNull)(hre, address);
        prevEthers.getNamedSigners = () => (0, helpers_1.getNamedSigners)(hre);
        prevEthers.getNamedSigner = (name) => (0, helpers_1.getNamedSigner)(hre, name);
        prevEthers.getNamedSignerOrNull = (name) => (0, helpers_1.getNamedSignerOrNull)(hre, name);
        prevEthers.getUnnamedSigners = () => (0, helpers_1.getUnnamedSigners)(hre);
        prevEthers.getContract = (name, signer) => (0, helpers_1.getContract)(hre, name, signer);
        prevEthers.getContractOrNull = (name, signer) => (0, helpers_1.getContractOrNull)(hre, name, signer);
        return prevEthers;
    });
});
//# sourceMappingURL=index.js.map