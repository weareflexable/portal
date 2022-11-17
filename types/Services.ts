

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
    startDate: moment.Moment,
    endDate: moment.Moment,
    startTime: moment.Moment,
    rangeTime: number
}