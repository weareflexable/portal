import { NFTStorage } from 'nft.storage'


export const nftStorageClient = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN || '' })

