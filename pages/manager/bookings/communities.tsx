import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TableProps, Tag, Button, Table, Image, Typography, Alert, Drawer, Form, Input, notification } from "antd";
import { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useState } from "react";
import ManagerBookingsLayout from "../../../components/Layout/ManagerBookingsLayout"
import { IMAGE_PLACEHOLDER_HASH } from "../../../constants";
import { useAuthContext } from "../../../context/AuthContext";
import useUrlPrefix from "../../../hooks/useUrlPrefix";
import { CommunityOrder, EventOrder } from "../../../types/Booking";
import { ServiceItem } from "../../../types/Services";
import { numberFormatter } from "../../../utils/numberFormatter";

import {ReloadOutlined, CheckOutlined,StopOutlined, MoreOutlined} from '@ant-design/icons'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advanced from "dayjs/plugin/advancedFormat"
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advanced)


const {Text} = Typography

export default function CommunityBookings(){

    const {paseto} = useAuthContext()
    const [pageNumber, setPageNumber] = useState<number|undefined>(1)
    const [pageSize, setPageSize] = useState<number|undefined>(10)

    const [selectedRecord, setSelectedRecord] = useState<any|EventOrder>({})
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  

    type DataIndex = keyof ServiceItem;


    const urlPrefix = useUrlPrefix()
    
    async function fetchBookings(){
    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/bookings/communities?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
   
    }


    const bookingsQuery = useQuery({queryKey:['managerBookings',pageNumber,pageSize], queryFn:fetchBookings, enabled:paseto !== ''})
    const data = bookingsQuery.data && bookingsQuery.data.data
    const totalLength = bookingsQuery.data && bookingsQuery.data.dataLength;


    

  
  
    const handleChange: TableProps<CommunityOrder>['onChange'] = (data) => {
      // console.log('Various parameters', pagination, filters, sorter); 
      console.log(data)
      // @ts-ignore
      setPageNumber(data.current) 
      setPageSize(data.pageSize)
      // set new page
      // set page number
      // setFilteredInfo(filters);
    };

    // function viewBookingDetails(event:CommunityOrder){
    //   // set state
    //   setSelectedRecord(event)
    //   // opne drawer
    //   setIsDrawerOpen(true)

    // }
  

    // const onMenuClick=( record:CommunityOrder) => {
    //   viewBookingDetails(record)
    //   console.log('click', record);
    // };

  
  

    const columns: ColumnsType<CommunityOrder> = [
      {
        title: 'Community',
        dataIndex: 'name',
        key: 'name',
        ellipsis:true,
        width:'250px',
        fixed:'left',
        render:(_,record)=>{

          const logoImageHash = record.communityDetails.artworkHash
          
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    <Image  style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${logoImageHash}`}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text>{record.communityDetails.name}</Text>  
                        {/* <Text type="secondary">{serviceName}</Text>   */}
                    </div>
                </div>
            )
        },
      },
      
      {
        title: 'Customer',
        // dataIndex: 'customer',
        ellipsis:true,
        width:'250px',
        key: 'customer',
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
      title: 'Booking Date',
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
  // {
  //   dataIndex: 'actions', 
  //   key: 'actions',
  //   fixed: 'right',
  //   width:'70px',
  //   //@ts-ignore
  //   render:(_,record:CommunityOrder)=>{
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
                  ?<DetailDrawer 
                  isDrawerOpen={isDrawerOpen} 
                  closeDrawer={setIsDrawerOpen} 
                  selectedRecord={selectedRecord}/>
                  :null
                } */}
            </div>
    )

}


CommunityBookings.PageLayout = ManagerBookingsLayout


// interface DrawerProps{
//   selectedRecord: EventOrder,
//   isDrawerOpen: boolean, 
//   closeDrawer: (value:boolean)=>void
// }

// function DetailDrawer({selectedRecord,isDrawerOpen,closeDrawer}:DrawerProps){

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
//     :selectedRecord.paymentIntentStatus!== 'successful'
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
//     function RedeemTicketForm({ticket}:IRedeemTicketForm){
    
//       const {paseto} = useAuthContext()
  
    
//       const urlPrefix =  useUrlPrefix()
    
    
//       const nftMutation = useMutation({
//         mutationFn: async(payload:any)=>{
//           const res = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/nft/community`,payload,{
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

    
    
//       return(
//           <div style={{marginBottom:'4rem'}}>
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
    
    