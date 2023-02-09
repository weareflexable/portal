import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../hooks/useOrgs";
const {Text} = Typography
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Badge} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';

import { useAuthContext } from '../../context/AuthContext';
import { useServicesContext } from '../../context/ServicesContext';
import {PlusOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { useOrgContext } from "../../context/OrgContext";

import { ServiceItem } from "../../types/Services";
import { Order } from "./Bookings.types";
const {TextArea} = Input


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
    const [pageNumber, setPageNumber] = useState<number|undefined>(0)

  

    const [selectedServiceItem, setSelectedServiceItem] = useState<any|ServiceItem>({})

    async function fetchBookings(){
    const res = await axios({
            method:'get',
            //@ts-ignore
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/bookings?key=service_id&value=${currentService.id}&pageNumber=${pageNumber}&pageSize=10`,
            headers:{
                "Authorization": paseto
            } 
        })

        return res.data;
   
    }

  


    const bookingsQuery = useQuery({queryKey:['managerBookings'], queryFn:fetchBookings, enabled:paseto !== ''})
    const data = bookingsQuery.data && bookingsQuery.data.data
    const totalLength = bookingsQuery.data && bookingsQuery.data.dataLength;


    

  
  
    const handleChange: TableProps<Order>['onChange'] = (pagination, filters, sorter) => {
      console.log(data.current)
      //@ts-ignore
      setPageNumber(data.current-1);
    };
  

  
  
  
    const columns: ColumnsType<Order> = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render:(_,record)=>{
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={'/favicon.ico'}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text>{record.name}</Text>  
                        <Text type="secondary">{record.serviceName}</Text>  
                    </div>
                </div>
            )
        },
      },
      {
        title: 'Unit price',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        render: (unitPrice)=>(
          <div>
            <Text type="secondary">$</Text>
            <Text> {unitPrice/100}</Text>
          </div>
        )
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        render:(quantity)=>(
          <div>
            <Text type="secondary">x</Text>
            <Text> {quantity}</Text>
          </div>
        )
      },
      {
        title: 'Total price',
        // dataIndex: 'totalPrice',
        key: 'totalPrice',
        render: (_,record)=>{
          const total = record.quantity * (record.unitPrice/100)
          return(
            <div>
            <Text type="secondary">$</Text>
            <Text>{total}</Text>
          </div>
          )
        }
      },
      {
        title: 'Type',
        dataIndex: 'serviceItemType',
        key: 'serviceItemType',
      },
      
      {
        title: 'Order Status',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        render: (status)=>{
          const statusText = status === '1'? 'Complete': 'In-complete'
          return <Badge status="success" text={statusText} />
        }
      },
      {
        title: 'Ticket Status',
        dataIndex: 'ticketStatus',
        key: 'ticketStatus',
        render: (status)=>{
          const statusText = status === '1'? 'Redeemed': 'Confirmed'
          return <Badge status="success" text={statusText} />
        }
      },
      {
          title: 'CreatedAt',
          dataIndex: 'createdAt',
          key: 'createdAt',
          render: (_,record)=>{
              const date = dayjs(record.createdAt).format('MMM DD, YYYY')
              return(
            <Text>{date}</Text>
            )
        },
    },

    // { 
    //   dataIndex: 'actions', 
    //   key: 'actions',
    //   render:(_,record)=>{
    //     const items = getTableRecordActions()
    //     return (<Dropdown.Button menu={{ items , onClick: (e)=>onMenuClick(e,record) }}>Actions</Dropdown.Button>)
    //   }
    // }
    ];

        return (
            <div>
                <div style={{marginBottom:'1.5em', display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                {/* <Radio.Group defaultValue={currentFilter.id} buttonStyle="solid">
                    {serviceItemsFilters.map(filter=>(
                        <Radio.Button key={filter.id} onClick={()=>setCurrentFilter(filter)} value={filter.id}>{filter.name}</Radio.Button>
                     )
                    )}
                </Radio.Group> */}
                <div style={{width: "20%",display:'flex', marginTop:'2rem', justifyContent:'space-between', alignItems:'center'}}>
                  <Button type='link' loading={bookingsQuery.isRefetching} onClick={()=>bookingsQuery.refetch()} icon={<ReloadOutlined />}>Refresh</Button>
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
                dataSource={data} />
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

const inActiveItemActions = [
    {
        key: 'accept',
        label: 'Accept'
    },
    {
        key: 'reject',
        label: 'Reject'
    },
    {
        key: 'viewDetails',
        label: 'View details'
    },

]
const activeItemActions = [
    {
        key: 'review',
        label: 'Review'
    },
    {
        key: 'viewDetails',
        label: 'View details'
    },

]


// const managerBookings:Order[] = [
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





// const lastUpdate = moment(dataUpdatedAt).format('HH:mm:ss')