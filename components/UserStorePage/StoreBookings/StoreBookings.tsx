import React from 'react'
import {Typography,Button,Avatar, Tag} from 'antd'
import { useRouter } from 'next/router'
import Table, { ColumnsType } from 'antd/lib/table';



const {Title,Text} = Typography


interface DataType {
    key: string;
    customer: string,
    service: string;
    date: string;
    quantity: number,
    status: string,
    price:number
  }

const data: DataType[] = [
    {
      key: '1',
      customer:'mbappai',
      date:'Jan 22, 2022',
      service: 'Avery pro line skip',
      quantity: 4,
      status: 'Redeemed',
      price: 25
    },
    {
      key: '2',
      service: 'Jim Green Bar',
      customer:'ommore',
      date:'Jan 12, 2022',
      quantity: 1,
      status: 'Expired',
      price: 25
    },
    {
      key: '3',
      service: 'Joe Black Gym line skip',
      customer:'schachindra',
      date:'Apr 22, 2022',
      quantity: 2,
      status: 'Valid',
      price: 25
    },
  ];


interface StoreBookingsProps{
    bookings: any[],
    onDeleteStore: (storeId:string)=>void,
}
export default function StoreBookings({ bookings=data }:StoreBookingsProps){

  const router = useRouter()


  const columns: ColumnsType<any> = [
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    //   render: (text,record) => <Link href={`/stores/${record.key}`}><a>{text}</a></Link>,
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Unit Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status=>{
        let color = 'blue'
        if(status==='Redeemed') color='green'
        if(status==='Expired') color='red'
        return(
          <Tag color={color}>{status}</Tag>
        )
    }
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];


    return(
      <div>
        <Title level={4}>Store bookings</Title>
        <Table columns={columns} dataSource={bookings} />
      </div>
    )
}


