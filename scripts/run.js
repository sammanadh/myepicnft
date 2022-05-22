const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
    
    // Hardhat will create a local ethereum network for the contract, which gets destroyed after the script completes
    const nftContract = await nftContractFactory.deploy();
    
    // Wait until the contract is officially mined and depolyed to our local blockchain
    // Hardhat create fake "miners" in our machine to best imitate the actual blockchain
    await nftContract.deployed();
    console.log("Contract deployed to: ", nftContract.address);

    // We are also going to mint initial NFT on our behaf
    // Call the function
    let txn = await nftContract.makeAnEpicNFT();
    // Wait for the transaction to finish
    await txn.wait();
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