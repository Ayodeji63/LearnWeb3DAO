import { Contract, ethers, providers, utils } from "ethers"
import Head from "next/head"
import { useState, useEffect, useRef } from "react"
import Web3Modal from "web3modal"
import { NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS } from "../constants"
import styles from "../styles/Home.module.css"

export default function Home() {
  const [wallectConnected, setWallectConnected] = useState(false)
  const [presalestarted, setPresalestarted] = useState(false)
  const [presaleEnded, setPresaleEnded] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(false)
  const web3modalRef = useRef()

  const presaleMint = async () => {
    try {
      const signer = await getProviderOrSigner(true)
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      )

      const txn = await nftContract.preSaleMint({
        value: utils.parseEther("0.005"),
      })
      setLoading(true)
      await txn.wait()
      setLoading(false)
      window.alert("You successfully minted a CryptoDev")
    } catch (e) {
      console.log(e)
    }
  }

  const publicMint = async () => {
    try {
      const signer = await getProviderOrSigner(true)
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      )

      const txn = await nftContract.Mint({
        value: utils.parseEther("0.01"),
      })
      setLoading(true)
      await txn.wait()
      setLoading(false)

      window.alert("You successfully minted a CryptoDev")
    } catch (e) {
      console.log(e)
    }
  }

  const getOwner = async () => {
    try {
      const signer = await getProviderOrSigner(true)

      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      )

      const owner = await nftContract.owner()
      const userAddress = await signer.getAddress()

      if (owner.toLowerCase() === userAddress.toLowerCase()) {
        setIsOwner(true)
      }
    } catch (e) {
      console.error(e)
    }
  }
  const connectWallet = async () => {
    try {
      setLoading(true)
      await getProviderOrSigner()
      setWallectConnected(true)
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  const getProviderOrSigner = async (needSigner = false) => {
    // We need to gain access to the provider/Signer from Metamask

    const provider = await web3modalRef.current.connect()
    const web3Provider = new ethers.providers.Web3Provider(provider)

    //If the user is NOT connected to Goerli, tell them tio switch to Goerli
    const { chainId } = await web3Provider.getNetwork()
    if (chainId != 5) {
      window.alert("please switch to the Goerli Network")
      throw new Error("Incorrect network")
    }

    if (needSigner) {
      const signer = web3Provider.getSigner()
      return signer
    }

    return provider
  }

  // start the presale
  const startPresale = async () => {
    try {
      const signer = await getProviderOrSigner(true)

      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        signer
      )
      const txn = await nftContract.startPresale()
      setLoading(true)
      await txn.wait()
      setLoading(false)

      setPresalestarted(true)
    } catch (e) {
      console.log(e)
    }
  }
  // check if presale ended
  const checkIfPresaleEnded = async () => {
    try {
      const provider = await getProviderOrSigner()

      // Get an instance of NFT Contract
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      )
      // This will return a BigNumber because presaleEnded is a uint256;
      // This will return a timestamp in seconds
      const presaleEndTime = await nftContract.presaleEnded()
      const currentTimeInSeconds = Date.now() / 1000

      const hasPresaleEnded = presaleEndTime.lt(
        Math.floor(currentTimeInSeconds)
      )

      setPresaleEnded(hasPresaleEnded)
    } catch (e) {
      console.log(e)
    }
  }

  // check if preseale is already started
  const checkIfPresaleStarted = async () => {
    try {
      const provider = await getProviderOrSigner()

      // Get an instance of your NFT contract
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      )

      const isPresaleStarted = await nftContract.presaleStarted()
      setPresalestarted(isPresaleStarted)
      console.log(`${isPresaleStarted}`)

      return isPresaleStarted
    } catch (e) {
      console.log(e)
      return false
    }
  }

  const onPageLoad = async () => {
    await connectWallet()
    await getOwner()
    const presaleStarted = await checkIfPresaleStarted()
    console.log(`${presaleStarted}`)

    if (presaleStarted) {
      await checkIfPresaleEnded()
    }
  }
  useEffect(() => {
    if (!wallectConnected) {
      web3modalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      })

      onPageLoad()
    }
  }, [presalestarted])

  function renderButton() {
    if (!wallectConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect Wallet
        </button>
      )
    }
    if (loading) {
      return <span className={styles.description}>Loading.....</span>
    }

    if (isOwner && !presalestarted) {
      // render a button to start the presale
      return (
        <button onClick={startPresale} className={styles.button}>
          Start Presale
        </button>
      )
    }

    if (!presalestarted) {
      // allow users to mint in presale
      // they nee to be in whitelist for this to work
      return (
        <div>
          <span className={styles.description}>
            Presale has not started yet. Come back later
          </span>
        </div>
      )
    }

    if (presalestarted && !presaleEnded) {
      // allow users to mint in presale
      // they need to be i whitelist for this to work

      return (
        <div>
          <span className={styles.description}>
            Presale has started! If your address is whitelisted, you can mint a
            CryptoDev
          </span>
          <button className={styles.button} onClick={presaleMint}>
            Presale Mint 🚀
          </button>
        </div>
      )
    }

    if (presaleEnded) {
      ;<div>
        <span className={styles.description}>
          Presale has ended! you can mint a CryptoDev in public sale.
        </span>
        <button className={styles.button} onClick={publicMint}>
          Public Mint 🚀
        </button>
      </div>
    }
  }

  return (
    <div>
      <Head>
        <title>Crypto Devs NFT</title>
      </Head>
      <div className={styles.main}>
        <div>
          <h1>Welcome to CryptoDevs NFT</h1>
          <span className={styles.description}>
            CryptoDevs NFT is a collection for developers in web3
          </span>

          {renderButton()}
        </div>
        <img className={styles.image} src="/9.svg"></img>
      </div>
    </div>
  )
}
