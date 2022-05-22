const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory("Money");
    
    // Hardhat will create a local ethereum network for the contract, which gets destroyed after the script completes
    const nftContract = await nftContractFactory.deploy();
    console.log("Contract deployed to:", nftContract.address);
}

const runMain = async() => {
    try{
        await main();
        process.exit(0);
    }
    catch(error) {
        console.log(error);
        process.exit(1);
    }
}

runMain();