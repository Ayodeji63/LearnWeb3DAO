import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import deepai from "deepai";

export default function Home() {
  const [image, setImage] = useState("");
  // const deepai = require("deepai");
  const apiKey = "92d26d93-1ae0-48df-a110-8eee134d4e9c";
  deepai.setApiKey(apiKey);
  // (async function () {
  //   let resp = await deepai.callStandardApi("text2img", {
  //     text: "Dogs NFT",
  //   });
  //   console.log(resp);
  // })();

  // const generateImage = async () => {
  //   try {
  //     let resp = await deepai.callStandardApi("text2img", {
  //       text: "Dogs NFT",
  //     });
  //     console.log(resp);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  async function generateImage(text) {
    try {
      const response = await axios.post(
        "https://api.huggingface.co/text2image",
        {
          text: text,
        }
      );

      const image = response.data;
      console.log(image);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    generateImage("Dogs Nfts");
  }, []);

  return (
    <div>
      <h1>Hello There</h1>
      <img src={image} alt="Genrated Image" />
    </div>
  );
}
