

export type Service ={
    name: string,
    city:string,
    country: string,
    state: string,
    serviceTypeName: string,
    imageHash: Array<any>,
    id: string
}

// This is the structure required by request body API for 
// creating services
export type ServicePayload ={
    name: string,
    address: string,
    type: string,
    logoHash: Array<object>,
    coverImageHash: Array<object>,
    id: string
}


export type ServiceItem = {
    id:string,
    name: string,
    price: number,
    ticketsPerDay: number,
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