import { CIDString, NFTStorage } from "nft.storage"


export const nftStorageClient = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN || '' })

export const asyncStore = async ( blob: Blob): Promise<string> => {
    const {car} = await NFTStorage.encodeBlob(blob);
    const cid = await nftStorageClient.storeCar(car);
    return  cid.toString()
}