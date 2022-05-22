const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
    
    // Hardhat will create a local ethereum network for the contract, which gets destroyed after the script completes
    const nftContract = await nftContractFactory.deploy();
    console.log("Contract deployed to:", nftContract.address);
    
    // Call the function.
    let txn1 = await nftContract.makeAnEpicNFT()
    // Wait for it to be mined.
    await txn1.wait()
    console.log("Minted NFT #1")


    // Call the function.
    let txn2 = await nftContract.makeAnEpicNFT()
    // Wait for it to be mined.
    await txn2.wait()
    console.log("Minted NFT #2")
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