import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../../hooks/useOrgs";
const {Text, Title} = Typography;
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import {Typography,Button, Skeleton, Badge, Image, Table, Input, Radio,  Drawer, Row, Col, Form, Modal, Alert, notification, Dropdown, MenuProps} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import { MoreOutlined, ReloadOutlined, ArrowLeftOutlined, PlusOutlined} from '@ant-design/icons'

import { useAuthContext } from '../../../context/AuthContext';
import { useServicesContext } from '../../../context/ServicesContext';
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { useOrgContext } from "../../../context/OrgContext";
import { Service } from "../Services.types";

import { EditableAddress, EditableCoverImage, EditableCurrency, EditableLogoImage, EditableName, EditablePhone } from "../EditServiceForm/EditServiceForm";
import CurrentUser from "../../Header/CurrentUser/CurrentUser";
import useServiceTypes from "../../../hooks/useServiceTypes";
import { convertToAmericanFormat } from "../../../utils/phoneNumberFormatter";
import { EditableText} from "../../shared/Editables";
import useUrlPrefix from "../../../hooks/useUrlPrefix";

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

type ServiceMenu={
  label:string,
  key:string
}


export default function ManagerOrgsView(){

    const {paseto,currentUser} = useAuthContext()
    const {currentOrg} = useOrgContext() // coming from local storage
    const queryClient = useQueryClient()
    const router = useRouter()
    const {switchOrg} = useOrgs()
    // const [items, setItems] = useState([])

    const {switchService} = useServicesContext()

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [pageNumber, setPageNumber] = useState<number|undefined>(0)
    const [pageSize, setPageSize] = useState<number|undefined>(10)

    const serviceTypes = useServiceTypes()

    const items = serviceTypes && serviceTypes.map((item:any)=>({label:item.label, key:item.value}))
  

    const [selectedRecord, setSelectedRecord] = useState<any|Service>({})
    const [currentFilter, setCurrentFilter] = useState({id:'1',name: 'Active'})
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
      setIsHydrated(true)
    }, [])

   const urlPrefix = useUrlPrefix()

  
    async function fetchAllServices(){
    const res = await axios({
            method:'get',
            //@ts-ignore
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/services?key=org_id&value=${currentOrg.orgId}&pageNumber=${pageNumber}&pageSize=10`,

            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
   
    }
  
    async function fetchServices(){
      const res = await axios({
              method:'get',
              //@ts-ignore
              url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/services?key=org_id&value=${currentOrg.orgId}&pageNumber=${pageNumber}&pageSize=${pageSize}&key2=status&value2=${currentFilter.id}`,

              headers:{
                  "Authorization": paseto
              }
          })

          return res.data;
    
    }

    async function reActivateServiceHandler(record:Service){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/services`,
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
        queryClient.invalidateQueries({queryKey:['services']})
      }
    })

   

    // const shouldFetch = paseto !== '' && urlPrefix != undefined

    // console.log('prefix',urlPrefix)
    // console.log('shouldfetch',shouldFetch)

    // @ts-ignore
    const servicesQuery = useQuery({queryKey:['services',{currentOrg: currentOrg.orgId, status:currentFilter.name, pageNumber} ], queryFn:fetchServices, enabled: paseto !== ''})
    const data = servicesQuery.data && servicesQuery.data.data
    const totalLength = servicesQuery.data && servicesQuery.data.dataLength;

    // @ts-ignore
    const allServicesQuery = useQuery({queryKey:['all-services',{currentOrg: currentOrg.orgId}], queryFn:fetchAllServices, enabled: paseto !== '', staleTime:Infinity})
    const allServicesLength = allServicesQuery.data && allServicesQuery.data.dataLength;



  //  console.log(servicesData)

    function gotoBillingsPage(){
      router.push('/organizations/services/billings')
    }


    const handleChange: TableProps<Service>['onChange'] = (data) => {
      setPageSize(data.pageSize)
      //@ts-ignore
      setPageNumber(data.current-1); // Subtracting 1 because pageSize param in url starts counting from 0
    };
  
   
function gotoServiceItemsPage(service:Service){
  // switch org
  switchService(service)
  // navigate user to services page
  router.push('/organizations/services/serviceItems') // redirect to dashboard later
}


    function viewServiceDetails(service:Service){
      // set state
      setSelectedRecord(service)
      // opne drawer
      setIsDrawerOpen(true)

    }
  
    
      const onMenuClick=( record:Service) => {
        viewServiceDetails(record)
        console.log('click', record);
      };

  
  
    const columns: ColumnsType<Service> = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        fixed:'left',
        width:'250px',
        ellipsis:true,
        render:(_,record)=>{
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${record.logoImageHash}`}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Button onClick={()=>gotoServiceItemsPage(record)} type='link'>{record.name}</Button>  
                    </div>
                </div>
            )
        },
      },
      {
        title: 'Service Type',
        dataIndex: 'serviceType',
        key: 'serviceType',
        width:'120px',
        render: (_,record)=>{
          const type = record.serviceType[0]
            return <Text>{type.name}</Text>
        }
      },
      {
        title: 'Address',
        // dataIndex: 'address',
        key: 'address',
        width:'300px',
        render:(_,record)=>(
          <div style={{display:'flex',flexDirection:'column'}}>
              <Text style={{textTransform:'capitalize'}}>{record.street}</Text>  
              {/* <Text style={{textTransform:'capitalize'}} type='secondary'>{record.state} {record.city}</Text>   */}
          </div>
        )
      },
        {
          title: 'Contact Number',
          dataIndex: 'contactNumber',
          key: 'contactNumber',
          width:'170px',
          render: (_,record)=>{
            const formatedNumber = convertToAmericanFormat(record.contactNumber)
              return <Text>{formatedNumber}</Text>
          }
        },
        
      {
        title: 'Timezone',
        dataIndex: 'timeZone',
        key: 'timeZone',
        width:'200px',
      },
      // {
      //   title: 'Currency',
      //   dataIndex: 'currency',
      //   key: 'currency',
      //   width:'70px',
      // },
      // {
      //   title: 'Status',
      //   dataIndex: 'status',
      //   key: 'status',
      //   width:'150px',
      //   render:(status)=>{
      //       const statusText = status? 'Active': 'Inactive' 
      //       return <Badge status={status?'processing':'warning'} text={statusText} /> 
      //   }
      // },
      {
          title: 'Created On',
          dataIndex: 'createdAt',
          key: 'createdAt',
          width:'120px',
          render: (_,record)=>{
              const date = dayjs(record.createdAt).format('MMM DD, YYYY')
              return(
            <Text type='secondary'>{date}</Text>
            )
        },
    },
    {
      dataIndex: 'actions', 
      key: 'actions',
      fixed: 'right',
      width:currentFilter.name === 'In-active'?'150px':'70px',
      //@ts-ignore
      render:(_,record:Service)=>{
        if(currentFilter.name === 'In-active'){
          return (<Button  onClick={()=>reactivateService.mutate(record)}>Reactivate</Button>)
        }else{
          return <Button onClick= {()=>onMenuClick(record)} type="text" icon={<MoreOutlined/>}/> 
        }
      }
    }
    ];


    
    

    const onLaunchButtonClick: MenuProps['onClick'] = (e) => {
      const key = e.key
      const targetMenu:any = items.find((item:ServiceMenu)=>item.key === key)
      router.push(`/organizations/services/new?key=${targetMenu!.key}&label=${targetMenu!.label}`)
    };

        return (
            <div style={{background:'#f7f7f7', minHeight:'100vh'}}>
                <Row style={{marginTop:'.5em'}} gutter={[16,16]}>
               <header style={{width:'100%', padding:'1rem 0' , background:'#ffffff'}}>
                   <Col style={{display:'flex', justifyContent:'space-between'}} offset={1} span={22}>
                       <div style={{display:'flex', flex:'7',alignItems:'center'}}> 
                           <Button style={{display:'flex', padding: '0', margin:'0', alignItems:'center', textAlign:'left'}} onClick={()=>router.replace('/')} icon={<ArrowLeftOutlined />} type='link'/>
                           {isHydrated ? <Title style={{margin:'0'}} level={4}>{currentOrg.name}</Title>:<Skeleton.Input active size='default'/> } 
                       </div>

                       {
                       isHydrated
                        ?<div style={{ display:'flex', flex:'3', justifySelf:'flex-end', alignItems:'center'}}>
                          <Button type="link" style={{marginRight:'2rem'}} onClick={gotoBillingsPage} >Billings</Button>
                          <CurrentUser/>
                       </div>
                       : <Skeleton.Input active size='default'/>
                       }
                   </Col>
               </header>

               <Col offset={1} span={22}>
                   {allServicesQuery.data && allServicesLength === 0 
                   ? null 
                   : <div style={{marginBottom:'1.5em', display:'flex', width:'100%', flexDirection:'column'}}>
                    <div style={{width:'100%',  marginBottom:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <Title style={{margin: '0'}} level={2}>Launchpad</Title>
                      <div style={{display:'flex'}}>
                        <Button shape='round' style={{marginRight:'1rem'}} loading={servicesQuery.isRefetching} onClick={()=>servicesQuery.refetch()} icon={<ReloadOutlined />}>Refresh</Button>
                        <Dropdown.Button  trigger={['click']} type="primary"   icon={<PlusOutlined/>} menu={{ items, onClick: (item)=>onLaunchButtonClick(item) }}>Launch New ...</Dropdown.Button>
                      </div>
                    </div>
                      <Radio.Group defaultValue={currentFilter.id} buttonStyle="solid">
                          {servicesFilter.map((filter:any)=>(
                              <Radio.Button key={filter.id} onClick={()=>setCurrentFilter(filter)} value={filter.id}>{filter.name}</Radio.Button>
                          )
                          )}
                      </Radio.Group>
                   </div>
                   }
                
                {
                  allServicesQuery.data && allServicesLength === 0
                  ? <EmptyState>
                      <Dropdown.Button trigger={['click']} type="primary"   icon={<PlusOutlined/>} menu={{ items, onClick: (item)=>onLaunchButtonClick(item) }}>Launch New ...</Dropdown.Button>
                  </EmptyState> 
                  : <Table 
                      style={{width:'100%'}} 
                      scroll={{ x: 'calc(500px + 50%)'}} 
                      size='large' 
                      rowKey={(record)=>record.id}
                      onChange={handleChange} 
                      loading={servicesQuery.isLoading || servicesQuery.isRefetching} 
                      columns={columns} 
                      dataSource={data||[]}
                      pagination={{
                        total:totalLength,  
                        showTotal:(total) => `Total: ${total} items`,
                      }} 
                    />
                }
                
                { 
                  isDrawerOpen
                  ?<DetailDrawer isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedRecord={selectedRecord}/>
                  :null
                }  

               </Col> 
           </Row>
                
            </div>
    )



}

interface DrawerProps{
  selectedRecord: Service,
  isDrawerOpen: boolean,
  closeDrawer: (value:boolean)=>void
}

function DetailDrawer({selectedRecord,isDrawerOpen,closeDrawer}:DrawerProps){

const queryClient = useQueryClient()
const router = useRouter()
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
// const {swi} = useOrgContext()
const {switchService} = useServicesContext()
const {paseto,currentUser} = useAuthContext()

function closeDrawerHandler(){
  queryClient.invalidateQueries(['services']) 
  closeDrawer(!isDrawerOpen)
}

function gotoServices(service:Service){
  // switch org
  switchService(service)
  // navigate user to services page
  router.push('/organizations/services/serviceItems') // redirect to dashboard later
}

function toggleDeleteModal(){
  setIsDeleteModalOpen(!isDeleteModalOpen)
}

function deleteService(){ 
  console.log(selectedRecord.id)
  // mutate record
  deleteData.mutate(selectedRecord,{
    onSuccess:()=>{
      notification['success']({
        message: 'Successfully deleted record!'
      })
      toggleDeleteModal()
      closeDrawerHandler()

    },
    onError:(err)=>{
        console.log(err)
        notification['error']({
            message: 'Encountered an error while deleting record custom custom dates',
          });
        // leave modal open
    }
  })
}

const urlPrefix = currentUser.role == 1 ? 'manager': 'admin'

const deleteDataHandler = async(record:Service)=>{      
  const {data} = await axios({
    method:'patch',
    url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/services`,
    data: {
        id:record.id,
        key:'status',
        value: "0"
      },
    headers:{
          "Authorization": paseto 
  }})
  return data
}

const deleteData = useMutation(deleteDataHandler)

const{isLoading:isDeletingItem} = deleteData


return( 
<Drawer 
  title="Venue Details" 
  width={640} placement="right" 
  extra={<Button size='large' onClick={()=>gotoServices(selectedRecord)}>Visit Venue</Button>}
  closable={true} 
  onClose={closeDrawerHandler} 
  open={isDrawerOpen}
>
  
  <EditableText
    fieldKey="name" // The way the field is named in DB
    currentFieldValue={selectedRecord.name}
    fieldName = 'name'
    title = 'Name'
    id = {selectedRecord.id}
    options = {{queryKey:'services',mutationUrl:'services'}}
  />
  <EditableAddress selectedRecord={selectedRecord}/>
  <EditableText
    fieldKey="contact_number" // The way the field is named in DB
    currentFieldValue={selectedRecord.contactNumber}
    fieldName = 'contactNumber'
    title = 'Contact Number'
    id = {selectedRecord.id}
    options = {{queryKey:'services',mutationUrl:'services'}}
  />
  {/* <EditableCurrency selectedRecord={selectedRecord}/> */}
  <EditableLogoImage selectedRecord={selectedRecord}/>
  {/* <EditableCoverImage selectedRecord={selectedRecord}/> */}

  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Title level={3}>Danger zone</Title>
    <Button danger onClick={toggleDeleteModal} style={{width:'30%'}} type="link">Deactivate Venue</Button>
  </div>

  <DeleteRecordModal 
  isDeletingItem={isDeletingItem} 
  onCloseModal={toggleDeleteModal} 
  onDeleteRecord={deleteService} 
  isOpen={isDeleteModalOpen} 
  selectedRecord={selectedRecord}
  />

</Drawer>
)
}

interface DeleteProp{
  selectedRecord: Service
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
        {`This action will remove this venue’s listing from the marketplace and will deactivate any DATs that are attached to it. Venue can be reactivated in the future 
        `}
      </Text>

      <Form 
      form={form} 
      style={{marginTop:'1rem'}}
      name="deleteServiceForm" 
      layout='vertical'
      onFinish={onFinish}>
      <Form.Item
        name="name"
        style={{marginBottom:'.6rem'}}
        label={`Please type "${selectedRecord.name}" to confirm`}
        rules={[{ required: true, message: 'Please type correct service item name!' }]}
      >
        <Input size="large" disabled={isDeletingItem} />
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
           I understand the consequences, delete permanently
          </Button>
        )}
      </Form.Item>

    </Form>

  </Modal>
  )
}


function CustomDropdown(menus:ReactNode[]){
  return(
    <div>
      {
        menus!.map((item:any)=>(
          <Text key={item}>{item}</Text>
        ))
      }
    </div>
  )
}



const servicesFilter = [
  {
      id: '1',
      name: 'Active'
  },
  {
      id: '0',
      name: 'In-active'
  },
]


interface EmptyStateProps{
  children: ReactNode
}

function EmptyState({children}:EmptyStateProps){

  return(
    <div style={{border: '1px solid #d6d6d6', marginTop:'2rem', borderRadius:'4px', height:'40vh', display:'flex', justifyContent:'center', alignItems:'center', padding: '2rem'}}>
      <div style={{maxWidth:'350px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <Title level={3}>Get Started</Title> 
        <Text style={{textAlign:'center'}}>Oops! We have found no active venues in your organization</Text>
        <div style={{marginTop:'1rem', display:'flex',justifyContent:'center'}}>
            {children}
        </div>
      </div>
    </div>
  )
}



