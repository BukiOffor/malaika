"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContractOrNull = exports.getContract = exports.getUnnamedSigners = exports.getNamedSignerOrNull = exports.getNamedSigner = exports.getNamedSigners = exports.getSignerOrNull = exports.getContractAtWithSignerAddress = exports.getContractFactoryWithSignerAddress = void 0;
async function getContractFactoryWithSignerAddress(hre, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
nameOrAbi, bytecodeOrFactoryOptions, signer) {
    let actualSigner;
    if (typeof nameOrAbi === 'string') {
        if (typeof bytecodeOrFactoryOptions === 'string') {
            actualSigner = await hre.ethers.getSigner(bytecodeOrFactoryOptions);
            return hre.ethers.getContractFactory(nameOrAbi, actualSigner);
        }
        const FactoryOptionsWithSignerAddress = bytecodeOrFactoryOptions;
        actualSigner = await hre.ethers.getSigner(FactoryOptionsWithSignerAddress.signer);
        return hre.ethers.getContractFactory(nameOrAbi, {
            libraries: FactoryOptionsWithSignerAddress.libraries,
            signer: actualSigner,
        });
    }
    actualSigner = await hre.ethers.getSigner(signer);
    return hre.ethers.getContractFactory(nameOrAbi, bytecodeOrFactoryOptions, actualSigner);
}
exports.getContractFactoryWithSignerAddress = getContractFactoryWithSignerAddress;
async function getContractAtWithSignerAddress(hre, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
nameOrAbi, address, signer) {
    const actualSigner = await hre.ethers.getSigner(signer);
    return hre.ethers.getContractAt(nameOrAbi, address, actualSigner);
}
exports.getContractAtWithSignerAddress = getContractAtWithSignerAddress;
async function getSignerOrNull(hre, address) {
    try {
        // TODO do not use try catch
        const signer = await hre.ethers.getSigner(address);
        return signer;
    }
    catch (e) {
        return null;
    }
}
exports.getSignerOrNull = getSignerOrNull;
async function getNamedSigners(hre) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getNamedAccounts = hre.getNamedAccounts;
    if (getNamedAccounts !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const namedAccounts = (await getNamedAccounts());
        const namedSigners = {};
        for (const name of Object.keys(namedAccounts)) {
            try {
                const address = namedAccounts[name];
                if (address) {
                    const signer = await getSignerOrNull(hre, address); // TODO cache ?
                    if (signer) {
                        namedSigners[name] = signer;
                    }
                }
            }
            catch (e) { }
        }
        return namedSigners;
    }
    throw new Error(`No Deployment Plugin Installed, try 'import "harhdat-deploy"'`);
}
exports.getNamedSigners = getNamedSigners;
async function getNamedSigner(hre, name) {
    const signer = await getNamedSignerOrNull(hre, name);
    if (!signer) {
        throw new Error(`no signer for ${name}`);
    }
    return signer;
}
exports.getNamedSigner = getNamedSigner;
async function getNamedSignerOrNull(hre, name) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getNamedAccounts = hre.getNamedAccounts;
    if (getNamedAccounts !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const namedAccounts = (await getNamedAccounts());
        const address = namedAccounts[name];
        if (!address) {
            throw new Error(`no account named ${name}`);
        }
        const signer = await getSignerOrNull(hre, address);
        if (signer) {
            return signer;
        }
        return null;
    }
    throw new Error(`No Deployment Plugin Installed, try 'import "harhdat-deploy"'`);
}
exports.getNamedSignerOrNull = getNamedSignerOrNull;
async function getUnnamedSigners(hre) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getUnnamedAccounts = hre.getUnnamedAccounts;
    if (getUnnamedAccounts !== undefined) {
        const unnamedAccounts = (await getUnnamedAccounts());
        const unnamedSigners = [];
        for (const address of unnamedAccounts) {
            if (address) {
                try {
                    const signer = await getSignerOrNull(hre, address);
                    if (signer) {
                        unnamedSigners.push(signer); // TODO cache ?
                    }
                }
                catch (e) { }
            }
        }
        return unnamedSigners;
    }
    throw new Error(`No Deployment Plugin Installed, try 'import "harhdat-deploy"'`);
}
exports.getUnnamedSigners = getUnnamedSigners;
async function getContract(hre, name, signer) {
    const contract = await getContractOrNull(hre, name, signer);
    if (contract === null) {
        throw new Error(`No Contract deployed with name: ${name}`);
    }
    return contract;
}
exports.getContract = getContract;
async function getContractOrNull(hre, name, signer) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deployments = hre.deployments;
    if (deployments !== undefined) {
        const get = deployments.getOrNull;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const contract = (await get(name));
        if (contract === undefined) {
            return null;
        }
        if (typeof signer === 'string') {
            return getContractAtWithSignerAddress(hre, contract.abi, contract.address, signer);
        }
        return hre.ethers.getContractAt(contract.abi, contract.address, signer);
    }
    throw new Error(`No Deployment Plugin Installed, try 'import "harhdat-deploy"'`);
}
exports.getContractOrNull = getContractOrNull;
//# sourceMappingURL=helpers.js.map