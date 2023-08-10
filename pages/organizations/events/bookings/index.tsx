import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TableProps, Tag, Button, Table, Image,  Typography, Drawer, Form, Input, notification, Alert } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useState } from "react";
import { IMAGE_PLACEHOLDER_HASH } from "../../../../constants";
import { useAuthContext } from "../../../../context/AuthContext";
import useUrlPrefix from "../../../../hooks/useUrlPrefix";
import { EventOrder } from "../../../../types/Booking";
import { numberFormatter } from "../../../../utils/numberFormatter";
// import converter from 'json-2-csv'
import * as converter from 'json-2-csv';
// import { json2csv } from 'json-2-csv'

const {Title,Text} = Typography


import {ReloadOutlined, DownloadOutlined, MoreOutlined, CheckOutlined,StopOutlined} from '@ant-design/icons'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advanced from "dayjs/plugin/advancedFormat"
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advanced)


import EventsLayout from "../../../../components/Layout/EventsLayout";
import useEvent from "../../../../hooks/useEvents";
import React from "react";




export default function EventBookings(){

    const {paseto} = useAuthContext()
    const [pageNumber, setPageNumber] = useState<number|undefined>(1)
    const [pageSize, setPageSize] = useState<number|undefined>(10)
    const {currentEvent} = useEvent()
    const [isDownloadingTickets, setIsDownloadingTickets]= useState(false)

    const [selectedRecord, setSelectedRecord] = useState<any|EventOrder>({})
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)


  



    const urlPrefix = useUrlPrefix()
    
    async function fetchBookings(){
    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/event/bookings?pageNumber=${pageNumber}&pageSize=${pageSize}&eventId=${currentEvent.id}`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
   
    }
    async function fetchAllBookings(){

    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/user-event-ticket`,
            headers:{
                "Authorization": paseto
            }
        })
        return res.data; 
    }


    const bookingsQuery = useQuery({queryKey:['event-bookings',pageNumber,pageSize], queryFn:fetchBookings, enabled:paseto !== ''})
    const data = bookingsQuery.data && bookingsQuery.data.data
    const totalLength = bookingsQuery.data && bookingsQuery.data.dataLength;
    
    

    async function downloadRecords(){

      let csv;
      setIsDownloadingTickets(true)
      try{
        const res = await axios({
          method:'get',
          url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/user-event-ticket/all?eventId=${currentEvent.id}`,
          headers:{
              "Authorization": paseto
          }
      })


      if(res.data.data.status > 201){
        notification['error']({
          message: 'Error downloading your records, please try again!'
        })
        setIsDownloadingTickets(false)
        return
      }
 
      if(res.data.data.length < 1){
        notification['warning']({
          message: "Sorry! There are no successful bookings to download"
        })
        setIsDownloadingTickets(false)
        return
      }else{
        csv =  await converter.json2csv(res.data.data)
        let csvContent = "data:text/csv;charset=utf-8," +csv;

        const encodedUri = encodeURI(csvContent)
      
  
        const link = document.createElement('a');
        link.setAttribute("href", encodedUri);
        link.setAttribute('download', `Event_bookings.csv`);
        document.body.appendChild(link);
        link.click();
        setIsDownloadingTickets(false)
      }
      
      }catch(err){
        notification['error']({
          message: 'Error downloading your records, please try again!'
        })
        setIsDownloadingTickets(false)
      }
      
     
    }

  
  
    const handleChange: TableProps<EventOrder>['onChange'] = (data,sorter) => {
      // console.log('Various parameters', pagination, filters, sorter); 
      console.log(sorter)
      // @ts-ignore
      setPageNumber(data.current) 
      setPageSize(data.pageSize)

    };

    function viewBookingDetails(event:EventOrder){
      // set state
      setSelectedRecord(event)
      // opne drawer
      setIsDrawerOpen(true)

    }
  

    const onMenuClick=( record:EventOrder) => {
      viewBookingDetails(record)
      console.log('click', record);
    };


  

    const columns: ColumnsType<EventOrder> = [
      // {
      //   title: 'Event',
      //   dataIndex: 'name',
      //   key: 'name',
      //   ellipsis:true,
      //   width:'250px',
      //   fixed:'left',
      //   render:(_,record)=>{

      //     const coverImageHash = record.eventDetails.coverImageHash
      //       return( 
      //           <div style={{display:'flex',alignItems:'center'}}>
      //               <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Event cover image' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${coverImageHash.length < 10? IMAGE_PLACEHOLDER_HASH : coverImageHash}`}/>
      //               <div style={{display:'flex',flexDirection:'column'}}>
      //                   <Text>{record.eventDetails.name}</Text>   
      //                   {/* <Text type="secondary">{serviceName}</Text>   */}
      //               </div>
      //           </div>
      //       )
      //   },
      // },
      
      {
        title: 'Customer',
        dataIndex: 'user',
        ellipsis:true,
        width:'250px',
        key: 'user',
        render:(_,record)=>{
          const user = record.user
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
        // defaultSortOrder: 'ascend', 
        // sorter: (a, b) => a.user.name.length - b.user.name.length, 
      },
    
      {
        title: 'Unit Price',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        width:'120px',
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
        width:'80px',
        align:'right',
        render:(quantity)=>( 
          <div>
            <Text >x</Text>
            <Text>{quantity}</Text>
          </div>
        ),

        // defaultSortOrder: 'descend', 
        // sorter: (a, b) => a.quantity - b.quantity,  
      },
      {
        title: 'Total Price',
        // dataIndex: 'totalPrice',
        key: 'totalPrice',
        width:'100px',
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
      width:'140px',
      // fixed:'right',
      render: (paymentStatus)=>{
        const color = paymentStatus === 'successful'?'green':paymentStatus === 'failed'?'red':paymentStatus === 'cancelled'?'grey':'blue'
        const icon = paymentStatus === 'successful'?<CheckOutlined rev={undefined} />:paymentStatus === 'cancelled'?<StopOutlined rev={undefined} />:null
        return <Tag icon={icon} color={color} style={{textTransform:'capitalize'}}>{paymentStatus}</Tag>
      }
    },
    {
      title: 'Booking Status',
      dataIndex: 'bookingStatus',
      key: 'bookingStatus',
      width:'150px',
      render: (bookingStatus)=>{
        const color = bookingStatus === 'Confirmed'?'green':bookingStatus === 'Initiated'?'blue': 'red'
        const icon = bookingStatus === 'Confirmed'?<CheckOutlined rev={undefined} />:null
        return <Tag icon={icon} color={color} style={{textTransform:'capitalize'}}>{bookingStatus}</Tag>
      }
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      width: '150px',
      render: (_,record)=>{ 
          const date = dayjs(record.eventDetails.startTime).tz("UTC").format('MMM DD, YYYY h A')
          return(
        <Text type='secondary'>{date}</Text>
        )
    }
  },
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '100px',
      render: (createdAt)=>{
          const date = dayjs(createdAt).format('MMM DD, YYYY')
          return(
        <Text type='secondary'>{date}</Text>
        )
    }
  },
  // {
  //   title: 'Redeem Status',
  //   dataIndex: 'redeemStatus',
  //   key: 'redeemStatus',
  //   width:'150px',
  //   fixed:'right',
  //   render: (_,record)=>{
  //     const isTicketExpired = dayjs().isAfter(dayjs(record.eventDetails.startTime).add(record.eventDetails.duration/60,'h').tz('UTC'))
  //     const status = record.redeemStatus === 'redeemed' ? 'redeemed': record.redeemStatus === 'active' && isTicketExpired? 'expired': record.bookingStatus==='Failed'? 'cancelled': 'active'
  //     const color = status === 'redeemed'?'green': status === 'expired'?'red': status==='cancelled'? 'grey' :'blue'
  //     const icon = status === 'redeemed'?<CheckOutlined rev={undefined} />:status === 'cancelled'?<StopOutlined rev={undefined}/>:null
  //     return <Tag icon={icon} color={color} style={{textTransform:'capitalize'}}>{status}</Tag>
  //   }
  // },
  {
    dataIndex: 'actions', 
    key: 'actions',
    fixed: 'right',
    width:'70px',
    //@ts-ignore
    render:(_,record:EventOrder)=>{
        return <Button onClick= {()=>onMenuClick(record)} type="text" icon={<MoreOutlined rev={undefined}/>}/> 
    }
  }
    
    ];

        return (
            <div style={{width:'100%', padding:'0', margin: '0'}}>
                <div style={{marginBottom:'2rem', display:'flex', width:'100%', flexDirection:'column', alignItems:'flex-start'}}>
                <Title style={{margin: '0', marginTop:'2rem'}} level={2}>Bookings</Title>
                  <div style={{display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                      <div style={{display:'flex', marginTop:'.5rem', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                          <div>
                            <Text>{`Last Updated on - `}</Text> 
                            <Text>{`${dayjs(bookingsQuery.dataUpdatedAt).tz('America/New_York').format("MMM D, YYYY z")}`}</Text>
                            <Text>{` · ${dayjs(bookingsQuery.dataUpdatedAt).tz('America/New_York').format('HH:mm:ss')} secs ago`}</Text>
                          </div>
                      </div>
                      <Button shape="round" style={{marginRight:'.3rem'}} loading={isDownloadingTickets} onClick={downloadRecords} icon={<DownloadOutlined rev={undefined} />}>Export</Button>
                      <Button shape="round" loading={bookingsQuery.isRefetching} onClick={()=>bookingsQuery.refetch()} icon={<ReloadOutlined rev={undefined} />}>Refresh</Button>
                  </div>
               </div>
                <Table 
                  style={{width:'100%'}} 
                  rowKey={(record)=>record.id}
                  size='small'  
                  scroll={{ x: 'calc(450px + 50%)'}} 
                  loading={bookingsQuery.isLoading||bookingsQuery.isRefetching} 
                  columns={columns} 
                  pagination={{
                    total:totalLength,  
                    showTotal:(total) => `Total ${total} items`,
                  }} 
                  onChange={handleChange} 
                  dataSource={data} 
                  />
                {
                  isDrawerOpen
                  ?<DetailDrawer isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedRecord={selectedRecord}/>
                  :null
                }
            </div>
    )

}


EventBookings.PageLayout = EventsLayout



interface DrawerProps{
  selectedRecord: EventOrder,
  isDrawerOpen: boolean,
  closeDrawer: (value:boolean)=>void
}

function DetailDrawer({selectedRecord,isDrawerOpen,closeDrawer}:DrawerProps){

const queryClient = useQueryClient()
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

const isTicketExpired = dayjs().isAfter(dayjs(selectedRecord.eventDetails.startTime).add(selectedRecord.eventDetails.duration/60,'h').tz('UTC'))


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
  isTicketExpired: boolean
}
function RedeemTicketForm({ticket, isTicketExpired}:IRedeemTicketForm){

  const {paseto} = useAuthContext()
  
  const [isRedeemed, setIsRedeemed] = useState(false)

  const queryClient = useQueryClient()

  const urlPrefix =  useUrlPrefix()


  const nftMutation = useMutation({
    mutationFn: async(payload:any)=>{
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/nft/event`,payload,{
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
    nftMutation.mutate({bookingId: ticket.eventBookingId, ticketId: ticket.id})
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
          id: ticket.eventId,  //need to valiadte exp using start date time + duration 
          type: "event",
          communityVenueId: ""
      },
      ticketSecret: ticket.ticketSecret,
      redeemMethod: "uniqueCode",
      userId: ticket.userId
  }
      redeemEventTicket.mutate(payload)
  }
  
  const redeemEventTicket = useMutation(redeemTicketHandler,{
    onSuccess:(data)=>{
      if(data.status>201){
        notification['error']({
          message: 'Error creating events',
        });
      }else{
      notification['success']({
        message: 'Success redeeming user ticket',
      });
      setIsRedeemed(true)
      }
    },
      onSettled:()=>{
          queryClient.invalidateQueries(['event-bookings'])
      }
  })
  
  const{isLoading:isRedeeming} = redeemEventTicket
  

  const [form] = Form.useForm()


  return(
      <div style={{marginBottom:'4rem'}}>
            <div style={{marginBottom:'.4rem'}}>
            <Text >Redeem for <Text strong >{ticket.firstName} {ticket.lastName}</Text></Text>
            </div>
            {isRedeemed || ticket.ticketStatus === 'redeemed'
            ?<Alert style={{marginBottom:'.3rem'}} message="Ticket has been redeemed" type="success" />
            :<Form form={form} onFinish={onFinish}>
            <Form.Item name={'ticketSecret'}  style={{marginBottom:'1rem'}} rules={[{required:true, message: 'This field is required'}, {max:6, message: 'You have exceed the max number of digits for a secret'}]}>
              <Input disabled={ticket.redeemStatus === 'redeemed'} name="ticketSecret" size="large" />
            </Form.Item>
            <Form.Item>
            {isTicketExpired
              ?<Text>Ticket has expired</Text>
              :<Button
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
              </Button>}
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

