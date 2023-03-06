import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../hooks/useOrgs";
const {Text,Title} = Typography
import React, { ReactNode, useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Alert, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Badge, Skeleton, InputNumber, notification, Modal} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined,MinusCircleOutlined,PlusOutlined} from '@ant-design/icons'

import { useAuthContext } from '../../context/AuthContext';
import { useServicesContext } from '../../context/ServicesContext';
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { Availability, AvailabilityPayload, CustomDate, ServiceItem } from "../../types/Services";
import { EditableCoverImage, EditableDescription, EditableName, EditablePrice, EditableTicketsPerDay } from "./EditServiceItemForm/EditServiceItemForm";
import AvailabilitySection from "./Availability/Availability";
import useUrlPrefix from "../../hooks/useUrlPrefix";
import useRole from "../../hooks/useRole";
import useServiceItemTypes from "../../hooks/useServiceItemTypes";
import { EditableText } from "../shared/Editables";
import { numberFormatter } from "../../utils/numberFormatter";


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


type ServiceMenu={
  label:string,
  key:string
}


export default function ServiceItemsView(){

    const {paseto} = useAuthContext()
    const {currentService} = useServicesContext()
    const urlPrefix  = useUrlPrefix()
    const queryClient = useQueryClient()
    const router = useRouter()
    const {switchOrg} = useOrgs()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
    // const isFilterEmpty = Object.keys(filteredInfo).length === 0;

    type DataIndex = keyof ServiceItem;

    const [selectedRecord, setSelectedServiceItem] = useState<any|ServiceItem>({})
    const [currentFilter, setCurrentFilter] = useState({id:'1',name: 'Active'})
    const [pageNumber, setPageNumber] = useState<number|undefined>(0)
    const {isManager} = useRole()

    const serviceItemTypes = useServiceItemTypes()

    const items = serviceItemTypes && serviceItemTypes.map((item:any)=>({label:item.label, key:item.value}))

    async function fetchAllServiceItems(){
    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items?key=org_service_id&value=${currentService.id}&pageNumber=${pageNumber}&pageSize=10`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
   
    }
    async function fetchServiceItems(){
    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items?key=org_service_id&value=${currentService.id}&pageNumber=${pageNumber}&pageSize=10&key2=status&value2=${currentFilter.id}`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
   
    }

   
    async function changeServiceItemStatus({serviceItemId, statusNumber}:{serviceItemId:string, statusNumber: string}){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items`,
            data:{
                key:'status',
                value: statusNumber, // 0 means de-activated in db
                serviceItemId: serviceItemId 
            },
            headers:{
                "Authorization": paseto
            }
        })
        return res; 
    }

    
    const changeStatusMutation = useMutation(['data'],{
        mutationFn: changeServiceItemStatus,
        onSuccess:(data:any)=>{
            queryClient.invalidateQueries({queryKey:['serviceItems']})
        },
        onError:()=>{
            console.log('Error changing status')
        }
    })



    const onLaunchButtonClick: MenuProps['onClick'] = (e) => {
      const key = e.key
      const targetMenu:any = items.find((item:ServiceMenu)=>item.key === key)
      router.push(`/organizations/services/serviceItems/new?key=${targetMenu!.key}&label=${targetMenu!.label}`)
    };


    const serviceItemsQuery = useQuery({queryKey:['serviceItems', {currentSerive:currentService.id, filter:currentFilter.id,pageNumber:pageNumber}], queryFn:fetchServiceItems, enabled:paseto !== ''})
    const res = serviceItemsQuery.data && serviceItemsQuery.data;
    const servicesData = res && res.data
    const totalLength = res && res.dataLength;

    const allServiceItemsQuery = useQuery({queryKey:['all-serviceItems',{currentService: currentService.id}], queryFn:fetchAllServiceItems, enabled:paseto !== '', staleTime:Infinity})
    const allServiceItemsLength = allServiceItemsQuery.data && allServiceItemsQuery.data.dataLength;
 


  
    const handleChange: TableProps<ServiceItem>['onChange'] = (data) => {
      console.log(data.current)
      //@ts-ignore
      setPageNumber(data.current-1); // Subtracting 1 because pageSize param in url starts counting from 0
    };
  
 
    function viewDetails(serviceItem:ServiceItem){
      // set state
      setSelectedServiceItem(serviceItem)
      // opne drawer
      setIsDrawerOpen(true)

    }
  
    async function reActivateServiceHandler(record:ServiceItem){
      const res = await axios({
          method:'patch',
          url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items`,
          data:{
              key:'status',
              value: '1', 
              id: record.id  
          },
          headers:{
              "Authorization": paseto
          }
      })
      return res; 
  }


  const reactivateService = useMutation(reActivateServiceHandler,{
    onSettled:()=>{
      queryClient.invalidateQueries({queryKey:['serviceItems']})
    }
  })

    
    
    function getTableActions(){
      return {
          dataIndex: 'actions', 
          key: 'actions',
          //@ts-ignore
          render:(_,record:Service)=>{
            if(currentFilter.name === 'In-active'){
              return (<Button   onClick={()=>reactivateService.mutate(record)}>Reactivate</Button>)
            }else{
              return <Button type="text" onClick={()=>viewDetails(record)} icon={<MoreOutlined/>}/> 
            }
          }
        }
  
  }
  
    const columns: ColumnsType<ServiceItem> = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render:(_,record)=>{
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${record.logoImageHash}`}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text style={{textTransform:'capitalize'}}>{record.name}</Text>  
                    </div>
                </div>
            )
        },
      },
      {
        title: 'Type',
        dataIndex: 'serviceItemType',
        key: 'serviceItemType',
        render:(_,record)=>{
          const type = record.serviceItemType[0]
          return <Tag style={{textTransform:'capitalize'}}>{type.name}</Tag>
        }
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        align:'right',
        render: (price)=>(
          <div>
            <Text>$</Text>
            <Text>{price/100}</Text>
          </div>
        )
      },
      {
        title: 'Tickets Per Day',
        dataIndex: 'ticketsPerDay',
        key: 'ticketsPerDay',
        align: 'right',
        render:(ticketsPerDay)=>{
          const formatted = numberFormatter.from(ticketsPerDay)
          return <Text>{`${formatted}`}</Text>
        }
      },
     
      
      {
        title: 'Custom Dates',
        // dataIndex: 'status',
        key: 'customDates',
        render: (_,record)=>{
          const customDatesLength = record.availability.length
          return <Text>{`${customDatesLength}`}</Text>
        }
      },
      {
          title: 'Created On',
          dataIndex: 'createdAt',
          key: 'createdAt',
          render: (_,record)=>{
              const date = dayjs(record.createdAt).format('MMM DD, YYYY')
              return(
            <Text type="secondary">{date}</Text>
            )
        },
    },
      
    {
      ...getTableActions()
    }
    ];

        return (
            <div>
               { servicesData && allServiceItemsLength === 0  
               ? null 
               : <div style={{marginBottom:'1.5em', display:'flex', width:'100%', flexDirection:'column'}}>
                 <div style={{width:'100%',  marginBottom:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <Title style={{margin: '0'}} level={2}>Services</Title>
                      <div style={{display:'flex'}}>
                        <Button shape='round' style={{marginRight:'1rem'}} loading={serviceItemsQuery.isRefetching} onClick={()=>serviceItemsQuery.refetch()} icon={<ReloadOutlined />}>Refresh</Button>
                        <Dropdown.Button  trigger={['click']} type="primary"   icon={<PlusOutlined/>} menu={{ items, onClick: (item)=>onLaunchButtonClick(item) }}>Launch New ...</Dropdown.Button>
                      </div>
                    </div>
                  <Radio.Group defaultValue={currentFilter.id} buttonStyle="solid">
                        {serviceItemsFilters.map(filter=>(
                            <Radio.Button key={filter.id} onClick={()=>setCurrentFilter(filter)} value={filter.id}>{filter.name}</Radio.Button>
                        )
                        )}
                  </Radio.Group>

                <div style={{width: "20%",display:'flex', justifyContent:'space-between', alignItems:'center'}}>

                  {/* <Dropdown.Button trigger={['click']} type="primary"   icon={<PlusOutlined/>} menu={{ items, onClick: (item)=>onLaunchButtonClick(item) }}>Launch New ...</Dropdown.Button> */}
                </div>

                </div>}
                {
                  servicesData && allServiceItemsLength === 0
                  ?<EmptyState>
                    <Dropdown.Button trigger={['click']} type="primary"   icon={<PlusOutlined/>} menu={{ items, onClick: (item)=>onLaunchButtonClick(item) }}>Launch New ...</Dropdown.Button>
                  </EmptyState>
                  :<Table 
                  style={{width:'100%'}} 
                  key='dfadfe' 
                  pagination={{
                    total:totalLength,  
                    showTotal:(total) => `Total ${total} items`,
                  }} 
                  loading={serviceItemsQuery.isLoading || serviceItemsQuery.isRefetching} 
                  columns={columns} 
                  onChange={handleChange} 
                  dataSource={servicesData} 
                />
                }
                
                {
                  isDrawerOpen
                  ?<DetailDrawer isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedRecord={selectedRecord}/>
                  :null
                }
               
            </div>
    )



}

interface DrawerProps{
  selectedRecord: ServiceItem,
  isDrawerOpen: boolean,
  closeDrawer: (value:boolean)=>void
}
function DetailDrawer({selectedRecord,isDrawerOpen,closeDrawer}:DrawerProps){

const queryClient = useQueryClient()

const {paseto} = useAuthContext()

const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

 const [isEditAvailability, setIsEditAvailability] = useState(false)

 const urlPrefix = useUrlPrefix()

async function fetchItemAvailability(){
 const res = await axios.get(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items/availability?key=service_item_id&value=${selectedRecord.id}&pageNumber=0&pageSize=10`,{
  headers:{
    "Authorization":paseto
  }
})
return res.data.data
}

const {data, isLoading} = useQuery({queryKey:['availability',selectedRecord.id], queryFn:fetchItemAvailability})

const availabilityData = data && data

console.log(availabilityData)


function closeDrawerHandler(){
  queryClient.invalidateQueries(['serviceItems'])
  closeDrawer(!isDrawerOpen)
}

function toggleDeleteModal(){
  setIsDeleteModalOpen(!isDeleteModalOpen)
}

function deleteServiceItem(){ 
  console.log(selectedRecord.id)
  // mutate record
  deleteData.mutate(selectedRecord,{
    onSuccess:()=>{
      toggleDeleteModal()
      closeDrawerHandler()
    }
  })
}

const deleteDataHandler = async(record:ServiceItem)=>{      
  const {data} = await axios({
    method:'patch',
    url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items`,
    data: {
        id:record.id,
        key:'status',
        value: '0'
      },
    headers:{
          "Authorization": paseto
  }})
  return data
}

const deleteData = useMutation(deleteDataHandler,{
 onSuccess:(data)=>{
  notification['success']({
      message: 'Successfully deleted record!'
  })
    // remove from list  
 },
  onError:(err)=>{
      console.log(err)
      notification['error']({
          message: 'Encountered an error while deleting record custom custom dates',
        });
      // leave modal open
  } 
})

const{isLoading:isDeletingItem} = deleteData

return( 
<Drawer title="Service Details" width={640} placement="right" closable={true} onClose={closeDrawerHandler} open={isDrawerOpen}>
  
<EditableText
    fieldKey="name" // The way the field is named in DB
    currentFieldValue={selectedRecord.name}
    fieldName = 'name'
    title = 'Name'
    id = {selectedRecord.id}
    options = {{queryKey:'serviceItems',mutationUrl:'service-items'}}
  />
  <EditableDescription selectedRecord={selectedRecord}/>
  <EditablePrice selectedRecord={selectedRecord}/>

  <EditableText
    fieldKey="tickets_per_day" // The way the field is named in DB
    currentFieldValue={selectedRecord.ticketsPerDay}
    fieldName = 'ticketsPerDay'
    title = 'Tickets Per Day'
    id = {selectedRecord.id}
    options = {{queryKey:'serviceItems',mutationUrl:'service-items'}}
  />
  <EditableCoverImage selectedRecord={selectedRecord}/>

  {/* <Text>CUSTOM AVALABILITY</Text> */}
  <Title style={{marginTop:'3rem'}} level={3}>Custom Dates</Title>

  <AvailabilitySection selectedServiceItem={selectedRecord} />
  {/* <AvailabilitySection selectedServiceItem={selectedRecord}/> */}
  
  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Title level={3}>Danger zone</Title>
    <Button danger onClick={toggleDeleteModal} style={{width:'30%'}} type="link">Deactivate Service </Button>
  </div>

  <DeleteRecordModal isDeletingItem={isDeletingItem} onCloseModal={toggleDeleteModal} onDeleteRecord={deleteServiceItem} isOpen={isDeleteModalOpen} selectedRecord={selectedRecord}/>

  
</Drawer>

)
}



const serviceItemsFilters = [
  {
      id: '1',
      name: 'Active'
  },
  {
      id: '0',
      name: 'In-active'
  },
]


interface EditProps{
  availabilities: Availability,
  onToggleEditMode: ()=>void,
  selectedRecord: ServiceItem 
}



interface DeleteProp{
  selectedRecord: ServiceItem
  isOpen: boolean
  onCloseModal: ()=>void
  onDeleteRecord: ()=>void
  isDeletingItem: boolean
}

function DeleteRecordModal({selectedRecord, isOpen, isDeletingItem, onDeleteRecord, onCloseModal}:DeleteProp){

  function onFinish(){
    // call mutate function to delete record
    onDeleteRecord()
  }

  const [form] = Form.useForm()

  return(
    <Modal title="Are you absolutely sure?" footer={null} open={isOpen} onOk={()=>{}} onCancel={onCloseModal}>
      {/* <Alert style={{marginBottom:'.5rem'}} showIcon message="Bad things will happen if you don't read this!" type="warning" /> */}
      <Text >
        {`This action will remove the listing of from marketplace and will delete any custom dates, quantities and prices attached to it 
        `}
      </Text>

      <Form 
      form={form} 
      style={{marginTop:'1rem'}}
      name="deleteServiceItemForm" 
      layout='vertical'
      onFinish={onFinish}>
      <Form.Item
        name="name"
        style={{marginBottom:'.6rem'}}
        label={`Please type "${selectedRecord.name}" to confirm`}
        rules={[{ required: true, message: 'Please type correct service name' }]}
      >
        <Input size='large' disabled={isDeletingItem} />
      </Form.Item>

      <Form.Item
        style={{marginBottom:'0'}}
        shouldUpdate
       >
          {() => (
          <Button
            style={{width:'100%'}}
            size='large'
            danger
            loading={isDeletingItem}
            htmlType="submit"
            disabled={
              // !form.isFieldTouched('name') &&
              form.getFieldValue('name') !== selectedRecord.name
              // !!form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
           I understand the consequences, remove from marketplace
          </Button>
        )}
      </Form.Item>

    </Form>

  </Modal>
  )
}



// const mockAvailabilty: Availability = [
//   {
//     date: 'Jan 22, 2022',
//     ticketsPerDay: '455',
//     price: '23'
//   },
//   {
//     date: 'Feb 21, 2023',
//     ticketsPerDay: '455',
//     price: '637'
//   },
//   {
//     date: 'Mar 15, 2023',
//     ticketsPerDay: '1445',
//     price: '123'
//   },
// ]

interface Empty{
  children: ReactNode
} 

function EmptyState({children}:Empty){
  const router = useRouter()
  return(
    <div style={{border: '1px solid #d6d6d6', marginTop:'2rem', borderRadius:'4px', height:'50vh', display:'flex', justifyContent:'center', alignItems:'center', padding: '2rem'}}>
      <div style={{maxWidth:'300px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <Title level={3}>Get Started</Title> 
        <Text style={{textAlign:'center'}}>Ready to get started listing your services on the Flexable Marketplace?</Text>

          <div style={{marginTop:'1rem', display:'flex',justifyContent:'center'}}>
            {children}
          </div>
      </div>
    </div>
  )
}