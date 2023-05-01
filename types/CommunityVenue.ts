
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
    id: string,
    name: string,
    promotion: string,
    contactNumber: string,
    address: Address ,
    createdAt?: string,
    updatedAt?:string,
}

type CommunityVenueReq = {
    communityId: string,
    venues: CommunityVenue[]
}

export type {CommunityVenue, CommunityVenueReq, Address}