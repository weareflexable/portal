
import { PinataSDK } from "pinata";


const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  pinataGateway: "aqua-magic-hippopotamus-802.mypinata.cloud",
});


export const uploadToPinata = async(blob:Blob)=> {
  try {
    const file = new File([blob], "Image upload to IPFS");
    const upload = await pinata.upload.file(file);
    const ipfsHash = upload.IpfsHash
    return ipfsHash as string
  } catch (error) {
    console.log(error);
  }
}


