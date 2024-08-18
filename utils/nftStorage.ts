import { PinataSDK } from "pinata";


const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  pinataGateway: "jade-abstract-turtle-665.mypinata.cloud",
});



export async function uploadToPinata(blob:Blob) {
  try {
    const file = new File([blob], "Image upload to IPFS");
    const upload = await pinata.upload.file(file);
    const ipfsHash = upload.IpfsHash
    return ipfsHash
  } catch (error) {
    console.log(error);
  }
}


