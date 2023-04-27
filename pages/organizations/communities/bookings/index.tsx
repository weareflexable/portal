
import CommunitiesLayout from '../../../../components/shared/Layout/CommunitiesLayout'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../../../hooks/useOrgs";
const {Text, Title} = Typography
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Badge} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined, CheckOutlined, StopOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';

import { useAuthContext } from '../../../../context/AuthContext';
import { useServicesContext } from '../../../../context/ServicesContext';
import {PlusOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { useOrgContext } from "../../../../context/OrgContext";


import useUrlPrefix from "../../../../hooks/useUrlPrefix";
import { numberFormatter } from "../../../../utils/numberFormatter";
import { IMAGE_PLACEHOLDER_HASH } from "../../../../constants";
const {TextArea} = Input
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advanced from "dayjs/plugin/advancedFormat"
import relativeTime from 'dayjs/plugin/relativeTime'
import { Order } from '../../../../types/Order.types';

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advanced)


function CommunityBookings(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()
    const router = useRouter()
    const {switchOrg} = useOrgs()
    const {currentService} = useServicesContext()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false) 
    const [pageNumber, setPageNumber] = useState<number|undefined>(1)
    const [pageSize, setPageSize] = useState<number|undefined>(10)

    const urlPrefix = useUrlPrefix();


    async function fetchBookings(){
    const res = await axios({
            method:'get',
            //@ts-ignore
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/bookings?key=service_id&value=${currentService.id}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
            headers:{
                "Authorization": paseto
            }


        })

        return res.data;
   
    }

  


    const bookingsQuery = useQuery({queryKey:['Bookings',pageNumber,pageSize], queryFn:fetchBookings, enabled:paseto !== ''})
    const data = bookingsQuery.data && bookingsQuery.data.data
    const totalLength = bookingsQuery.data && bookingsQuery.data.dataLength;


    

  
  
    const handleChange: TableProps<Order>['onChange'] = (data) => {
      //@ts-ignore
      setPageNumber(data.current);
      setPageSize(data.pageSize)
    };
  

  
  
  
    const columns: ColumnsType<Order> = [
      {
        title: 'Service',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: '270px',
        ellipsis:true,
        render:(_,record)=>{
          const serviceItemName = record.serviceItemDetails[0].name
          const serviceName = record.serviceDetails[0].name
          const logoImageHash = record.serviceItemDetails[0].logoImageHash
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${logoImageHash.length < 10? IMAGE_PLACEHOLDER_HASH : logoImageHash}`}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text>{serviceItemName}</Text>  
                        <Text type="secondary">{serviceName}</Text>  
                    </div>
                </div>
            )
        },
      },
      {
        title: 'Customer',
        // dataIndex: 'customer',
        key: 'customer',
        width: '270px',
        ellipsis:true,
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
        title: 'Service Type',
        dataIndex: 'serviceItemType',
        key: 'serviceItemType',
        width: '120px',
        render:(_,record)=>{
          const serviceItemType = record.serviceItemDetails[0].serviceItemType[0].name
          return(
            <Tag>{serviceItemType}</Tag>
          )
        }
      },
      {
        title: 'Unit price',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        align:'right',
        width: '120px',
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
        align:'right',
        width: '120px',
        render:(quantity)=>(
          <div>
            <Text>x</Text>
            <Text>{quantity}</Text>
          </div>
        )
      },
      {
        title: 'Total Price',
        // dataIndex: 'totalPrice',
        key: 'totalPrice',
        align:'right',
        width: '120px',
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
   
      {
        title: 'Booking Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: '110px',
        render: (bookingDate)=>{
            const date = dayjs(bookingDate).format('MMM DD, YYYY')
            return(
          <Text type='secondary'>{date}</Text>
          )
      },
  },
      {
        title: 'Payment Status',
        dataIndex: 'paymentIntentStatus',
        key: 'paymentIntentStatus',
        width: '150px',
        fixed:'right',
        render: (paymentStatus)=>{
          const color = paymentStatus === 'successful'?'green':paymentStatus === 'failed'?'red':paymentStatus === 'cancelled'?'grey':'blue'
          const icon = paymentStatus === 'successful'?<CheckOutlined />:paymentStatus === 'cancelled'?<StopOutlined />:null
          return <Tag icon={icon} color={color} style={{textTransform:'capitalize'}}>{paymentStatus}</Tag>
        }
      },

      // {
      //   title: 'Ticket Status',
      //   dataIndex: 'ticketStatus',
      //   key: 'ticketStatus',
      //   render: (status)=>{
      //     const statusText = status === '1'? 'Redeemed': 'Confirmed'
      //     return (
      //       <div>
      //         <Badge style={{border:'1px solid #e7e7e7', padding:'.15rem .6rem', borderRadius:'4px'}} status="success" text={statusText} />
      //       </div>
      //     )
      //   }
      // },
      {
          title: 'Ticket Date',
          dataIndex: 'targetDate',
          key: 'targetDate',
          width: '120px',
          fixed: 'right',
          render: (ticketDate)=>{
              const date = dayjs(ticketDate).format('MMM D, YYYY')
              return(
            <Text type="secondary">{date}</Text>
            )
        },
    },
    ];

        return (
            <div>
              <div style={{marginBottom:'2em', marginTop:'1rem', display:'flex', width:'100%', flexDirection:'column', alignItems:'center'}}>
               <div style={{display:'flex', marginTop:'1rem', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                 <Title style={{ margin:'0'}} level={2}>Community Bookings</Title>
                 <Button shape="round" loading={bookingsQuery.isRefetching} onClick={()=>bookingsQuery.refetch()} icon={<ReloadOutlined />}>Refresh</Button>
               </div>
               <div style={{display:'flex', marginTop:'.5rem', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                  <div>
                  <Text>{`Last Updated on - `}</Text>
                  <Text>{`${dayjs(bookingsQuery.dataUpdatedAt).tz('America/New_York').format("MMM D, YYYY HA z")}`}</Text>
                  <Text>{` · ${dayjs(bookingsQuery.dataUpdatedAt).tz('America/New_York').format('HH:mm:ss')} secs ago`}</Text>
                  </div>
               </div>

               </div>

               { 
               data && data.length === 0
               ?<EmptyState/>
               :<Table 
                 size='small'
                  style={{width:'100%'}} 
                  rowKey={(record)=>record.id}
                  scroll={{ x: 'calc(600px + 50%)'}} 
                  loading={bookingsQuery.isLoading||bookingsQuery.isRefetching} 
                  columns={columns} 
                  pagination={{
                    total:totalLength,  
                    showTotal:(total) => `Total ${total} items`,
                  }} 
                  onChange={handleChange} 
                  dataSource={data}
                 />}
            </div>
    )



}


CommunityBookings.PageLayout = CommunitiesLayout

export default CommunityBookings



function EmptyState(){
  return(
    <div style={{border: '1px solid #e5e5e5', display:'flex', justifyContent:'center', marginTop:'2rem', alignItems:'center', padding: '2rem'}}>
      <div style={{maxWidth:'300px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <Title style={{textAlign:'center'}} level={3}>Oops!</Title>
        <Text style={{textAlign:'center'}}>There are currently no bookings for this community</Text>
        {/* <Button size="large" shape="round" type="ghost" icon={<PlusOutlined />} style={{marginTop:'1rem'}}>Create New Organization</Button> */}
      </div>
    </div>
  )
}

