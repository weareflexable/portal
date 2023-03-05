import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../../hooks/useOrgs";
const {Text} = Typography
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Badge} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';

import { useAuthContext } from '../../../context/AuthContext';
import { useServicesContext } from '../../../context/ServicesContext';
import {PlusOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { useOrgContext } from "../../../context/OrgContext";
import { asyncStore } from "../../../utils/nftStorage";
import { ServiceItem } from "../../../types/Services";
import { ManagerOrder } from "./Bookings.types";
import useUrlPrefix from "../../../hooks/useUrlPrefix";
const {TextArea} = Input
import {numberFormatter} from '../../../utils/numberFormatter'
import { IMAGE_PLACEHOLDER_HASH } from "../../../constants";


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
          return <Tag style={{textTransform:'capitalize'}}>{paymentStatus}</Tag>
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
                <div style={{marginBottom:'1.5em', display:'flex', width:'100%', justifyContent:'flex-end', alignItems:'center'}}>
               
                <div style={{display:'flex', marginTop:'2rem', justifyContent:'flex-end', alignItems:'center'}}>
                  <Button shape="round"  loading={bookingsQuery.isRefetching} onClick={()=>bookingsQuery.refetch()} icon={<ReloadOutlined />}>Refresh</Button>
                </div>

                </div>
                <Table 
                  style={{width:'100%'}} 
                  key='dfadfe' 
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
                  ?<DetailDrawer isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedServiceItem={selectedServiceItem}/>
                  :null
                }
            </div>
    )



}

interface DrawerProps{
  selectedServiceItem: ServiceItem,
  isDrawerOpen: boolean,
  closeDrawer: (value:boolean)=>void
}
function DetailDrawer({selectedServiceItem,isDrawerOpen,closeDrawer}:DrawerProps){

const queryClient = useQueryClient()

function closeDrawerHandler(){
  queryClient.invalidateQueries(['serviceItems'])
  closeDrawer(!isDrawerOpen)
}

return( 
<Drawer title="Organization Details" width={640} placement="right" closable={true} onClose={closeDrawerHandler} open={isDrawerOpen}>
  
  <EditableName selectedServiceItem={selectedServiceItem}/>
  <EditableDescription selectedServiceItem={selectedServiceItem}/>

  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Divider/>
    <Button danger type="link">De-activate service-item</Button>
    <Divider/>
  </div>

</Drawer>
)
}


interface EditableProp{
  selectedServiceItem: ServiceItem
}

function EditableName({selectedServiceItem}:EditableProp){

  const [state, setState] = useState(selectedServiceItem)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  const queryClient = useQueryClient()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }


  const nameMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/serviceItem`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const nameMutation = useMutation({
    mutationKey:['name'],
    mutationFn: nameMutationHandler,
    onSuccess:()=>{
      toggleEdit()
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      key:'name',
      value: updatedItem.name,
      serviceItemId: selectedServiceItem.id
    }
    const updatedOrg = {
      ...selectedServiceItem,
      name: updatedItem.name
    }
    setState(updatedOrg)
    nameMutation.mutate(payload)
  }

  const {isLoading:isEditing} = nameMutation;

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{state.name}</Text>
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableName"
     initialValues={selectedServiceItem}
     onFinish={onFinish}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
          <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input a valid service name' }]}
          >
              <Input  disabled={isEditing} placeholder="Flexable serviceItem" />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item style={{ width:'100%'}}>
              <Space >
                  <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                      Cancel
                  </Button>
                  <Button shape="round" loading={isEditing} type="link" size="small"  htmlType="submit" >
                      Apply changes
                  </Button>
              </Space>
                        
          </Form.Item>
        </Col>
      </Row>
           
    </Form>
  )
  return(
    <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
      <Text type="secondary" style={{ marginRight: '2rem',}}>Name</Text>
    {isEditMode?editable:readOnly}
    </div>
  )
}
function EditableDescription({selectedServiceItem}:EditableProp){

  const [state, setState] = useState(selectedServiceItem)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()


  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const [form]  = Form.useForm()

 


  const nameMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/serviceItem`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const nameMutation = useMutation({
    mutationKey:['description'],
    mutationFn: nameMutationHandler,
    onSuccess:()=>{
      toggleEdit()
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      key:'country',
      value: updatedItem.country,
      serviceItemId: selectedServiceItem.id
    }
    const updatedOrg = {
      ...selectedServiceItem,
      name: updatedItem.country
    }
    setState(updatedOrg)
    nameMutation.mutate(payload)
  }

  const {isLoading:isEditing} = nameMutation 

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{state.description}</Text>
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableAddress"
     initialValues={selectedServiceItem}
     onFinish={onFinish}
     form={form}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
        <Form.Item 
            name="description"
            rules={[{ required: true, message: 'Please input a description for service item!' }]}
        >
            <TextArea rows={3} placeholder='Best bars in syracuse'/>

        </Form.Item>

        </Col>
        <Col span={4}>
          <Form.Item style={{ width:'100%'}}>
              <Space >
                  <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                      Cancel
                  </Button>
                  <Button shape="round" loading={isEditing} type="link" size="small"  htmlType="submit" >
                      Apply changes
                  </Button>
              </Space>
                        
          </Form.Item>
        </Col>
      </Row>
           
    </Form>
  )
  return(
    <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
      <Text type="secondary" style={{ marginRight: '2rem',}}>Address</Text>
    {isEditMode?editable:readOnly}
    </div>
  )
}





const serviceItemsFilters = [
  {
      id: '1',
      name: 'Active'
  },
  {
      id: '2',
      name: 'In-active'
  },
]



// const managerBookings:ManagerOrder[] = [
//     {
//         id: '34343',
//         serviceName: 'Benjamins On Franklin',
//         quantity: 4,
//         unitPrice: 3499,
//         ticketStatus: '',
//         paymentIntentId: 'erefdfa',
//         paymentIntentStatus: 'PAID',
//         userId: 'ninja3@flexable.com',
//         orgServiceItemId: 'dfadeir32',
//         hash:'',
//         currency: 'USD',
//         startTime: 'Jan 23, 2022',
//         endTime: 'Dec 27, 2023',
//         uniqueCode: 'dfadf23',
//         userTicketId: 'dfadf9375',
//         name: 'Line Skip + cover',
//         orderStatus: ''    
//     },
//     {
//         id: '34343',
//         serviceName: 'Benjamins On Franklin',
//         quantity: 4,
//         unitPrice: 2000,
//         ticketStatus: '',
//         paymentIntentId: 'erefdfa',
//         paymentIntentStatus: 'PAID',
//         userId: 'dynamoboy@yahoo.com',
//         orgServiceItemId: 'dfadeir32',
//         hash:'', 
//         currency: 'USD',
//         startTime: 'Jan 23, 2022',
//         endTime: 'Dec 27, 2023',
//         uniqueCode: 'dfadf23',
//         userTicketId: 'dfadf9375',
//         name: 'Bottle service',
//         orderStatus: ''    
//     },
//     {
//         id: '34343',
//         serviceName: 'Benjamins On Franklin',
//         quantity: 4,
//         unitPrice: 3532,
//         ticketStatus: '',
//         paymentIntentId: 'erefdfa',
//         paymentIntentStatus: 'PAID',
//         userId: 'mujahid.bappai@yahoo.com',
//         orgServiceItemId: 'dfadeir32',
//         hash:'',
//         currency: 'USD',
//         startTime: 'Jan 23, 2022',
//         endTime: 'Dec 27, 2023',
//         uniqueCode: 'dfadf23',
//         userTicketId: 'dfadf9375',
//         name: 'Line Skip + cover',
//         orderStatus: ''    
//     }
// ]