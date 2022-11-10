

export type Venue ={
    name: string,
    address: string,
    type: string,
    storeLogo: Array<any>,
    storeCoverImage: Array<any>,
    id: string
}

// This is the structure required by request body API for 
// creating venues
export type VenuePayload ={
    name: string,
    address: string,
    type: string,
    logoHash: Array<object>,
    coverImageHash: Array<object>,
    id: string
}