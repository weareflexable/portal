

export type Service ={
    name: string,
    city:string,
    country: string,
    state: string,
    currency: 'USD',
    serviceType: Array<any>,
    timeZone: 'UTC',
    serviceTypeId: string,
    serviceTypeName: string,
    logoImageHash: string ,
    coverImageHash: string,
    id: string
}

// This is the structure required by request body API for 
// creating services
export type ServicePayload ={
    id: string | undefined,
    name: string,
    orgId: string,
    serviceTypeId?: string,
    state: string,
    country: string,
    city: string,
    latitude: number,
    longitude: number,
    timeZone: string,
    logoImageHash: string | undefined | any[],
    coverImageHash: string | undefined | any[],
}

export type CustomDate = {
    price: string,
    ticketsPerDay: string,
    date: string
}

export type Availability = CustomDate[]

export type ServiceItem = {
    id:string,
    name: string,
    ticketsPerDay: string,
    price: string,
    logoImageHash: string,
    serviceItemTypeId: string,
    description: string,
    availability: Availability
    updatedAt: string,
    createdAt: string
}

export type AvailabilityPayload = {
    serviceItemId: string,
    availability: Availability
}

export type ServiceItemReqPaylod = {
    name: string,
    price: string
    ticketsPerDay: string,
    description:string,
    orgServiceId: string,
    logoImageHash?: string,
    // serviceItemId: string
    serviceItemTypeId?: string
}