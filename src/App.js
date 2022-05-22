import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import MyEpicNft from "./utils/MyEpicNFT.json";
import './App.css';

const CONTRACT_ADDRESS = '0xd9Cc2A3441E63fb28c459800aD487cdc2ee0c5b5';

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [minting, setMinting] = useState(false);
  const [mintedTokenId, setMintedTokenId] = useState();
  const [txnHash, setTxnHash] = useState("");

  const verifyWalletNetwork = async () => {
    const { ethereum } = window;
    if (ethereum) {
      let chainId = await ethereum.request({ method: "eth_chainId" });

      // String, hex code of the chainId of the Rinkeby test network
      const rinkebyChainid = "0x4";
      if (chainId !== rinkebyChainid) {
        alert("You are not connected to the Rinkeby Test Network");
      }
    } else {

    }
  }

  const checkIfWalletIsConnected = async () => {
    // First make sure you have access to window.ethereum
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Please first install metamask extension!");
    } else {
      console.log("Metamask installed", ethereum);
    }

    // Check if user has authorized access to his/her wallet
    const accounts = await ethereum.request({ method: 'eth_accounts' })

    // If the user has multiple authorized accounts we will only grap the first one
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);

      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener()
      verifyWalletNetwork();
    } else {
      console.log("No authorized accounts found");
    }

  }

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MyEpicNft.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          setMintedTokenId(tokenId.toNumber());
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener()

      verifyWalletNetwork();
    } catch (err) {
      console.log(err)
    }
  }

  const askContractToMintNFT = async () => {

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, MyEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();

        setMinting(true);
        console.log("Mining...please wait.");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        setTxnHash(nftTxn.hash);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }

    setMinting(false);
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // Renders when wallet is not connected
  const renderNotConnectedContainer = () => (
    <div className="App">
      <button className='cta-button connect-wallet-button' onClick={connectWallet}>
        Connect to Wallet
      </button>
    </div>
  );

  return (
    <div className='App'>
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {
            !currentAccount ?
              renderNotConnectedContainer() :
              (
                <button className='cta-button connected-wallet-button' onClick={askContractToMintNFT} disabled={minting}>
                  {minting ? "Minting. Please Wait" : "Mint NFT"}
                </button>
              )
          }
        </div>
        {
          txnHash ?
            <div>
              <div>
                Mined, click to see transaction: <a href={`https://rinkeby.etherscan.io/tx/${txnHash}`} target="_blank">View Transaction</a>
              </div>
              <div>
                View NFT (in opensea): <a href={`https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${mintedTokenId}`} target="_blank">View NFTs in OpenSea</a>
              </div>
            </div> :
            <></>
        }
        {/* <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div> */}
      </div>
    </div>
  )
}

export default App;
