import { CIDString, NFTStorage } from "nft.storage"
import { PinataSDK } from "pinata";


export const nftStorageClient = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN || '' })

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  pinataGateway: "aqua-magic-hippopotamus-802.mypinata.cloud",
});

export const asyncStore = async ( blob: Blob): Promise<string> => {
    const {car} = await NFTStorage.encodeBlob(blob);
    const cid = await nftStorageClient.storeCar(car);
    return  cid.toString()
}

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


