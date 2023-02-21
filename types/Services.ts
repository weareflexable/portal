

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
    latitude: string,
    longitude: string,
    timeZone: string,
    logoImageHash: string | undefined | any[],
    coverImageHash: string | undefined | any[],
}

export type CustomDate = {
    price: number,
    ticketsPerDay: number,
    date: string,
    name: string,
    id?: string,
    serviceItemID?:string
}

export type Availability = CustomDate[]

export type ServiceItem = {
    id:string,
    name: string,
    ticketsPerDay: number,
    price: number,
    logoImageHash: string,
    serviceItemType: any[],
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
    price: number
    ticketsPerDay: number,
    description:string,
    orgServiceId: string,
    logoImageHash?: string | null | any,
    // serviceItemId: string
    serviceItemTypeId?: string | undefined | string[]
}