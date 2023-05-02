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
