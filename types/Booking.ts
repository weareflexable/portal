export interface Order {
    id: string;
    userId: string,
    serviceName: string;
    name: string;
    startTime: string;
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
  }

