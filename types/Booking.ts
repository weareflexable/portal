export interface Order {
    id: string;
    userId: string,
    serviceName: string;
    name: string;
    quantity: number,
    startTime: string;
    orderStatus: string,
    ticketStatus: string,
    unitPrice:number,
    uniqueCode: string,
    userTicketId: string,
    paymentIntentStatus: string,
    paymentIntentId: string,
    orgServiceItemId: string,
    hash: string,
    currency: string,
    endTime: string,
  }

  export interface ManagerOrder {
    id: string;
    userId: string,
    serviceName: string;
    name: string;
    startTime: string
    serviceItemDetails: any[],
    user: any[]
    targetDate: string,
    serviceDetails: any[],
    quantity: number,
    orderStatus: string,
    ticketStatus: string,
    unitPrice:number,
    uniqueCode: string,
    userTicketId: string,
    paymentIntentStatus: string,
    paymentIntentId: string,
    orgServiceItemId: string,
    hash: string,
    currency: string,
    endTime: string,
    createdAt: string,
  }

  type CommunityDats = {
    name: string
    price: number
    artworkHash: string
    logoImageHash: string
  }


  export type CommunityOrder = {
    id: string
    ticketDetails:any,
    paymentIntentStatus: string,
    targetDate: string,
    userTicketId: string,
    redeemStatus: string,
    name: string
    communityDetails: CommunityDats
    user: any
    createdAt: string
    createdBy: string
    artworkHash: string
    logoImageHash: string
    quantity: number
    price: number
    unitPrice: number
    paymentStatus: string
  }

  export type EventOrder = {
    redeemStatus: string,
    ticketDetails: any,
    bookingStatus: string,
    eventDetails: any,
    eventId:string,
    id: string
    customer: any,
    ticketSecret: number,
    userId: string,
    name: string
    user: any
    createdAt: string
    createdBy: string
    coverImageHash: string
    quantity: number
    price: number
    unitPrice: number
    paymentIntentStatus: string
  }