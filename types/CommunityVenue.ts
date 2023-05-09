
type Address = {
    street: string
    placeId: string
    state: string
    city: string
    latitude: string
    longitude: string
    country: string
    fullAddress: string
}
type CommunityVenue = {
    name: string,
    promotion: string,
    contactNumber: string,
    address: Address ,
    createdAt?: string,
    updatedAt?:string,
}
export type CommunityVenueForm = {
    promotion: string
    name: string
    contact: any 
    address: {
        country: string
        state: string
        city: string
        street: string
        fullAddress: string
        latitude: string
        longitude: string
        placeId: string
    }
}

type CommunityVenueReq = {
    communityId: string,
    venues: CommunityVenue[]
}

export type {CommunityVenue, CommunityVenueReq, Address}