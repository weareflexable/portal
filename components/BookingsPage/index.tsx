import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../hooks/useOrgs";
const {Text, Title} = Typography
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Badge, Alert, notification} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined, CheckOutlined, StopOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';

import { useAuthContext } from '../../context/AuthContext';
import { useServicesContext } from '../../context/ServicesContext';
import {PlusOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { useOrgContext } from "../../context/OrgContext";

import { ServiceItem } from "../../types/Services";
import { Order } from "./Bookings.types";
import useUrlPrefix from "../../hooks/useUrlPrefix";
import { numberFormatter } from "../../utils/numberFormatter";
import { IMAGE_PLACEHOLDER_HASH } from "../../constants";
const {TextArea} = Input
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advanced from "dayjs/plugin/advancedFormat"
import relativeTime from 'dayjs/plugin/relativeTime'
import { EventOrder } from "../../types/Booking";

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


export default function BookingsView(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()
    const router = useRouter()
    const {switchOrg} = useOrgs()
    const {currentService} = useServicesContext()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false) 
    const [pageNumber, setPageNumber] = useState<number|undefined>(1)
    const [pageSize, setPageSize] = useState<number|undefined>(10)

    const urlPrefix = useUrlPrefix();

    const [selectedServiceItem, setSelectedServiceItem] = useState<any|ServiceItem>({})

    async function fetchBookings(){
    const res = await axios({
            method:'get',
            //@ts-ignore
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/bookings?serviceId=${currentService.id}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
            headers:{
                "Authorization": paseto
            }


        })

        return res.data;
   
    }

  


    const bookingsQuery = useQuery({queryKey:['service-bookings',pageNumber,pageSize], queryFn:fetchBookings, enabled:paseto !== ''})
    const data = bookingsQuery.data && bookingsQuery.data.data
    const totalLength = bookingsQuery.data && bookingsQuery.data.dataLength;


    

  
  
    const handleChange: TableProps<Order>['onChange'] = (data) => {
      //@ts-ignore
      setPageNumber(data.current);
      setPageSize(data.pageSize)
    };
  

  
    function viewBookingDetails(event:Order){
      // set state
      setSelectedServiceItem(event)
      // opne drawer
      setIsDrawerOpen(true)

    }
  

    const onMenuClick=( record:Order) => {
      viewBookingDetails(record)
      console.log('click', record);
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
          const icon = paymentStatus === 'successful'?<CheckOutlined rev={undefined} />:paymentStatus === 'cancelled'?<StopOutlined rev={undefined} />:null
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
    {
      dataIndex: 'actions', 
      key: 'actions',
      fixed: 'right',
      width:'70px',
      //@ts-ignore
      render:(_,record:Order)=>{
          return <Button onClick= {()=>onMenuClick(record)} type="text" icon={<MoreOutlined rev={undefined}/>}/> 
      }
    }
    ];

        return (
            <div>
              <div style={{marginBottom:'2em', marginTop:'1rem', display:'flex', width:'100%', flexDirection:'column', alignItems:'center'}}>
               <div style={{display:'flex', marginTop:'1rem', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                 <Title style={{ margin:'0'}} level={2}>Bookings</Title>
                 <Button shape="round" loading={bookingsQuery.isRefetching} onClick={()=>bookingsQuery.refetch()} icon={<ReloadOutlined rev={undefined} />}>Refresh</Button>
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
                  key='dfadfe' 
                  scroll={{ x: 'calc(600px + 50%)'}} 
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
                 />}

{
                  isDrawerOpen
                  ?<DetailDrawer isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedRecord={selectedServiceItem}/>
                  :null
                }
            </div>
    )



}


interface DrawerProps{
  selectedRecord: Order,
  isDrawerOpen: boolean,
  closeDrawer: (value:boolean)=>void
}

function DetailDrawer({selectedRecord,isDrawerOpen,closeDrawer}:DrawerProps){

const queryClient = useQueryClient()
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

const isTicketExpired = dayjs().isAfter(dayjs(selectedRecord.targetDate))


function closeDrawerHandler(){
  queryClient.invalidateQueries(['event-bookings']) 
  closeDrawer(!isDrawerOpen)
}

function toggleDeleteModal(){
  setIsDeleteModalOpen(!isDeleteModalOpen)
}




const [form] = Form.useForm()


return( 
<Drawer 
  title="Redeem Ticket" 
  width={400} 
  placement="right" 
  closable={true} 
  onClose={closeDrawerHandler} 
  open={isDrawerOpen}
>
  <div
    style={{width:'100%',}}
  >
{selectedRecord.ticketDetails.map((ticket:any)=>{
          return(
          <RedeemTicketForm
            key={ticket.id}
            isTicketExpired = {isTicketExpired}
            ticket={ticket}
            userId = {selectedRecord.userTicketId}
          />
          )
        })}
    {selectedRecord.redeemStatus === 'redeemed'
    ?<Text type="secondary" >It appears that your ticket has already been redeemed </Text>
    :selectedRecord.paymentIntentStatus!== 'successful'
    ?<Text>Payment status for this ticket has to be successful before it can be redeemed</Text>
    :null
    }

    {/* <MintNFT
      bookingId={selectedRecord?.bookingId}
      ticketId={selectedRecord?.ticketDetails.id}
    /> */}
</div>



</Drawer>
)
}



interface IRedeemTicketForm{
  ticket: any,
  isTicketExpired: boolean,
  userId: string
}

function RedeemTicketForm({ticket, userId, isTicketExpired}:IRedeemTicketForm){

  const {paseto} = useAuthContext()
  
  const [isRedeemed, setIsRedeemed] = useState(false)

  const queryClient = useQueryClient()

  const urlPrefix =  useUrlPrefix()


  const nftMutation = useMutation({
    mutationFn: async(payload:any)=>{
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/nft/service`,payload,{
        headers:{
            "Authorization": paseto
        },
    })
      return res;
    },
    onSuccess: async()=>{
      notification['success']({
        message: 'Success minting NFT'
      })
    },
    onError: async()=>{
      notification['error']({
        message: 'Error minting NFT!'
      })
    }
  })

  function mintToken(){
    nftMutation.mutate({bookingId: ticket.serviceBookingId, ticketId: ticket.id})
  }

  const redeemTicketHandler = async(ticketPayload:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/employee/redeem-ticket`, ticketPayload,{
        headers:{
            "Authorization": paseto
        },
    })
    return data
  }

  function onFinish(values:any){
    console.log(values)
  
    const isRedeemCodeValid = ticket.ticketSecret == values.ticketSecret
    // check if ticket has expired
    // check if input is the same as redeemCode
    if(!isRedeemCodeValid) {
      notification['warning']({
        message: 'The secret you provided does not match the one on the ticket',
      });
      return
    }
  
    // if payment status and booking status is not succesful, don't redeem ticket
    // check ticket validity
  
    const payload ={
      item: {
          id: ticket.id,  //need to valiadte exp using start date time + duration 
          type: "venue",
          communityVenueId: ""
      },
      ticketSecret: ticket.ticketSecret,
      redeemMethod: "uniqueCode",
      userId: ticket.targetUserID
  }
      redeemServiceTicket.mutate(payload)
  }
  
  const redeemServiceTicket = useMutation(redeemTicketHandler,{
    onSuccess:(data)=>{
      if(data.status>201){
        notification['error']({
          message: 'Error redeeming ticket',
        });
      }else{
      notification['success']({
        message: 'Success redeeming user ticket',
      });
      setIsRedeemed(true)
      }
    },
      onSettled:()=>{
          queryClient.invalidateQueries(['service-bookings'])
      }
  })
  
  const{isLoading:isRedeeming} = redeemServiceTicket
  

  const [form] = Form.useForm()


  return(
      <div style={{marginBottom:'4rem'}}>
            <div style={{marginBottom:'.4rem'}}>
            <Text >Redeem for <Text strong >{ticket.firstName} {ticket.lastName}</Text></Text>
            </div>
            {isRedeemed || ticket.ticketStatus === 'redeemed'
            ?<Alert style={{marginBottom:'.3rem'}} message="Ticket has been redeemed" type="success" />
            : isTicketExpired
            ? <Text>Ticket has expired</Text>
            :<Form form={form} onFinish={onFinish}>
            <Form.Item name={'ticketSecret'}  style={{marginBottom:'1rem'}} rules={[{required:true, message: 'This field is required'}, {max:6, message: 'You have exceed the max number of digits for a secret'}]}>
              <Input disabled={ticket.redeemStatus === 'redeemed'} name="ticketSecret" size="large" />
            </Form.Item>
            <Form.Item>
              <Button
                shape="round" 
                block 
                disabled={ticket.ticketStatus === 'redeemed' || ticket.bookingStatus === 'Failed'}
                type="primary" 
                size="large" 
                style={{marginBottom:'.5rem'}}
                loading={isRedeeming}  
                htmlType="submit"
              >
                 Redeem Ticket
              </Button>
            </Form.Item>
          </Form>}
            {ticket.transactionHash.length > 10
              ?<Alert style={{marginBottom:'0'}} message="NFT has been minted for this ticket" type="success" />
              :<Button
                shape="round" 
                block 
                type="default" 
                onClick={mintToken} 
                size="large" 
                style={{marginBottom:'4rem'}}
                loading={nftMutation.isLoading}  
              >
                 Mint NFT
              </Button>}
          </div>
  )
}




function EmptyState(){
  return(
    <div style={{border: '1px solid #e5e5e5', display:'flex', justifyContent:'center', marginTop:'2rem', alignItems:'center', padding: '2rem'}}>
      <div style={{maxWidth:'300px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <Title style={{textAlign:'center'}} level={3}>Oops!</Title>
        <Text style={{textAlign:'center'}}>There are currently no bookings for this service</Text>
        {/* <Button size="large" shape="round" type="ghost" icon={<PlusOutlined />} style={{marginTop:'1rem'}}>Create New Organization</Button> */}
      </div>
    </div>
  )
}


