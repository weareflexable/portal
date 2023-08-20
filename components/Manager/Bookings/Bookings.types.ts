export interface ManagerOrder {
    id: string;
    userId: string,
    serviceName: string;
    name: string;
    startTime: string
    serviceItemDetails: any[],
    user: User[]
    targetDate: string,
    serviceDetails: any,
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

  type User = {
    email: string
    name: string
    profilePic: string
  }
