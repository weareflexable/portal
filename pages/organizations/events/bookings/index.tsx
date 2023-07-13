import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TableProps, Tag, Button, Table, Image, Typography, Drawer, Form, Input, notification } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useState } from "react";
import ManagerBookingsLayout from "../../../../components/Layout/ManagerBookingsLayout"
import { IMAGE_PLACEHOLDER_HASH } from "../../../../constants";
import { useAuthContext } from "../../../../context/AuthContext";
import useUrlPrefix from "../../../../hooks/useUrlPrefix";
import { EventOrder } from "../../../../types/Booking";
import { ServiceItem } from "../../../../types/Services";
import { numberFormatter } from "../../../../utils/numberFormatter";

const {Title} = Typography

import {ReloadOutlined, DownloadOutlined, CheckOutlined,StopOutlined} from '@ant-design/icons'

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

const {Text} = Typography



export default function EventBookings(){

    const {paseto} = useAuthContext()
    const [pageNumber, setPageNumber] = useState<number|undefined>(1)
    const [pageSize, setPageSize] = useState<number|undefined>(10)
  



    const urlPrefix = useUrlPrefix()
    
    async function fetchBookings(){
    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/bookings/events?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
   
    }


    const bookingsQuery = useQuery({queryKey:['eventBookings',pageNumber,pageSize], queryFn:fetchBookings, enabled:paseto !== ''})
    const data = bookingsQuery.data && bookingsQuery.data.data
    const totalLength = bookingsQuery.data && bookingsQuery.data.dataLength;


    

  
  
    const handleChange: TableProps<EventOrder>['onChange'] = (data,sorter) => {
      // console.log('Various parameters', pagination, filters, sorter); 
      console.log(sorter)
      // @ts-ignore
      setPageNumber(data.current) 
      setPageSize(data.pageSize)

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

          const coverImageHash = record.coverImageHash
            return( 
                <div style={{display:'flex',alignItems:'center'}}>
                    {/* <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Event cover image' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${coverImageHash.length < 10? IMAGE_PLACEHOLDER_HASH : coverImageHash}`}/> */}
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text>{record.name}</Text>   
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
        width:'100px',
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
        width:'150px',
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
      width:'150px',
      fixed:'right',
      render: (paymentStatus)=>{
        const color = paymentStatus === 'successful'?'green':paymentStatus === 'failed'?'red':paymentStatus === 'cancelled'?'grey':'blue'
        const icon = paymentStatus === 'successful'?<CheckOutlined rev={undefined} />:paymentStatus === 'cancelled'?<StopOutlined rev={undefined} />:null
        return <Tag icon={icon} color={color} style={{textTransform:'capitalize'}}>{paymentStatus}</Tag>
      }
    },
    // {
    //   title: 'Booking Status',
    //   dataIndex: 'bookingStatus',
    //   key: 'bookingStatus',
    //   width:'150px',
    //   fixed:'right',
    //   render: (bookingStatus)=>{
    //     const color = bookingStatus === 'successful'?'green':bookingStatus === 'failed'?'red':bookingStatus === 'cancelled'?'grey':'blue'
    //     const icon = bookingStatus === 'successful'?<CheckOutlined rev={undefined} />:bookingStatus === 'cancelled'?<StopOutlined rev={undefined} />:null
    //     return <Tag icon={icon} color={color} style={{textTransform:'capitalize'}}>{bookingStatus}</Tag>
    //   }
    // },
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      fixed:'right',
      width: '110px',
      render: (createdAt)=>{
          const date = dayjs(createdAt).format('MMM DD, YYYY')
          return(
        <Text type='secondary'>{date}</Text>
        )
    }
  },
    
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
                      <Button shape="round" style={{marginRight:'.3rem'}} loading={false} onClick={()=>{}} icon={<DownloadOutlined rev={undefined} />}>Export</Button>
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
                {/* {
                  isDrawerOpen
                  ?<DetailDrawer isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedServiceItem={selectedServiceItem}/>
                  :null
                } */}
            </div>
    )

}


EventBookings.PageLayout = EventsLayout



interface DrawerProps{
  selectedRecord: Event,
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
  const payload ={
    item: {
        id: "d2e840f3-85a1-4eac-8f0e-00537f8666e0",  //need to valiadte exp using start date time + duration 
        type: "event",
        communityVenueId: ""
    },
    ticketSecret: "965432",
    "redeemMethod": "uniqueCode",
    "userId": "d2e840f3-85a1-4eac-8f0e-00537f8666e0"
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
        queryClient.invalidateQueries(['event-bookings'])
    }
})

const{isLoading:isRedeeming} = redeemEventTicket

const [form] = Form.useForm()


return( 
<Drawer 
  title="Redeem Ticket" 
  width={640} 
  placement="right" 
  closable={true} 
  onClose={closeDrawerHandler} 
  open={isDrawerOpen}
>
  <div
    style={{width:'100%', margin:'3rem 1rem',}}
  >
<Form form={form} onFinish={onFinish}>
  <Form.Item style={{marginBottom:'1rem'}} rules={[{required:true, message: 'This field is required'}, {type:"integer", message: 'Redeem code must be numbers'}]}>
    <Input name="ticketSecret" size="large" />
  </Form.Item>
  <Form.Item>
    <Button
      shape="round" 
      type="primary" 
      size="large" 
      loading={isRedeeming}  
      htmlType="submit"
    >
       Redeem Ticket
    </Button>
  </Form.Item>
  
</Form>
</div>



</Drawer>
)
}