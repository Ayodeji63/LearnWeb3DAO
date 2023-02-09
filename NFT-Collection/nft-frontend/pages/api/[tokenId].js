// Base URI + TokenID
// https://example.com
// Token ID = 1
// tokenURI(1) => https://example.com/1
export default function handler(req, res) {
  const tokenId = req.query.tokenId
  const name = `Crypto Dev $${tokenId}`
  const description = "CryptoDevs is an NFT Collection for developers"
  const image = `https://raw.githubusercontent.com/LearnWeb3DAO/NFT-Collection/main/my-app/public/cryptodevs/${
    Number(tokenId) - 1
  }.svg`

  return res.json({
    name: name,
    description: description,
    image: image,
  })
}
