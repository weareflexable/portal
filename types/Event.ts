export type Event = {
    id: string
    name: string,
    description: string,
    contactNumber: string,
    totalTickets: number,
    type?: string,
    duration: number,
    startTime: string,
    timeZone: string,
    date: string,
    time: string,
    locationName: string,
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
    price: number,
    coverImageHash: string
    status: number
    createdAt: string
    updatedAt: string
}