import { Contract, ethers, providers, utils } from "ethers"
import Head from "next/head"
import React, { useEffect, useRef, useState } from "react"
import { render } from "react-dom"
import Web3Modal from "web3modal"
import { abi, NFT_CONTRACT_ADDRESS } from "../constants"
import styles from "../styles/Home.module.css"
import { CSSProperties } from "react"
import ClipLoader from "react-spinners/ClipLoader"
import HashLoader from "react-spinners/HashLoader"

export default function Home() {
  const override = {
    display: "flex",
    margin: "auto",
    borderColor: "blue",
  }
  const [isOwner, setIsOwner] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [presaleStarted, setPresaleStarted] = useState(false)
  const [presaleEnded, setPresaleEnded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [numTokensMinted, setNumTokensMinted] = useState("")
  let [color, setColor] = useState("#0000ff")
  const web3ModalRef = useRef()

  const getNumMintedTokens = async () => {
    try {
      const provider = await getProviderOrSigner()
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider)

      const numTokenIds = await nftContract.tokenIds()
      setNumTokensMinted(numTokenIds.toString())
      console.log(numTokenIds)
    } catch (e) {
      console.log(e)
    }
  }
  const presaleMint = async () => {
    try {
      const signer = await getProviderOrSigner(true)
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer)

      const txn = await nftContract.presaleMint({
        value: utils.parseEther("0.01"),
      })
      setLoading(true)
      await txn.wait(2)
      setLoading(false)
      window.alert("You successfully minted a CryptoDev!")
    } catch (e) {
      console.error(e)
    }
  }

  const publicMint = async () => {
    try {
      const signer = await getProviderOrSigner(true)
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer)

      const txn = await nftContract.mint({
        value: utils.parseEther("0.01"),
      })
      setLoading(true)
      await txn.wait()
      setLoading(false)
      window.alert("You successfully minted a CryptoDev!")
    } catch (e) {
      console.error(e)
    }
  }

  const getOwner = async () => {
    try {
      const signer = await getProviderOrSigner(true)

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer)

      const owner = await nftContract.owner()
      const userAddress = await signer.getAddress()

      if (owner.toLowerCase() === userAddress.toLowerCase()) {
        setIsOwner(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const startPresale = async () => {
    try {
      const signer = await getProviderOrSigner(true)
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer)

      const txn = await nftContract.startPresale()
      setLoading(true)
      await txn.wait()
      setPresaleStarted(true)
      setLoading(false)
    } catch (e) {
      console.error(e)
    }
  }

  const checkIfPresaleStarted = async () => {
    try {
      const provider = await getProviderOrSigner()
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider)

      const isPresaleStarted = await nftContract.presaleStarted()
      setPresaleStarted(isPresaleStarted)
      return isPresaleStarted
    } catch (e) {
      console.error(e)
      return false
    }
  }

  const checkIfPresaleEnded = async () => {
    try {
      const provider = await getProviderOrSigner()
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider)

      // This will return a BigNumber because presalended is a unit256
      // This will return a timestamp in seconds
      const presaleEndTime = await nftContract.presaleEnded()
      const currentTime = Date.now() / 1000
      const hasPresaleEnded = presaleEndTime.lt(Math.floor(currentTime))
      setPresaleEnded(hasPresaleEnded)
    } catch (error) {
      console.error(error)
    }
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner()
      setWalletConnected(true)
    } catch (e) {
      console.log(e)
    }
  }

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect()
    const web3Provider = new providers.Web3Provider(provider)

    // If the user is not connected to goerli, tell them to switch to goerli
    const { chainId } = await web3Provider.getNetwork()
    if (chainId != 11155111) {
      window.alert("Please switcht to sepolia network")
      throw new Error("Incorrect network")
    }

    if (needSigner) {
      const signer = web3Provider.getSigner()
      return signer
    }

    return web3Provider
  }

  const onPageLoad = async () => {
    await connectWallet()
    await getOwner()
    const presaleStarted = await checkIfPresaleStarted()
    if (presaleStarted) {
      await checkIfPresaleEnded()
    }
    await getNumMintedTokens()
    console.log(numTokensMinted)
    // Track in real time the number of minted NFTS
    setInterval(async () => {
      await getNumMintedTokens()
    }, 5 * 1000)
    // Track in real time the status of presale (started, ended, whatever)
    setInterval(async () => {
      const presaleStarted = await checkIfPresaleStarted()
      if (presaleStarted) {
        await checkIfPresaleEnded()
      }
    }, 5 * 1000)
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      })

      // connectWallet()
      // await checkIfPresaleStarted()
      // console.log(presaleStarted)
      onPageLoad()
    }
  }, [])

  function renderBody() {
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect Wallet
        </button>
      )
    }

    if (loading) {
      return (
        <button className={styles.button}>
          <div className="sweet-loading">
            <HashLoader
              color={"white"}
              loading={loading}
              cssOverride={override}
              size={25}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        </button>
      )
    }
    if (isOwner && !presaleStarted) {
      // render a button to start the presale
      return (
        <button onClick={startPresale} className={styles.button}>
          Start PreSale
        </button>
      )
    }

    if (!presaleStarted) {
      //JUST SAY that presale hasnt started yer, come back later
      return (
        <div>
          <span className={styles.description}>
            Presale has not started yet come back later
          </span>
        </div>
      )
    }

    if (presaleStarted && !presaleEnded) {
      return (
        <div>
          <div className={styles.description}>
            PreSale has started if your address is whitelisted, you can min a
            cryptoDev!
          </div>
          <button className={styles.button} onClick={presaleMint}>
            Presale Mint
          </button>
        </div>
      )
    }

    if (presaleEnded) {
      // allow users to take part in public sale
      return (
        <div>
          <span className={styles.description}>
            PreSale has ended. You can mint a cryptoDev in public sale.
            cryptoDev!
          </span>
          <button className={styles.button} onClick={publicMint}>
            Public Mint
          </button>
        </div>
      )
    }
  }

  return (
    <div>
      <Head>
        <title>Crypto Devs NFT</title>
      </Head>

      <div className={styles.main}>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Welcome to CryptoDevs NFT</h1>
          <div className={styles.description}>
            CryptoDevs NFT is a collection for developers in web3
          </div>
          <div className={styles.description}>
            {numTokensMinted}/20 have been minted already
          </div>
          <div className={styles.wrapper}>{renderBody()}</div>
        </div>

        <div>
          <img src="/9.svg"></img>
        </div>
      </div>
    </div>
  )
}
