export type Community = {
    id: string
    name: string
    platformFee?:string
    liteVenuesCount: number
    description: string
    price: number
    artworkHash: string
    logoImageHash: string
    status: number
    createdAt: string
    updatedAt: string
}


 export type CommunityReq = {
    orgId: string,
    status: string,
    name: string,
    price: string
    currency: string
    description:string,
    logoImageHash?: string | null | any,
    artworkHash?: string | null,
}
