
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
    id: string
    name: string,
    accessCode: string,
    promotion: string,
    contactNumber: string,
    marketValue: number,
    address: Address ,
    createdAt?: string,
    updatedAt?:string,
}
type CommunityVenuePayload = {
    name: string,
    promotion: string,
    email:string,
    contactNumber: string,
    marketValue: string,
    address: Address ,
    createdAt?: string,
    updatedAt?:string,
}

export type CommunityVenueForm = {
    promotion: string
    marketValue: number
    email:string,
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
    venues: CommunityVenuePayload[]
}

export type {CommunityVenue, CommunityVenueReq, Address}