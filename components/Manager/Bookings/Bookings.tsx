import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../../hooks/useOrgs";
const {Text,Title} = Typography
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Badge, Alert, notification} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined, CheckOutlined,StopOutlined} from '@ant-design/icons'

import { useAuthContext } from '../../../context/AuthContext';
import {PlusOutlined} from '@ant-design/icons'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { ServiceItem } from "../../../types/Services";
import { ManagerOrder } from "./Bookings.types";
import useUrlPrefix from "../../../hooks/useUrlPrefix";

import {numberFormatter} from '../../../utils/numberFormatter'
import { IMAGE_PLACEHOLDER_HASH } from "../../../constants";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advanced from "dayjs/plugin/advancedFormat"
import relativeTime from 'dayjs/plugin/relativeTime'
import { EventOrder } from "../../../types/Booking";

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advanced)




export default function ManagerBookingsView(){

    const {paseto} = useAuthContext()
    const [pageNumber, setPageNumber] = useState<number|undefined>(1)
    const [pageSize, setPageSize] = useState<number|undefined>(10)
    const [selectedRecord, setSelectedRecord] = useState<any>({})
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  

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


    function viewBookingDetails(event:ManagerOrder){
      // set state
      setSelectedRecord(event)
      // opne drawer
      setIsDrawerOpen(true)

    }
  

    const onMenuClick=( record:ManagerOrder) => {
      viewBookingDetails(record)
      console.log('click', record);
    };

    

  
  
    const handleChange: TableProps<ManagerOrder>['onChange'] = (data) => {
      // console.log('Various parameters', pagination, filters, sorter); 
      console.log(data)
      // @ts-ignore
      setPageNumber(data.current) 
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
        width:'250px',
        fixed:'left',
        render:(_,record)=>{
          const serviceItemName = record.serviceItemDetails[0]?.name
          const serviceName = record?.serviceDetails[0]?.name
          const logoImageHash = record.serviceItemDetails[0]?.logoImageHash
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
          const serviceType = record?.serviceDetails[0]?.serviceType?.name
          return(
          <div>
            <Tag style={{textTransform:'capitalize'}}>{serviceType}</Tag>
          </div>
        )}
      },
      {
        title: 'Customer',
        // dataIndex: 'customer',
        ellipsis:true,
        width:'250px',
        key: 'customer',
        render:(_,record)=>{
          const user = record.user[0] 
          const email = user && user.email
          const name = user?.name 
          const profilePicHash = user && user.profilePic
            return( 
                <div style={{display:'flex',alignItems:'center'}}>
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Profile image' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${profilePicHash && profilePicHash.length < 20 ? IMAGE_PLACEHOLDER_HASH : profilePicHash}`}/>
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
      width:'125px',
      fixed:'right',
      render: (paymentStatus)=>{
        const color = paymentStatus === 'successful'?'green':paymentStatus === 'failed'?'red':paymentStatus === 'cancelled'?'grey':'blue'
        const icon = paymentStatus === 'successful'?<CheckOutlined rev={undefined} />:paymentStatus === 'cancelled'?<StopOutlined rev={undefined} />:null
        return <Tag icon={icon} color={color} style={{textTransform:'capitalize'}}>{paymentStatus}</Tag>
      }
    },
    {
      title: 'Ticket Date',
      dataIndex: 'targetDate',
      key: 'targetDate',
      fixed:'right',
      width: '110px',
      render: (targetDate)=>{
          const date = dayjs(targetDate).format('MMM DD, YYYY')
          return(
        <Text type='secondary'>{date}</Text>
        )
    }
  },

  // {
  //   dataIndex: 'actions', 
  //   key: 'actions',
  //   fixed: 'right',
  //   width:'70px',
  //   //@ts-ignore
  //   render:(_,record:EventOrder)=>{
  //       return <Button onClick= {()=>onMenuClick(record)} type="text" icon={<MoreOutlined rev={undefined}/>}/> 
  //   }
  // }
    ];

        return (
            <div style={{width:'100%', padding:'0', margin: '0'}}>
                <div style={{marginBottom:'2rem', display:'flex', width:'100%', flexDirection:'column', alignItems:'center'}}>
                  <div style={{display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                      <div style={{display:'flex', marginTop:'.5rem', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                          <div>
                            <Text>{`Last Updated on - `}</Text> 
                            <Text>{`${dayjs(bookingsQuery.dataUpdatedAt).tz('America/New_York').format("MMM D, YYYY z")}`}</Text>
                            <Text>{` · ${dayjs(bookingsQuery.dataUpdatedAt).tz('America/New_York').format('HH:mm:ss')} secs ago`}</Text>
                          </div>
                      </div>
                      <Button shape="round" loading={bookingsQuery.isRefetching} onClick={()=>bookingsQuery.refetch()} icon={<ReloadOutlined rev={undefined} />}>Refresh</Button>
                  </div>
               </div>
                <Table 
                  style={{width:'100%'}} 
                  rowKey={(record)=>record.id}
                  size='small'  
                  scroll={{ x: 'calc(450px + 50%)'}} 
                  loading={bookingsQuery.isLoading||bookingsQuery.isRefetching} 
                  // @ts-ignore 
                  columns={columns} 
                  pagination={{
                    total:totalLength,  
                    showTotal:(total) => `Total ${total} items`,
                  }} 
                  // @ts-ignore 
                  onChange={handleChange} 
                  dataSource={data} 
                  />
                {/* {
                  isDrawerOpen
                  ?<DetailDrawer 
                  isDrawerOpen={isDrawerOpen} 
                  closeDrawer={setIsDrawerOpen} 
                  selectedRecord={selectedRecord}/>
                  :null
                } */}
            </div>
    )



}



// interface DrawerProps{
//   selectedRecord: ManagerOrder,
//   isDrawerOpen: boolean,
//   closeDrawer: (value:boolean)=>void
// }

//   function DetailDrawer({selectedRecord,isDrawerOpen,closeDrawer}:DrawerProps){

//     const queryClient = useQueryClient()
    
    
//     const isTicketExpired = dayjs().isAfter(dayjs(selectedRecord.eventDetails.startTime).add(selectedRecord.eventDetails.duration/60,'h').tz('UTC'))
    
    
//     function closeDrawerHandler(){
//       queryClient.invalidateQueries(['manager-event-bookings']) 
//       closeDrawer(!isDrawerOpen)
//     }
    
    
    
    
//     return( 
//     <Drawer 
//       title="Redeem Ticket" 
//       width={400} 
//       placement="right" 
//       closable={true} 
//       onClose={closeDrawerHandler} 
//       open={isDrawerOpen}
//     >
//       <div
//         style={{width:'100%',}}
//       >
//         {selectedRecord.ticketDetails.map((ticket:any)=>{
//           return(
//             <RedeemTicketForm
//             key={ticket.id}
//             isTicketExpired = {isTicketExpired}
//             ticket={ticket}
//           />
//           )
//         })}
   
//    {selectedRecord.redeemStatus === 'redeemed'
//     ?<Text type="secondary" >It appears that your ticket has already been redeemed </Text>
//     :selectedRecord.paymentIntentStatus!== 'sucessful'
//     ?<Text>Payment status for this ticket has to be successful before it can be redeemed</Text>
//     :null
//     }
//     </div>
    
    
    
//     </Drawer>
//     )
//     }




//     interface IRedeemTicketForm{
//       ticket: any,
//       isTicketExpired: boolean
//     }
//     function RedeemTicketForm({ticket, isTicketExpired}:IRedeemTicketForm){
    
//       const {paseto} = useAuthContext()
      
//       const [isRedeemed, setIsRedeemed] = useState(false)
    
//       const queryClient = useQueryClient()
    
//       const urlPrefix =  useUrlPrefix()
    
    
//       const nftMutation = useMutation({
//         mutationFn: async(payload:any)=>{
//           const res = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/nft/event`,payload,{
//             headers:{
//                 "Authorization": paseto
//             },
//         })
//           return res;
//         },
//         onSuccess: async()=>{
//           notification['success']({
//             message: 'Success minting NFT'
//           })
//         },
//         onError: async()=>{
//           notification['error']({
//             message: 'Error minting NFT!'
//           })
//         }
//       })
    
//       function mintToken(){
//         nftMutation.mutate({bookingId: ticket.eventBookingId, ticketId: ticket.id})
//       }
    
//       const redeemTicketHandler = async(ticketPayload:any)=>{
//         const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/employee/redeem-ticket`, ticketPayload,{
//             headers:{
//                 "Authorization": paseto
//             },
//         })
//         return data
//       }
    
//       function onFinish(values:any){
//         console.log(values)
      
//         const isRedeemCodeValid = ticket.ticketSecret == values.ticketSecret
//         // check if ticket has expired
//         // check if input is the same as redeemCode
//         if(!isRedeemCodeValid) {
//           notification['warning']({
//             message: 'The secret you provided does not match the one on the ticket',
//           });
//           return
//         }
      
//         // if payment status and booking status is not succesful, don't redeem ticket
//         // check ticket validity
      
//         const payload ={
//           item: {
//               id: ticket.eventId,  //need to valiadte exp using start date time + duration 
//               type: "event",
//               communityVenueId: ""
//           },
//           ticketSecret: ticket.ticketSecret,
//           redeemMethod: "uniqueCode",
//           userId: ticket.userId
//       }
//           redeemEventTicket.mutate(payload)
//       }
      
//       const redeemEventTicket = useMutation(redeemTicketHandler,{
//         onSuccess:(data)=>{
//           if(data.status>201){
//             notification['error']({
//               message: 'Error creating events',
//             });
//           }else{
//           notification['success']({
//             message: 'Success redeeming user ticket',
//           });
//           setIsRedeemed(true)
//           }
//         },
//           onSettled:()=>{
//               queryClient.invalidateQueries(['event-bookings'])
//           }
//       })
      
//       const{isLoading:isRedeeming} = redeemEventTicket
      
    
//       const [form] = Form.useForm()
    
    
//       return(
//           <div style={{marginBottom:'4rem'}}>
//                 <div style={{marginBottom:'.4rem'}}>
//                 <Text >Redeem for <Text strong >{ticket.firstName} {ticket.lastName}</Text></Text>
//                 </div>
//                 {isRedeemed || ticket.ticketStatus === 'redeemed'
//                 ?<Alert style={{marginBottom:'.3rem'}} message="Ticket has been redeemed" type="success" />
//                 :<Form form={form} onFinish={onFinish}>
//                 <Form.Item name={'ticketSecret'}  style={{marginBottom:'1rem'}} rules={[{required:true, message: 'This field is required'}, {max:6, message: 'You have exceed the max number of digits for a secret'}]}>
//                   <Input disabled={ticket.redeemStatus === 'redeemed'} name="ticketSecret" size="large" />
//                 </Form.Item>
//                 <Form.Item>
//                 {isTicketExpired
//                   ?<Text>Ticket has expired</Text>
//                   :<Button
//                     shape="round" 
//                     block 
//                     disabled={ticket.ticketStatus === 'redeemed' || ticket.bookingStatus === 'Failed'}
//                     type="primary" 
//                     size="large" 
//                     style={{marginBottom:'.5rem'}}
//                     loading={isRedeeming}  
//                     htmlType="submit"
//                   >
//                      Redeem Ticket
//                   </Button>}
//                 </Form.Item>
//               </Form>}
//                 {ticket.transactionHash.length > 10
//                   ?<Alert style={{marginBottom:'0'}} message="NFT has been minted for this ticket" type="success" />
//                   :<Button
//                     shape="round" 
//                     block 
//                     type="default" 
//                     onClick={mintToken} 
//                     size="large" 
//                     style={{marginBottom:'4rem'}}
//                     loading={nftMutation.isLoading}  
//                   >
//                      Mint NFT
//                   </Button>}
//               </div>
//       )
//     }
    
    