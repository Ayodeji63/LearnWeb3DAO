import Head from "next/head"
import styles from "../styles/Home.module.css"
import Web3Modal from "web3modal"
import { BigNumber, Contract, providers, utils } from "ethers"
import { useEffect, useRef, useState } from "react"
import {
  NFT_CONTRACT_ABI,
  NFT_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  TOKEN_CONTRACT_ADDRESS,
} from "../constants"

export default function Home() {
  const web3ModalRef = useRef()
  const zero = BigNumber.from(0)
  const [walletConnected, setWalletConnected] = useState(false)
  const [balanceOfCryptoDevTokens, setBalanceOfCryptoDevTokens] = useState(zero)
  const [tokenMinted, setTokenMinted] = useState(zero)
  const [tokensToBeClaimed, setTokensToBeClaimed] = useState(zero)
  const [tokenAmount, setTokenAmount] = useState(zero)
  const [loading, setLoading] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect()
    const web3Provider = new providers.Web3Provider(provider)
    const { chainId } = await web3Provider.getNetwork()
    if (chainId != 11155111) {
      window.alert("Please switch to sepolia network")
      throw new Error("Incorrect network")
    }

    if (needSigner) {
      const signer = web3Provider.getSigner()
      return signer
    }
    return web3Provider
  }
  const connectWallet = async () => {
    try {
      await getProviderOrSigner()
      setWalletConnected(true)
    } catch (e) {
      console.log(e)
    }
  }
  const mintCrpytoDevToken = async (amount) => {
    try {
      const signer = await getProviderOrSigner(true)
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      )
      const value = 0.001 * amount
      const tx = await tokenContract.mint(amount, {
        value: utils.parseEther(value.toString()),
      })
      setLoading(true)
      await tx.wait()
      setLoading(false)
      window.alert("Successfully minted a Crypto Dev Token")
      await getBalanceOfCryptoDevTokens()
      await getTotalTokenMinted()
      await getTokenToBeClaimed()
    } catch (e) {
      console.error(e)
    }
  }
  const claimToken = async () => {
    try {
      const signer = await getProviderOrSigner(true)
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      )

      const tx = await tokenContract.claim()
      setLoading(true)
      await tx.wait()
      setLoading(false)
      window.alert("Successfully claimed crypto Dev Tokens")
      await getBalanceOfCryptoDevTokens()
      await getTotalTokenMinted()
      await getTokenToBeClaimed()
      console.log(isOwner)
    } catch (e) {
      console.error(e.reason)
    }
  }

  const getBalanceOfCryptoDevTokens = async () => {
    try {
      const provider = await getProviderOrSigner()
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      )
      const signer = await getProviderOrSigner(true)
      const address = await signer.getAddress()
      const balance = await tokenContract.balanceOf(address)
      setBalanceOfCryptoDevTokens(balance)
    } catch (e) {
      console.error(e)
    }
  }

  const getTotalTokenMinted = async () => {
    try {
      const provider = await getProviderOrSigner()
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      )
      const _tokensMinted = await tokenContract.totalSupply()
      console.log(_tokensMinted)
      setTokenMinted(_tokensMinted)
    } catch (e) {
      console.error(e)
    }
  }

  const getTokenToBeClaimed = async () => {
    try {
      const provider = await getProviderOrSigner()
      const nftContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_CONTRACT_ABI,
        provider
      )

      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      )

      const signer = await getProviderOrSigner(true)
      const address = await signer.getAddress()
      const balance = await nftContract.balanceOf(address)

      if (balance === zero) {
        setTokensToBeClaimed(zero)
      } else {
        let amount = 0
        for (let i = 0; i < balance; i++) {
          const tokenId = await nftContract.tokenOfOwnerByIndex(address, i)
          const claimed = await tokenContract.tokenIdsClaimed(tokenId)
          if (!claimed) {
            amount++
          }
        }
        setTokensToBeClaimed(amount)
      }
    } catch (e) {
      console.error(e)
      setTokensToBeClaimed(zero)
    }
  }

  const onPageLoad = async () => {
    await connectWallet()
    await getBalanceOfCryptoDevTokens()
    await getTotalTokenMinted()
    await getTokenToBeClaimed()
    await getOwner()
  }

  const getOwner = async () => {
    try {
      const signer = await getProviderOrSigner(true)
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      )
      const owner = await tokenContract.owner()
      console.log(owner)
      const userAddress = await signer.getAddress()
      console.log(userAddress)
      if (owner.toString() == userAddress.toString()) {
        setIsOwner(true)
        console.log(isOwner)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const withdraw = async () => {
    try {
      const signer = await getProviderOrSigner(true)
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      )
      const tx = await tokenContract.withdraw()
      setLoading(true)
      await tx.wait()
      setLoading(false)
      window.alert("You Have Successfully withdraw")
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      })
      onPageLoad()
    }
  }, [])

  const renderButton = () => {
    if (loading) {
      return <button className={styles.button}>Loading..</button>
    }
    // if (tokensToBeClaimed > 0) {
    //   return (
    //     <div>
    //       <div className={styles.description}>
    //         {tokensToBeClaimed * 10} Tokens can be claimed
    //       </div>
    //       <button className={styles.button} onClick={claimToken}>
    //         Claim Tokens
    //       </button>
    //     </div>
    //   )
    // }

    if (isOwner) {
      return (
        <div style={{ display: "flex-col" }}>
          <div>
            <input
              className={styles.input}
              type="number"
              placeholder="Amount of Tokens"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
            />
            <button
              className={styles.button}
              disabled={!(tokenAmount > 0)}
              onClick={() => mintCrpytoDevToken(tokenAmount)}
            >
              {" "}
              Mint Tokens
            </button>
          </div>
        </div>
      )
    }
  }

  return (
    <div>
      <Head>
        <title>Crypto Devs ICO</title>
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs ICO</h1>
          {!isOwner && <div>You can claim or mint Crypto Dev Token here</div>}
          {walletConnected ? (
            <div>
              <div className={styles.description}>
                You have minted {utils.formatEther(balanceOfCryptoDevTokens)}{" "}
                Crypto Dev Tokens
              </div>
              <div className={styles.description}>
                Overall {utils.formatEther(tokenMinted)} / 1000 have been minted
              </div>
              {renderButton()}
            </div>
          ) : (
            <button className={styles.button} onClick={connectWallet}>
              Connect Your Wallet
            </button>
          )}

          {isOwner && (
            <button className={styles.button} onClick={withdraw}>
              Withdraw
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
