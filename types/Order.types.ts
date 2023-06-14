export type Order  = {
    id: string;
    userId: string,
    serviceName: string;
    name: string;
    serviceItemDetails: any[],
    serviceDetails: any[],
    quantity: number,
    user: any[],
    orderStatus: string,
    targetDate: string,
    ticketStatus: string,
    unitPrice:number,
    uniqueCode: string,
    userTicketId: string,
    paymentIntentStatus: string,
    paymentIntentId: string,
    orgServiceItemId: string,
    currency: string,
    createdAt: string
  }

  

