import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { Contract, ethers, providers, utils } from "ethers";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId != 5) {
      window.alert("Please switch to goerli network");
      throw new Error("Incorrect network");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (e) {
      console.error(e);
    }
  };

  const onPageLoad = async () => {
    await connectWallet();
  };
  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      onPageLoad();
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Crypto Devs ICO</title>
      </Head>

      <div className={styles.main}>
        <div className={styles.wrapper}>
          <button className={styles.button} onClick={connectWallet}>
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
