import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../../hooks/useOrgs";
const {Text, Title} = Typography;
import React, { useEffect, useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload,Skeleton, Badge, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Modal, Alert, notification} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import { MoreOutlined, ReloadOutlined, ArrowLeftOutlined, PlusOutlined} from '@ant-design/icons'

import { useAuthContext } from '../../../context/AuthContext';
import { useServicesContext } from '../../../context/ServicesContext';
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { useOrgContext } from "../../../context/OrgContext";
import { usePlacesWidget } from "react-google-autocomplete";
import { Service } from "../Services.types";
import Link from "next/link";
import { EditableAddress, EditableCoverImage, EditableCurrency, EditableLogoImage, EditableName } from "../EditServiceForm/EditServiceForm";
import CurrentUser from "../../Header/CurrentUser/CurrentUser";
const {TextArea} = Input

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)


export default function ManagerOrgsView(){

    const {paseto,currentUser} = useAuthContext()
    const {currentOrg} = useOrgContext() // coming from local storage
    const queryClient = useQueryClient()
    const router = useRouter()
    const {switchOrg} = useOrgs()

    const {switchService} = useServicesContext()

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [pageNumber, setPageNumber] = useState<number|undefined>(0)
  

    const [selectedRecord, setSelectedRecord] = useState<any|Service>({})
    const [currentStatus, setCurrentStatus] = useState({id:'1',name: 'Active'})
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
      setIsHydrated(true)
    }, [])

    const urlPrefix = currentUser.role == 1 ? 'manager': 'admin'

    async function fetchServices(){
    const res = await axios({
            method:'get',
            //@ts-ignore
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/services?key=org_id&value=${currentOrg.orgId}&pageNumber=0&pageSize=10&key2=status&value2=1`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
   
    }

    async function changeOrgStatus({serviceId, statusNumber}:{serviceId:string, statusNumber: string}){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/services`,
            data:{
                key:'status',
                value: statusNumber, // 0 means de-activated in db
                id: serviceId 
            },
            headers:{
                "Authorization": paseto
            }
        })
        return res; 
    }

    const changeStatusMutation = useMutation(['services'],{
        mutationFn: changeOrgStatus,
        onSuccess:(data:any)=>{
            queryClient.invalidateQueries({queryKey:['services',currentStatus]})
        },
        onError:()=>{
            console.log('Error changing status')
        }
    })

    function deActivateRecordHandler(service:Service){
        // setSelectedRecord(org.orgId)
        changeStatusMutation.mutate({serviceId:service.id, statusNumber:'0'})
    }

    const shouldFetch = paseto !== '' && urlPrefix != undefined

    console.log('prefix',urlPrefix)
    console.log('shouldfetch',shouldFetch)

    const servicesQuery = useQuery({queryKey:['services', urlPrefix, currentStatus.name], queryFn:fetchServices, enabled: shouldFetch})
    const data = servicesQuery.data && servicesQuery.data.data
    const servicesData = data && data.data
    const totalLength = data && data.dataLength;




    function gotoBillingsPage(){
      router.push('/organizations/services/billings')
    }


    const handleChange: TableProps<Service>['onChange'] = (data) => {
      console.log(data.current)
      //@ts-ignore
      setPageNumber(data.current-1); // Subtracting 1 because pageSize param in url starts counting from 0
    };
  
   
function gotoDashboard(service:Service){
  // switch org
  switchService(service)
  // navigate user to services page
  router.push('/organizations/services/bookings') // redirect to dashboard later
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
        render:(_,record)=>{
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={'/favicon.ico'}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Button onClick={()=>gotoDashboard(record)} type='link'>{record.name}</Button>  
                    </div>
                </div>
            )
        },
      },
      {
        title: 'Address',
        // dataIndex: 'address',
        key: 'address',
        render:(_,record)=>(
          <div style={{display:'flex',flexDirection:'column'}}>
              <Text style={{textTransform:'capitalize'}}>{record.country}</Text>  
              <Text style={{textTransform:'capitalize'}} type='secondary'>{record.city}</Text>  
          </div>
        )
      },
        {
          title: 'Type',
          dataIndex: 'serviceType',
          key: 'serviceType',
          render: (_,record)=>{
            const type = record.serviceType[0]
              return <Text>{type.name}</Text>
          }
        },
      {
        title: 'Timezone',
        dataIndex: 'timeZone',
        key: 'timeZone',

      },
      {
        title: 'Currency',
        dataIndex: 'currency',
        key: 'currency',
        width:'70px',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width:'100px',
        render:(status)=>{
            const statusText = status? 'Active': 'Stale' 
            return <Badge status={status?'processing':'warning'} text={statusText} /> 
        }
      },
    //   {
    //       title: 'CreatedAt',
    //       dataIndex: 'createdAt',
    //       key: 'createdAt',
    //       render: (_,record)=>{
    //           const date = dayjs(record.createdAt).format('MMM DD, YYYY')
    //           return(
    //         <Text>{date}</Text>
    //         )
    //     },
    // },
    // {
    //       title: 'UpdatedAt',
    //       dataIndex: 'updatedAt',
    //       key: 'updatedAt',
    //       render: (_,record)=>{
    //         // @ts-ignore
    //           const date = dayjs().to(dayjs(record.updatedAt))
    //           return(
    //         <Text>{date}</Text>
    //         )
    //     },
    // },
    {
      dataIndex: 'actions', 
      key: 'actions',
      width:'70px',
      render:(_,record)=>{
        return (<Button onClick= {()=>onMenuClick(record)} type="text" icon={<MoreOutlined/>}/> )
      }
    }
    ];

        return (
            <div style={{background:'#f7f7f7', minHeight:'100vh'}}>
                <Row style={{marginTop:'.5em'}} gutter={[16,16]}>
               <header style={{width:'100%', padding:'.5rem 0' , background:'#ffffff'}}>
                   <Col style={{display:'flex', justifyContent:'space-between'}} offset={2} span={22}>
                       <div style={{display:'flex', flex:'7',alignItems:'center'}}> 
                           <Button style={{display:'flex', padding: '0', margin:'0', alignItems:'center', textAlign:'left'}} onClick={()=>router.replace('/')} icon={<ArrowLeftOutlined />} type='link'/>
                           {isHydrated ? <Title style={{margin:'0'}} level={4}>{currentOrg.name}</Title>:<Skeleton.Input active size='default' /> } 
                       </div>

                       {isHydrated?<div style={{ display:'flex', flex:'3', justifyContent:'space-end', alignItems:'center'}}>
                          <Button type="link" style={{marginRight:'2rem'}} onClick={gotoBillingsPage} >Billings</Button>
                          <CurrentUser/>
                       </div>: <Skeleton.Input active size='default'/>}
                   </Col>
               </header>

               <Col offset={2} span={20}>
                   <Title style={{marginBottom:'1em'}} level={2}>Services</Title>
                   <div style={{marginBottom:'1.5em', display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                    <Radio.Group defaultValue={currentStatus.id} buttonStyle="solid">
                        {servicesFilter.map(filter=>(
                            <Radio.Button key={filter.id} onClick={()=>setCurrentStatus(filter)} value={filter.id}>{filter.name}</Radio.Button>
                        )
                        )}
                    </Radio.Group>
                    <div style={{display:'flex',  justifyContent:'space-between', alignItems:'center'}}>
                        <Button type='link' loading={servicesQuery.isRefetching} onClick={()=>servicesQuery.refetch()} icon={<ReloadOutlined />}>{servicesQuery.isRefetching? 'Refreshing...':'Refresh'}</Button>
                        <Button shape='round' type='primary' icon={<PlusOutlined/>} onClick={()=>router.push('/organizations/services/new')}>Launch new service</Button>
                    </div>
                </div>
                
                <Table 
                  style={{width:'100%'}} 
                  size='large' key='dfadfe' 
                  onChange={handleChange} 
                  loading={servicesQuery.isLoading} 
                  columns={columns} 
                  dataSource={data}
                  pagination={{
                    total:totalLength,  
                    showTotal:(total) => `Total: ${total} items`,
                  }} 
                   />
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
const {paseto} = useAuthContext()

function closeDrawerHandler(){
  queryClient.invalidateQueries(['services']) 
  closeDrawer(!isDrawerOpen)
}

function gotoServices(service:Service){
  // switch org
  switchService(service)
  // navigate user to services page
  router.push('/organizations/services/bookings') // redirect to dashboard later
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

const deleteDataHandler = async(record:Service)=>{      
  const {data} = await axios({
    method:'patch',
    url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/services`,
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
  title="Service Details" 
  width={640} placement="right" 
  extra={<Button size='large' onClick={()=>gotoServices(selectedRecord)}>Visit service</Button>}
  closable={true} 
  onClose={closeDrawerHandler} 
  open={isDrawerOpen}
>
  
  <EditableName selectedRecord={selectedRecord}/>
  <EditableAddress selectedRecord={selectedRecord}/>
  <EditableCurrency selectedRecord={selectedRecord}/>
  <EditableLogoImage selectedRecord={selectedRecord}/>
  <EditableCoverImage selectedRecord={selectedRecord}/>
  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Title level={3}>Danger zone</Title>
    <Button danger onClick={toggleDeleteModal} style={{width:'30%'}} type="link">De-activate service</Button>
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
      <Alert style={{marginBottom:'.5rem'}} showIcon message="Bad things will happen if you don't read this!" type="warning" />
      <Text >
        {`This action cannot be undone. This will permanently delete the ${selectedRecord.name} service item, staff, bookings, and remove from listing on marketplace 
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






const servicesFilter = [
  {
      id: '1',
      name: 'Active'
  },
  {
      id: '2',
      name: 'Stale'
  },
]






