import React, { useState, useEffect } from "react";
import axios from "axios";

const apiKey = "your-api-key-here";

const TextToImage = () => {
  const [imageUrl, setImageUrl] = useState("");

  const generateImage = async (text) => {
    try {
      const response = await axios.post(
        "https://api.deepai.org/api/text-to-image",
        {
          text: text,
        },
        {
          headers: {
            "Api-Key": apiKey,
          },
        }
      );

      setImageUrl(response.data.output_url);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    generateImage("Example text to generate an image");
  }, []);

  return (
    <div>
      <img src={imageUrl} alt="Generated image" />
    </div>
  );
};

export default TextToImage;
