
import React from 'react'
import {Typography,Button,Avatar, Tag} from 'antd'
import { useRouter } from 'next/router'
import Table, { ColumnsType } from 'antd/lib/table';



const {Title,Text} = Typography


interface DataType {
    id: string;
    userId: string,
    name: string;
    ticketDate: string;
    quantity: number,
    orderStatus: string,
    price:number,
    total: number,
    uniqueCode: string,
    paymentIntentStatus: string,
    orgServiceItemId: string,
  }

const bookings: DataType[] = [
    {
      id: '1',
      userId:'mbappai',
      ticketDate:'Jan 22, 2022',
      name: 'Avery pro line skip',
      quantity: 4,
      orderStatus: 'Redeemed',
      price: 2500,
      total:230,
      uniqueCode: '34u12y',
      paymentIntentStatus: 'PAYMENT_PAID',
      orgServiceItemId:'bc6aaa35-e50e-40d5-a0ff-5e7fd20fe4b5',
    },
    {
      id: '2',
      name: 'Jim Green Bar',
      userId:'ommore',
      ticketDate:'Jan 12, 2022',
      quantity: 1,
      orderStatus: 'Expired',
      price: 2500,
      total:438,
      uniqueCode: '34u12y',
      paymentIntentStatus: 'PAYMENT_PAID',
      orgServiceItemId:'bc6aaa35-e50e-40d5-a0ff-5e7fd20fe4b5'
    },
    {
      id: '3',
      name: 'Joe Black Gym line skip',
      userId:'schachindra',
      ticketDate:'Apr 22, 2022',
      quantity: 2,
      orderStatus: 'Valid',
      price: 2500,
      total:438,
      uniqueCode: '34u12y',
      paymentIntentStatus: 'PAYMENT_PAID',
      orgServiceItemId:'bc6aaa35-e50e-40d5-a0ff-5e7fd20fe4b5'
    },
  ];



export default function Bookings(){

  const router = useRouter()


  const columns: ColumnsType<any> = [
    {
      title: 'UserId',
      dataIndex: 'userId',
      key: 'userId',
    //   render: (text,record) => <Link href={`/stores/${record.key}`}><a>{text}</a></Link>,
    },
    {
      title: 'Unique Code',
      dataIndex: 'uniqueCode',
      key: 'uniqueCode',
    },
    {
      title: 'Service',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Unit Price',
      dataIndex: 'price',
      key: 'price',
      render: (price)=>{
        return(
          <Text>${price/100}</Text>
        )
    }
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (_,record)=>{
        const total = record.quantity * (record.price/100)
        return(
          <Text>${total}</Text>
        )
    }
    },
    {
      title: 'Order Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: orderStatus=>{
        let color = 'blue'
        if(orderStatus==='Redeemed') color='green'
        if(orderStatus==='Expired') color='red'
        return(
          <Tag color={color}>{orderStatus}</Tag>
        )
    }
    },
    {
      title: 'TicketDate',
      dataIndex: 'ticketDate',
      key: 'ticketDate',
    },
  ];


    return(
      <div>
        <Table style={{width:'100%'}} columns={columns} dataSource={bookings} />
      </div>
    )
}


