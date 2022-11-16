export interface Order {
    id: string;
    userId: string,
    name: string;
    ticketDate: string;
    quantity: number,
    orderStatus: string,
    ticketStatus: string,
    price:number,
    total: number,
    uniqueCode: string,
    userTicketId: string,
    paymentIntentStatus: string,
    orgServiceItemId: string,
  }
