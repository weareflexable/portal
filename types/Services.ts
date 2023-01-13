

export type Service ={
    name: string,
    city:string,
    country: string,
    state: string,
    serviceTypeName: string,
    logoImageHash: Array<any> ,
    coverImageHash: Array<any>,
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
    price: number,
    ticketsPerDay: number,
    serviceType: string,
    description: string,
    startDate:  string,
    endDate: string,
    startTime: string,
    rangeTime: number
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
 
}