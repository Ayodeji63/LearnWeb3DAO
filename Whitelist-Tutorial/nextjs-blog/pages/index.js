import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [numofWhitelisted, setnumofWhitelisted] = useState(0);
  return (
    <div>
      <Head>
        <title>Whitelist dApp</title>
        <meta name="description" content="whitelist-dapp"></meta>
      </Head>
      <div className={styles.main}>
        <h1 className={styles.title}>Welcome To Crypto Devs!</h1>

        <div className={styles.description}>
          {numofWhitelisted} have already joined the Whitelist
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg"></img>
        </div>
      </div>
      {/* public/crypto-devs.svg */}

      <footer className={styles.footer}>
        Made with by &#10084; Crypto Devs{" "}
      </footer>
    </div>
  );
}
