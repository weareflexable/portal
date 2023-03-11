import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../../hooks/useOrgs";
const {Text,Title} = Typography
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Badge} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined, CheckOutlined,StopOutlined} from '@ant-design/icons'

import { useAuthContext } from '../../../context/AuthContext';
import {PlusOutlined} from '@ant-design/icons'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { ServiceItem } from "../../../types/Services";
import { ManagerOrder } from "./Bookings.types";
import useUrlPrefix from "../../../hooks/useUrlPrefix";
const {TextArea} = Input
import {numberFormatter} from '../../../utils/numberFormatter'
import { IMAGE_PLACEHOLDER_HASH } from "../../../constants";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advanced from "dayjs/plugin/advancedFormat"
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advanced)




export default function ManagerBookingsView(){

    const {paseto} = useAuthContext()
    const [pageNumber, setPageNumber] = useState<number|undefined>(0)
    const [pageSize, setPageSize] = useState<number|undefined>(10)
  

    type DataIndex = keyof ServiceItem;


    const urlPrefix = useUrlPrefix()
    
    async function fetchBookings(){
    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/bookings?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
   
    }


    const bookingsQuery = useQuery({queryKey:['managerBookings',pageNumber,pageSize], queryFn:fetchBookings, enabled:paseto !== ''})
    const data = bookingsQuery.data && bookingsQuery.data.data
    const totalLength = bookingsQuery.data && bookingsQuery.data.dataLength;


    

  
  
    const handleChange: TableProps<ManagerOrder>['onChange'] = (data) => {
      // console.log('Various parameters', pagination, filters, sorter); 
      console.log(data)
      // @ts-ignore
      setPageNumber(data.current-1)
      setPageSize(data.pageSize)
      // set new page
      // set page number
      // setFilteredInfo(filters);
    };
  
  

    const columns: ColumnsType<ManagerOrder> = [
      {
        title: 'Service',
        dataIndex: 'name',
        key: 'name',
        ellipsis:true,
        width:'270px',
        fixed:'left',
        render:(_,record)=>{
          const serviceItemName = record.serviceItemDetails[0].name
          const serviceName = record.serviceDetails[0].name
          const logoImageHash = record.serviceItemDetails[0].logoImageHash
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${logoImageHash}`}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text>{serviceItemName}</Text>  
                        <Text type="secondary">{serviceName}</Text>  
                    </div>
                </div>
            )
        },
      },
      {
        title: 'Service Type',
        // dataIndex: 'unitPrice',
        key: 'unitPrice',
        width:'120px',
        render: (_,record)=>{
          const serviceItemType = record.serviceItemDetails[0].serviceItemType[0].name
          return(
          <div>
            <Tag style={{textTransform:'capitalize'}}>{serviceItemType}</Tag>
          </div>
        )}
      },
      {
        title: 'Customer',
        // dataIndex: 'customer',
        ellipsis:true,
        width:'270px',
        key: 'customer',
        render:(_,record)=>{
          const user = record.user[0]
          const email = user.email
          const name = user.name
          const profilePicHash = user.profilePic
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${profilePicHash.length < 10? IMAGE_PLACEHOLDER_HASH : profilePicHash}`}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text>{name}</Text>  
                        <Text type="secondary">{email}</Text>  
                    </div>
                </div>
            )
        },
      },
    
      {
        title: 'Unit Price',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        width:'100px',
        align:'right',
        render: (unitPrice)=>(
          <div>
            <Text>$</Text> 
            <Text>{`${numberFormatter.from(unitPrice/100)}`}</Text>
          </div>
        )
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        width:'100px',
        align:'right',
        render:(quantity)=>( 
          <div>
            <Text >x</Text>
            <Text>{quantity}</Text>
          </div>
        )
      },
      {
        title: 'Total Price',
        // dataIndex: 'totalPrice',
        key: 'totalPrice',
        width:'120px',
        align:'right',
        render: (_,record)=>{
          const total = record.quantity * (record.unitPrice/100)
          return(
            <div>
            <Text>$</Text>
            <Text>{`${numberFormatter.from(total)}`}</Text>
          </div>
          )
        }
      }, 
      
      // {
      //   title: 'Ticket Status',
      //   dataIndex: 'ticketStatus',
      //   key: 'ticketStatus',
      //   render: (status)=>{
      //     const statusText = status === '1'? 'Redeemed': 'Confirmed'
      //     return <Badge status="success" text={statusText} />
      //   }
      // },
     
    {
      title: 'Payment Status',
      dataIndex: 'paymentIntentStatus',
      key: 'paymentIntentStatus',
      width:'150px',
      fixed:'right',
      render: (paymentStatus)=>{
        const color = paymentStatus === 'successful'?'green':paymentStatus === 'failed'?'red':paymentStatus === 'cancelled'?'grey':'blue'
        const icon = paymentStatus === 'successful'?<CheckOutlined />:paymentStatus === 'cancelled'?<StopOutlined />:null
        return <Tag icon={icon} color={color} style={{textTransform:'capitalize'}}>{paymentStatus}</Tag>
      }
    },
    {
      title: 'Ticket Date',
      dataIndex: 'targeDate',
      key: 'targetDate',
      fixed:'right',
      width: '120px',
      render: (_,record)=>{
          const date = dayjs(record.targetDate).format('MMM DD, YYYY')
          return(
        <Text type='secondary'>{date}</Text>
        )
    },
},

    // {
    //   dataIndex: 'actions', 
    //   key: 'actions',
    //   render:(_,record)=>{
    //     return (
    //       <Button onClick={()=>seeFullDetails(record)} icon={<MoreOutlined/>}/>
    //       )
    //   }
    // }
    ];

        return (
            <div>
                  <div style={{marginBottom:'2em', marginTop:'1rem', display:'flex', width:'100%', flexDirection:'column', alignItems:'center'}}>
               <div style={{display:'flex', marginTop:'1rem', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                 <div style={{display:'flex', alignItems:'baseline'}}>
                 <Title style={{ margin:'0'}} level={2}>Bookings</Title>
                 {/* <div style={{marginLeft:'1rem'}}>
                  <Text>{`Last Updated on - `}</Text> 
                  <Text>{`${dayjs(bookingsQuery.dataUpdatedAt).tz('America/New_York').format("MMM D, YYYY z")}`}</Text>
                  <Text>{` · ${dayjs(bookingsQuery.dataUpdatedAt).tz('America/New_York').format('HH:mm:ss')} secs ago`}</Text>
                  </div> */}
                 </div>
                 <Button shape="round" loading={bookingsQuery.isRefetching} onClick={()=>bookingsQuery.refetch()} icon={<ReloadOutlined />}>Refresh</Button>
               </div>
               <div style={{display:'flex', marginTop:'.5rem', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                  <div>
                  <Text>{`Last Updated on - `}</Text> 
                  <Text>{`${dayjs(bookingsQuery.dataUpdatedAt).tz('America/New_York').format("MMM D, YYYY z")}`}</Text>
                  <Text>{` · ${dayjs(bookingsQuery.dataUpdatedAt).tz('America/New_York').format('HH:mm:ss')} secs ago`}</Text>
                  </div>
               </div>

               </div>
                <Table 
                  style={{width:'100%'}} 
                  key='dfadfe' 
                  size='small'  
                  scroll={{ x: 'calc(500px + 50%)'}} 
                  loading={bookingsQuery.isLoading||bookingsQuery.isRefetching} 
                  columns={columns} 
                  pagination={{
                    total:totalLength,  
                    showTotal:(total) => `Total ${total} items`,
                  }} 
                  onChange={handleChange} 
                  dataSource={data} 
                  />
                {/* {
                  isDrawerOpen
                  ?<DetailDrawer isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedServiceItem={selectedServiceItem}/>
                  :null
                } */}
            </div>
    )



}
