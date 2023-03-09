import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../../hooks/useOrgs";
const {Text,Title} = Typography
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Badge} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined, CheckOutlined,StopOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';

import { useAuthContext } from '../../../context/AuthContext';
import { useServicesContext } from '../../../context/ServicesContext';
import {PlusOutlined} from '@ant-design/icons'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { useOrgContext } from "../../../context/OrgContext";
import { asyncStore } from "../../../utils/nftStorage";
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



// const mockServiceItems:ServiceItem[]=[
//   {
//      id:"dfadfafd",
//     name: "Classic Line skip",
//     imageHash: '',
//     serviceItemType: "line-skip",
//     description: "Best bar in the middle of new york",
//     updatedAt: "Jan 22, 2022",
//     createdAt: "Jan 24, 2022",
// },
//   {
//      id:"dfadfafd",
//     name: "Bottle service rosto",
//     imageHash: '',
//     serviceItemType: "line-skip",
//     description: "Best bar in the middle of new york",
//     updatedAt: "Jan 22, 2022",
//     createdAt: "Jan 24, 2022",
// },
// ]


export default function ManagerBookingsView(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()
    const router = useRouter()
    const {switchOrg} = useOrgs()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [pageNumber, setPageNumber] = useState<number|undefined>(0)
    const [pageSize, setPageSize] = useState<number|undefined>(10)
  

    type DataIndex = keyof ServiceItem;

    const [selectedServiceItem, setSelectedServiceItem] = useState<any|ServiceItem>({})

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
  
  
    
      // const onMenuClick=(e:any, record:ManagerOrder) => {
      //   const event = e.key
      //   switch(event){
      //     case 'inActive': inActiveItemsHandler(record);
      //     break;
      //     case 'active': activeItemsHandler(record)
      //     break;
      //     case 'viewDetails': seeFullDetails(record)
      //   }
      // };
      
  
    const columns: ColumnsType<ManagerOrder> = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
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
        title: 'Customer',
        // dataIndex: 'customer',
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
        title: 'Type',
        // dataIndex: 'unitPrice',
        key: 'unitPrice',
        render: (_,record)=>{
          const serviceItemType = record.serviceItemDetails[0].serviceItemType[0].name
          return(
          <div>
            <Tag style={{textTransform:'capitalize'}}>{serviceItemType}</Tag>
          </div>
        )}
      },
      {
        title: 'Unit price',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
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
        align:'right',
        render:(quantity)=>( 
          <div>
            <Text >x</Text>
            <Text>{quantity}</Text>
          </div>
        )
      },
      {
        title: 'Total price',
        // dataIndex: 'totalPrice',
        key: 'totalPrice',
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
      {
        title: 'Payment Status',
        dataIndex: 'paymentIntentStatus',
        key: 'paymentIntentStatus',
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
      //     return <Badge status="success" text={statusText} />
      //   }
      // },
      {
          title: 'Ticket Date',
          dataIndex: 'targeDate',
          key: 'targetDate',
          render: (_,record)=>{
              const date = dayjs(record.targetDate).format('MMM DD, YYYY')
              return(
            <Text>{date}</Text>
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
                 <Title style={{ margin:'0'}} level={2}>Bookings</Title>
                 <Button shape="round" loading={bookingsQuery.isRefetching} onClick={()=>bookingsQuery.refetch()} icon={<ReloadOutlined />}>Refresh</Button>
               </div>
               <div style={{display:'flex', marginTop:'.5rem', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                  <div>
                  <Text>{`Last Updated on - `}</Text> 
                  <Text>{`${dayjs(bookingsQuery.dataUpdatedAt).tz('America/New_York').format("MMM D, YYYY HA z")}`}</Text>
                  {/* <Text>{` · ${dayjs().diff(dayjs(bookingsQuery.dataUpdatedAt),'second',true)} seconds ago`}</Text> */}
                  </div>
               </div>

               </div>
                <Table 
                  style={{width:'100%'}} 
                  key='dfadfe' 
                  size='middle'   
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
