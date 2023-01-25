

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


export type ServiceItem = {
    id:string,
    name: string,
    imageHash: string,
    serviceItemType: string,
    description: string,
    updatedAt: string,
    createdAt: string,
}

export type ServiceItemReqPaylod = {
    name: string,
    price: number
    ticketsPerDay: number,
    description:string,
    orgServiceId: string,
    startDate: string,
    endDate: string,
    startTime: string,
    rangeTime: string,
    logoImageHash?: string,
    serviceItemId: string
    serviceItemTypeId?: string
}