import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TableProps, Tag, Button, Table, Image, Typography, Drawer, Form, Input, notification } from "antd";
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




export default function EventBookings(){

    const {paseto} = useAuthContext()
    const [pageNumber, setPageNumber] = useState<number|undefined>(1)
    const [pageSize, setPageSize] = useState<number|undefined>(10)

    const [selectedRecord, setSelectedRecord] = useState<any|EventOrder>({})
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  



    const urlPrefix = useUrlPrefix()
    
    async function fetchBookings(){
    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/event/bookings?pageNumber=${pageNumber}&pageSize=${pageSize}`,
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


    const bookingsQuery = useQuery({queryKey:['eventBookings',pageNumber,pageSize], queryFn:fetchBookings, enabled:paseto !== ''})
    const data = bookingsQuery.data && bookingsQuery.data.data
    const totalLength = bookingsQuery.data && bookingsQuery.data.dataLength;
    
    
    const downloadBookingsQuery = useQuery({queryKey:['allEventBookings'], queryFn:fetchAllBookings, enabled:false})

    async function downloadRecords(){

      let csv;
      try{
        const res = await axios({
          method:'get',
          url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/user-event-ticket`,
          headers:{
              "Authorization": paseto
          }
      })

      csv =  await converter.json2csv(res.data.data)
      
      }catch(err){
        notification['error']({
          message: 'Error downloading your records, please try again!'
        })
      }
      



      let csvContent = "data:text/csv;charset=utf-8," +csv;

      const encodedUri = encodeURI(csvContent)
    

      const link = document.createElement('a');
      link.setAttribute("href", encodedUri);
      link.setAttribute('download', `Event_bookings.csv`);
      document.body.appendChild(link);
      link.click();
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
      {
        title: 'Event',
        dataIndex: 'name',
        key: 'name',
        ellipsis:true,
        width:'250px',
        fixed:'left',
        render:(_,record)=>{

          const coverImageHash = record.eventDetails.coverImageHash
            return( 
                <div style={{display:'flex',alignItems:'center'}}>
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Event cover image' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${coverImageHash.length < 10? IMAGE_PLACEHOLDER_HASH : coverImageHash}`}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text>{record.eventDetails.name}</Text>   
                        {/* <Text type="secondary">{serviceName}</Text>   */}
                    </div>
                </div>
            )
        },
      },
      
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
      fixed:'right',
      render: (bookingStatus)=>{
        const color = bookingStatus === 'confirmed'?'green':'red'
        const icon = bookingStatus === 'confirmed'?<CheckOutlined rev={undefined} />:null
        return <Tag icon={icon} color={color} style={{textTransform:'capitalize'}}>{bookingStatus}</Tag>
      }
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      width: '150px',
      render: (_,record)=>{ 
          const date = dayjs(record.eventDetails.startTime).tz("UTC").format('MMM DD, YYYY H A')
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
  {
    title: 'Redeem Status',
    dataIndex: 'redeemStatus',
    key: 'redeemStatus',
    width:'150px',
    fixed:'right',
    render: (redeemStatus)=>{
      const color = redeemStatus === 'redeemed'?'green': 'red'
      const icon = redeemStatus === 'redeemed'?<CheckOutlined rev={undefined} />:null
      return <Tag icon={icon} color={color} style={{textTransform:'capitalize'}}>{redeemStatus}</Tag>
    }
  },
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
                      <Button shape="round" style={{marginRight:'.3rem'}} loading={downloadBookingsQuery.isRefetching} onClick={downloadRecords} icon={<DownloadOutlined rev={undefined} />}>Export</Button>
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

// const {switchEvent} = useEvent()
const {paseto} = useAuthContext()


function closeDrawerHandler(){
  queryClient.invalidateQueries(['event-bookings']) 
  closeDrawer(!isDrawerOpen)
}

function toggleDeleteModal(){
  setIsDeleteModalOpen(!isDeleteModalOpen)
}



const redeemTicketHandler = async(ticketPayload:any)=>{
  const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/employee/redeem-ticket`, ticketPayload,{
      headers:{
          "Authorization": paseto
      },
  })
  return data
}
function onFinish(){

  // if payment status and booking status is not succesful, don't redeem ticket
  // check ticket validity

  const payload ={
    item: {
        id: selectedRecord.eventId,  //need to valiadte exp using start date time + duration 
        type: "event",
        communityVenueId: ""
    },
    ticketSecret: selectedRecord.ticketSecret,
    redeemMethod: "uniqueCode",
    userId: selectedRecord.userId
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
    }
  },
    onSettled:()=>{
        // queryClient.invalidateQueries(['event-bookings'])
    }
})

const{isLoading:isRedeeming} = redeemEventTicket

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
{/* <Form form={form} onFinish={onFinish}>
  <Form.Item style={{marginBottom:'1rem'}} rules={[{required:true, message: 'This field is required'}, {type:"integer", message: 'Redeem code must be numbers'}]}>
    <Input name="ticketSecret" size="large" />
  </Form.Item>
  <Form.Item>
  </Form.Item>
  
</Form> */}
    <Button
      shape="round" 
      block 
      disabled={selectedRecord.redeemStatus !== 'redeemed' && selectedRecord.bookingStatus==='confirmed'}
      onClick={onFinish}
      type="primary" 
      size="large" 
      style={{marginBottom:'.5rem'}}
      loading={isRedeeming}  
      htmlType="submit"
    >
       Redeem Ticket
    </Button>
    {/* {selectedRecord.redeemStatus !== 'redeemed'?<Text type="secondary" >It appears that your ticket has already been redeemed </Text>:null} */}
</div>



</Drawer>
)
}