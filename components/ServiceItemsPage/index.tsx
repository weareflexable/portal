import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../hooks/useOrgs";
const {Text,Title} = Typography
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Alert, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Badge, Skeleton, InputNumber, notification, Modal} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined,MinusCircleOutlined,PlusOutlined} from '@ant-design/icons'

import { useAuthContext } from '../../context/AuthContext';
import { useServicesContext } from '../../context/ServicesContext';
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { Availability, AvailabilityPayload, CustomDate, ServiceItem } from "../../types/Services";
import { EditableCoverImage, EditableDescription, EditableName, EditablePrice, EditableTicketsPerDay } from "./EditServiceItemForm/EditServiceForm";
import AvailabilitySection from "./Availability/Availability";
import useUrlPrefix from "../../hooks/useUrlPrefix";
import useRole from "../../hooks/useRole";


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


    function inActiveItemsHandler(serviceItem:ServiceItem){
        changeStatusMutation.mutate({serviceItemId:serviceItem.id, statusNumber:'0'})
    }

    function activeItemsHandler(serviceItem:ServiceItem){
        changeStatusMutation.mutate({serviceItemId:serviceItem.id, statusNumber:'2'})
    }


    const serviceItemsQuery = useQuery({queryKey:['serviceItems', {currentFilter,pageNumber:pageNumber}], queryFn:fetchServiceItems, enabled:paseto !== ''})
    const res = serviceItemsQuery.data && serviceItemsQuery.data;
    const servicesData = res && res.data
    const totalLength = res && res.dataLength;


  
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
                        <Text>{record.name}</Text>  
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
          return <Text>{type.name}</Text>
        }
      },
      {
        title: 'Tickets Per Day',
        dataIndex: 'ticketsPerDay',
        key: 'ticketsPerDay',
        align: 'right'
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        align:'right',
        render: (price)=>(
          <div>
            <Text type="secondary">$</Text>
            <Text>{price/100}</Text>
          </div>
        )
      },
      
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status)=>{
          const statusText = status ? 'Active': 'InActive'
          return <Badge status="processing" text={statusText} />
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
      
    {
      dataIndex: 'actions', 
      key: 'actions',
      render:(_,record)=>{
        // const items = getTableRecordActions()
        return (
          <Button type="text" onClick={()=>viewDetails(record)} icon={<MoreOutlined/>}/>
        )
      }
    }
    ];

        return (
            <div>
                <div style={{marginBottom:'2em', marginTop:'.5rem', display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
               { isManager? <Radio.Group defaultValue={currentFilter.id} buttonStyle="solid">
                    {serviceItemsFilters.map(filter=>(
                        <Radio.Button key={filter.id} onClick={()=>setCurrentFilter(filter)} value={filter.id}>{filter.name}</Radio.Button>
                     )
                    )}
                </Radio.Group>:null}

                <div style={{width: "20%",display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <Button type='link' loading={serviceItemsQuery.isRefetching} onClick={()=>serviceItemsQuery.refetch()} icon={<ReloadOutlined />}>Refresh</Button>
                  <Button shape='round' type='primary' icon={<PlusOutlined/>} onClick={()=>router.push('/organizations/services/serviceItems/new')}>New service-item</Button>
                </div>

                </div>
                <Table 
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
<Drawer title="Service-item Details" width={640} placement="right" closable={true} onClose={closeDrawerHandler} open={isDrawerOpen}>
  
  <EditableName selectedRecord={selectedRecord}/>
  <EditableDescription selectedRecord={selectedRecord}/>
  <EditablePrice selectedRecord={selectedRecord}/>
  <EditableTicketsPerDay selectedRecord={selectedRecord}/>
  <EditableCoverImage selectedRecord={selectedRecord}/>

  {/* <Text>CUSTOM AVALABILITY</Text> */}
  <Title style={{marginTop:'3rem'}} level={3}>Custom Availability</Title>
  <AvailabilitySection selectedServiceItem={selectedRecord} />
  {/* <AvailabilitySection selectedServiceItem={selectedRecord}/> */}
  
  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Title level={3}>Danger zone</Title>
    <Button danger onClick={toggleDeleteModal} style={{width:'30%'}} type="link">De-activate service-item</Button>
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
      <Alert style={{marginBottom:'.5rem'}} showIcon message="Bad things will happen if you don't read this!" type="warning" />
      <Text >
        {`This action cannot be undone. This will permanently delete the ${selectedRecord.name} service item, custom dates, prices, descriptions, coverImages, ticketsPerDay and remove from listing on marketplace 
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
        rules={[{ required: true, message: 'Please type correct service item name!' }]}
      >
        <Input disabled={isDeletingItem} />
      </Form.Item>

      <Form.Item
        style={{marginBottom:'0'}}
        shouldUpdate
       >
          {() => (
          <Button
            style={{width:'100%'}}
            danger
            loading={isDeletingItem}
            htmlType="submit"
            disabled={
              // !form.isFieldTouched('name') &&
              form.getFieldValue('name') !== selectedRecord.name
              // !!form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
           I understand the consequences, delete permanently
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