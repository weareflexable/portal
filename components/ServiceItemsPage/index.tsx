import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../hooks/useOrgs";
const {Text,Title} = Typography
import React, { ReactNode, useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Alert, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Badge, Skeleton, InputNumber, notification, Modal, Popover} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined,MinusCircleOutlined,CopyOutlined,PlusOutlined} from '@ant-design/icons'

import { useAuthContext } from '../../context/AuthContext';
import { useServicesContext } from '../../context/ServicesContext';
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { Availability, AvailabilityPayload, CustomDate, ServiceItem } from "../../types/Services";
import { EditableCharge, EditableCoverImage, EditableDescription, EditableName,  EditablePrice, EditableTicketsPerDay } from "./EditServiceItemForm/EditServiceItemForm";
import AvailabilitySection from "./Availability/Availability";
import useUrlPrefix from "../../hooks/useUrlPrefix";
import useRole from "../../hooks/useRole";
import useServiceItemTypes from "../../hooks/useServiceItemTypes";
import { EditableText } from "../shared/Editables";
import { numberFormatter } from "../../utils/numberFormatter";
import { IMAGE_PLACEHOLDER_HASH } from "../../constants";
import { useOrgContext } from "../../context/OrgContext";
import utils from "../../utils/env";


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
    const {currentOrg} = useOrgContext()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
    // const isFilterEmpty = Object.keys(filteredInfo).length === 0
    
    const isBankConnected = currentOrg?.isBankConnected

    type DataIndex = keyof ServiceItem;

    const [selectedRecord, setSelectedServiceItem] = useState<any|ServiceItem>({})
    const [currentFilter, setCurrentFilter] = useState({id:'1',name: 'Active'})
    const [pageNumber, setPageNumber] = useState<number|undefined>(1)
    const [pageSize, setPageSize] = useState<number|undefined>(10)
  

    const serviceItemTypes = useServiceItemTypes()

    const items = serviceItemTypes && serviceItemTypes.map((item:any)=>({label:item.label, key:item.value}))

    // async function fetchAllServiceItems(){
    // const res = await axios({
    //         method:'get',
    //         url:`${utils.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items?serviceId=${currentService.id}&pageNumber=${pageNumber}&pageSize=10`,
    //         headers:{
    //             "Authorization": paseto
    //         }
    //     })

    //     return res.data;
   
    // }

    async function fetchServiceItems(){
    const res = await axios({
            method:'get',
            url:`${utils.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items?serviceId=${currentService.id}&pageNumber=${pageNumber}&pageSize=${pageSize}&status=${currentFilter.id}`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
   
    }

   
    async function changeServiceItemStatus({serviceItemId, statusNumber}:{serviceItemId:string, statusNumber: string}){
        const res = await axios({
            method:'patch',
            url:`${utils.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items`,
            data:{
                // key:'status',
                status: statusNumber, // 0 means de-activated in db
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
      router.push(`/organizations/venues/exclusive-access/new?key=${targetMenu!.key}&label=${targetMenu!.label}`)
    };

    const serviceItemsQuery = useQuery({queryKey:['serviceItems', {currentSerive:currentService.id, filter:currentFilter.id,pageNumber:pageNumber}], queryFn:fetchServiceItems, enabled:paseto !== ''})
    const res = serviceItemsQuery?.data

    const servicesData = res?.data
    const totalLength = res?.dataLength;
 
    // const allServiceItemsQuery = useQuery({queryKey:['all-serviceItems',{currentService: currentService.id}], queryFn:fetchAllServiceItems, enabled:paseto !== '', staleTime:Infinity})
    // const allServiceItemsLength = allServiceItemsQuery.data && allServiceItemsQuery.data.dataLength;
 


  
    const handleChange: TableProps<ServiceItem>['onChange'] = (data) => {
      setPageSize(data.pageSize)
      //@ts-ignore
      setPageNumber(data.current); // Subtracting 1 because pageSize param in url starts counting from 0
    };
  
 
    function viewDetails(serviceItem:ServiceItem){
      // set state
      setSelectedServiceItem(serviceItem)
      // opne drawer
      setIsDrawerOpen(true)

    }

  const reactivateService = useMutation(reActivateServiceHandler,{
    onSettled:()=>{
      queryClient.invalidateQueries({queryKey:['serviceItems']})
    }
  })

  async function reActivateServiceHandler(record:ServiceItem){
      const res = await axios({
          method:'patch',
          url:`${utils.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items`,
          data:{
              // key:'status',
              status: '1', 
              id: record.id  
          },
          headers:{
              "Authorization": paseto
          }
      })
      return res; 
  }
    
    
  
    const columns: ColumnsType<ServiceItem> = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width:'270px',
        ellipsis:true,
        fixed:'left',
        render:(_,record)=>{
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`${utils.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${record.logoImageHash.length < 20? IMAGE_PLACEHOLDER_HASH :record.logoImageHash}`}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text style={{textTransform:'capitalize'}}>{record?.name}</Text>  
                    </div>
                </div>
            )
        },
      },

      {
        title: 'Type',
        dataIndex: 'serviceItemType',
        key: 'serviceItemType',
        width:'120px', 
        render:(_,record)=>{
          const type = record.serviceItemType
          return <Tag style={{textTransform:'capitalize'}}>{type?.name}</Tag>
        }
      },

      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        align:'right',
        width:'120px',
        render: (price)=>(
          <div>
            <Text>$</Text>
            <Text>{price/100}</Text>
          </div>
        )
      },

      {
        title: 'Charge',
        dataIndex: 'platformFee',
        // hidden:true, 
        key: 'platformFee',
        width:'100px',
        align:'right',
        render: (platformFee)=>(
          <div>
             {<Text>{platformFee}%</Text>}
          </div>
        )
      },
      {
        title: 'Tickets Per Day',
        dataIndex: 'ticketsPerDay',
        key: 'ticketsPerDay',
        align: 'right',
        width:'150px',
        render:(ticketsPerDay)=>{
          const formatted = numberFormatter.from(ticketsPerDay)
          return <Text>{`${formatted}`}</Text>
        }
      },
     
      
      {
        title: 'Custom Dates',
        // dataIndex: 'status',
        key: 'customDates',
        align:'right',
        width:'150px',
        render: (_,record)=>{
          const customDatesLength = record?.availability?.length
          return <Text>{`${customDatesLength}`}</Text>
        }
      },
      {
          title: 'Created On',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width:'120px',
          render: (_,record)=>{
              const date = dayjs(record?.createdAt).format('MMM DD, YYYY')
              return(
            <Text type="secondary">{date}</Text>
            )
        },
    },
      
    {
      dataIndex: 'actions', 
      key: 'actions',
      fixed:'right',
      width:currentFilter.name === 'Inactive' || 'Drafts'?'150px':'70px',
      //@ts-ignore
      render:(_,record:Service)=>{
        if(currentFilter.name === 'Inactive'){
          return (<Button   onClick={()=>reactivateService.mutate(record)}>Reactivate</Button>)
        }else{
          return <Button type="text" onClick={()=>viewDetails(record)} icon={<MoreOutlined rev={undefined}/>}/> 
        }
      }
    }
    ];

        return (
            <div>
               <div style={{width:'100%',  marginBottom:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                     
                 <Radio.Group defaultValue={currentFilter.id} buttonStyle="solid">
                        {serviceItemsFilters.map(filter=>(
                            <Radio.Button key={filter.id} onClick={()=>setCurrentFilter(filter)} value={filter.id}>{filter.name}</Radio.Button>
                        )
                        )}
                  </Radio.Group>
                  
                      <div style={{display:'flex'}}>
                        <Button shape='round' style={{marginRight:'1rem'}} loading={serviceItemsQuery.isRefetching} onClick={()=>serviceItemsQuery.refetch()} icon={<ReloadOutlined rev={undefined} />}>Refresh</Button>
                        <Dropdown.Button  trigger={['click']} type="primary"   icon={<PlusOutlined rev={undefined}/>} menu={{ items, onClick: (item)=>onLaunchButtonClick(item) }}>Launch New ...</Dropdown.Button>
                      </div>
                    </div>
               { !servicesData 
               ? null 
               : 
               <div style={{marginBottom:'1.5em', display:'flex', width:'100%', flexDirection:'column'}}>
                
                 

                <div style={{width: "20%",display:'flex', justifyContent:'space-between', alignItems:'center'}}>

                  {/* <Dropdown.Button trigger={['click']} type="primary"   icon={<PlusOutlined/>} menu={{ items, onClick: (item)=>onLaunchButtonClick(item) }}>Launch New ...</Dropdown.Button> */}
                </div>

                </div>
                } 

                {/* {
                  servicesData && allServiceItemsLength === 0
                  ?<EmptyState>
                    <Dropdown.Button trigger={['click']} type="primary"   icon={<PlusOutlined rev={undefined}/>} menu={{ items, onClick: (item)=>onLaunchButtonClick(item) }}>Launch New ...</Dropdown.Button>
                  </EmptyState>
                  : */}
                  <Table 
                  style={{width:'100%'}} 
                  scroll={{ x: 'calc(500px + 50%)'}} 
                  rowKey={(record) => record.id}
                  pagination={{
                    total:totalLength,  
                    showTotal:(total) => `Total ${total} items`,
                  }} 
                  loading={serviceItemsQuery.isLoading || serviceItemsQuery.isRefetching} 
                  // @ts-ignore 
                  columns={columns} 
                  // @ts-ignore 
                  onChange={handleChange} 
                  dataSource={servicesData} 
                />
                {/* } */}
                
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
const router = useRouter()

const {currentOrg} = useOrgContext()
const isBankConnected = currentOrg?.isBankConnected

const {paseto} = useAuthContext()

const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

const {isManager, isSuperAdmin} = useRole()

 const urlPrefix = useUrlPrefix()

async function fetchItemAvailability(){
 const res = await axios.get(`${utils.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items/availability?serviceItemId=${selectedRecord.id}&pageNumber=1&pageSize=50`,{
  headers:{
    "Authorization":paseto
  }
})
return res.data.data
}

const {data, isLoading} = useQuery({queryKey:['availability',selectedRecord.id], queryFn:fetchItemAvailability})

const availabilityData = data && data



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
    url:`${utils.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items`,
    data: {
        id:record.id,
        // key:'status',
        status: '0'
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

 async function reActivateServiceHandler(record:ServiceItem){
      const res = await axios({
          method:'patch',
          url:`${utils.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-items`,
          data:{
              // key:'status',
              status: '1', 
              id: record.id  
          },
          headers:{
              "Authorization": paseto
          }
      })
      return res; 
  }

  const publishService = useMutation(reActivateServiceHandler,{
    onSettled:()=>{
      queryClient.invalidateQueries({queryKey:['serviceItems']})
    }
  })

  function copyLink(selectedRecord:any){
  navigator.clipboard.writeText('')
  const serviceItemId = selectedRecord.id
  const marketplaceLink = `https://marketplace.dev.flexabledats.com/services/${serviceItemId}`
   // Copy the text inside the text field
   navigator.clipboard.writeText(marketplaceLink);
}


return( 
<Drawer 
  title="Service Details" 
  width={640} placement="right" 
  closable={true} 
  onClose={closeDrawerHandler} 
  open={isDrawerOpen}
    extra={
  <Space>
  <Popover placement="bottom" content={'Copied!'} trigger="click">
    <Button size='large' disabled={!isBankConnected} icon={<CopyOutlined rev={undefined} />} onClick={()=>copyLink(selectedRecord)}>Copy Link</Button>
    </Popover>
    { !isBankConnected && selectedRecord?.status == 4
    ? <Button size='large' disabled={!isBankConnected} type="primary" loading={publishService.isLoading} onClick={()=>publishService.mutate(selectedRecord)}>Publish Service</Button>
    : null
    }
     </Space>}
>

   {/* {!isBankConnected && selectedRecord?.status === 4
      ? <Alert
          style={{ marginBottom: '2rem' }}
          type="info"
          showIcon
          message='Connect account to publish'
          closable description='Your exclusive access will not be listed on marketplace because you are still yet to add a bank account. It will be saved as drafts until an account is linked to your profile.'
          action={
              <Button onClick={() => router.push('/organizations/billings')} size="small">
                  Add account
              </Button>
          }
      />
      : null
    } */}
  
<EditableText
    fieldKey="name" // The way the field is named in DB
    currentFieldValue={selectedRecord.name}
    fieldName = 'name'
    title = 'Name'
    id = {selectedRecord.id}
    options = {{queryKey:'service-items',mutationUrl:'service-items'}}
  />
  <EditableDescription selectedRecord={selectedRecord}/>
  <EditablePrice selectedRecord={selectedRecord}/>

  <EditableTicketsPerDay selectedRecord={selectedRecord}/>
  <EditableCoverImage selectedRecord={selectedRecord}/>

  {/* <Text>CUSTOM AVALABILITY</Text> */}
  <Title style={{marginTop:'3rem'}} level={3}>Custom Dates</Title>

  <AvailabilitySection selectedServiceItem={selectedRecord} />
  {/* <AvailabilitySection selectedServiceItem={selectedRecord}/> */}

  {isManager || isSuperAdmin ?<EditableCharge selectedRecord={selectedRecord}/>:null}
  
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
      name: 'Inactive'
  },
   {
      id: '4',
      name: 'Drafts'
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


