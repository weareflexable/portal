

export type Service ={
    name: string,
    city:string,
    country: string,
    state: string,
    serviceTypeName: string,
    imageHash: Array<any> ,
    coverImageHash: Array<any>,
    id: string
}

// This is the structure required by request body API for 
// creating services
export type ServicePayload ={
    name: string,
    orgId: string,
    serviceId: string,
    state: string,
    country: string,
    city: string,
    latitude: number,
    longitude: number,
    timeZone: string,
    imageHash: string,
    coverImageHash: string,
}


export type ServiceItem = {
    id:string,
    name: string,
    price: number,
    ticketsPerDay: number,
    serviceType: string,
    description: string,
    startDate: moment.Moment | string,
    endDate: moment.Moment | string,
    startTime: moment.Moment | string,
    rangeTime: number
}

export type ServiceItemReqPaylod = {
    name: string,
    price: number
    ticketMaxPerDay: number,
    description:string,
    orgServiceId: string,
    startDate: string,
    endDate: string,
    startTime: string,
    rangeTime: string,
    imageHash?: string,
    serviceItemId: string
 
}