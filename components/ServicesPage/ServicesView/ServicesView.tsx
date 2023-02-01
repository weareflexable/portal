import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../../hooks/useOrgs";
const {Text, Title} = Typography;
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload,Skeleton, Badge, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import { MoreOutlined, ReloadOutlined, ArrowLeftOutlined, PlusOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';

import { useAuthContext } from '../../../context/AuthContext';
import { useServicesContext } from '../../../context/ServicesContext';
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { useOrgContext } from "../../../context/OrgContext";
import { asyncStore } from "../../../utils/nftStorage";
import { usePlacesWidget } from "react-google-autocomplete";
import { Service } from "../Services.types";
import Link from "next/link";
const {TextArea} = Input

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)


export default function ManagerOrgsView(){

    const {paseto} = useAuthContext()
    const {currentOrg} = useOrgContext() // coming from local storage
    const queryClient = useQueryClient()
    const router = useRouter()
    const {switchOrg} = useOrgs()

    const {switchService} = useServicesContext()

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
    console.log('org',currentOrg)  

    type DataIndex = keyof Service;

    const [selectedRecord, setSelectedRecord] = useState<any|Service>({})
    const [currentStatus, setCurrentStatus] = useState({id:'1',name: 'Active'})

    async function fetchServices(){
    const res = await axios({
            method:'get',
            //@ts-ignore
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/services?key=org_id&value=${currentOrg.orgId}&pageNumber=0&pageSize=10`,
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


    const servicesQuery = useQuery({queryKey:['services', currentStatus], queryFn:fetchServices, enabled: paseto !== ''})
    const data = servicesQuery.data && servicesQuery.data.data


    function gotoBillingsPage(){
      router.push('/organizations/services/billings')
    }

   
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
    //   {
    //     title: 'Type',
    //     dataIndex: 'serviceType',
    //     key: 'serviceType',
    //     // render: (serviceType)=>{
    //     //     return <Text>{serviceType[0].name}</Text>
    //     // }
    //   },
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
                <Row style={{marginTop:'.5em'}} gutter={[16,46]}>
               <header style={{width:'100%', background:'#ffffff'}}>
                   <Col style={{display:'flex', justifyContent:'space-between'}} offset={2} span={20}>
                       <div style={{display:'flex', flex:'7', flexDirection:'column'}}> 
                           <Button style={{display:'flex', padding: '0', margin:'0', alignItems:'center', textAlign:'left'}} onClick={()=>router.replace('/')} icon={<ArrowLeftOutlined />} type='link'>Back to organizations</Button>
                           {currentOrg.name === ''? <Skeleton.Input active size='large' />:<Title level={4}>{currentOrg.name}</Title> } 
                       </div>
 
                       <div style={{display:'flex', flex:'3', justifyContent:'flex-end', alignItems:'center'}}>
                            {/* <Link href='/organizations/services/billings'>Billing</Link> */}
                            <Button type="link" onClick={gotoBillingsPage} >Billings</Button>
                       </div>
                   </Col>
               </header>

               <Col offset={2} span={20}>
                   {/* <Title style={{marginBottom:'1em'}} level={2}>Services</Title> */}
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
                
                <Table style={{width:'100%'}} size='large' key='dfadfe' loading={servicesQuery.isLoading} columns={columns} dataSource={data} />
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
// const {swi} = useOrgContext()
const {switchService} = useServicesContext()

function closeDrawerHandler(){
  queryClient.invalidateQueries(['organizations'])
  closeDrawer(!isDrawerOpen)
}

function gotoServices(service:Service){
  // switch org
  switchService(service)
  // navigate user to services page
  router.push('/organizations/services/bookings') // redirect to dashboard later
}


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
  <EditablePhone selectedRecord={selectedRecord}/>
  <EditableCurrency selectedRecord={selectedRecord}/>
  <EditableLogoImage selectedRecord={selectedRecord}/>
  <EditableCoverImage selectedRecord={selectedRecord}/>

  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Divider/>
    <Button danger type="link">De-activate service</Button>
    <Divider/>
  </div>

</Drawer>
)
}


interface EditableProp{
  selectedRecord: Service
}
function EditableName({selectedRecord}:EditableProp){

  const [state, setState] = useState(selectedRecord)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  const queryClient = useQueryClient()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

 

  const nameMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/services`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const nameMutation = useMutation({
    mutationKey:['serviceName'],
    mutationFn: nameMutationHandler,
    onSuccess:()=>{
      toggleEdit()
    }
  })

  function onFinish(updatedItem:Service){
    const payload = {
      key:'name',
      value: updatedItem.name,
      id: selectedRecord.id
    }
    const updatedRecord = {
      ...selectedRecord,
      name: updatedItem.name
    }
    setState(updatedRecord)
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
     initialValues={selectedRecord}
     onFinish={onFinish}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
          <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input a valid service name' }]}
          >
              <Input  disabled={isEditing} placeholder="Benjamins On Franklin Bar" />
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
function EditableAddress({selectedRecord}:EditableProp){

  const [state, setState] = useState(selectedRecord)

  const [isEditMode, setIsEditMode] = useState(false)
  const antInputRef = useRef();
  const [fullAddress, setFullAddress] = useState({
    latitude:0,
    longitude:0,
    state: '',
    country:'',
    city:''
})

  const {paseto} = useAuthContext()


  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const [form]  = Form.useForm()

  const extractFullAddress = (place:any)=>{
    const addressComponents = place.address_components 
        let addressObj = {
            state:'',
            country:'',
            city:'',
            latitude:place.geometry.location.lat(),
            longitude:place.geometry.location.lng()
        };
        addressComponents.forEach((address:any)=>{
            const type = address.types[0]
            if(type==='country') addressObj.country = address.long_name
            if(type === 'locality') addressObj.state = address.short_name
            if(type === 'administrative_area_level_1') addressObj.city = address.short_name
        })

        return addressObj
}

  const { ref: antRef } = usePlacesWidget({
    apiKey: `${process.env.NEXT_PUBLIC_MAPS_AUTOCOMPLETE_API}`, // move this key to env
    // apiKey: `AIzaSyB7ZUkMcIXpOKYU4r4iBMM9BFjCL5OpeeE`, // move this key to env
    onPlaceSelected: (place) => {
        // console.log(antInputRef.current.input)
        form.setFieldValue('address',place?.formatted_address)
        
        const fullAddress = extractFullAddress(place)
        setFullAddress(fullAddress)

        //@ts-ignore
      antInputRef.current.input.value = place?.formatted_address

    },
  });


  const nameMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const nameMutation = useMutation({
    mutationKey:['address'],
    mutationFn: nameMutationHandler,
    onSuccess:()=>{
      toggleEdit()
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      key:'country',
      value: updatedItem.country,
      orgId: selectedRecord.id
    }
    const updatedRecord = {
      ...selectedRecord,
      name: updatedItem.country
    }
    setState(updatedRecord)
    nameMutation.mutate(payload)
  }

  const {isLoading:isEditing} = nameMutation 

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{`${state.country}, ${state.city}`}</Text>
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableAddress"
     initialValues={selectedRecord}
     onFinish={onFinish}
     form={form}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
        <Form.Item 
            name="address"
            rules={[{ required: true, message: 'Please input a valid address!' }]}
        >
            {/* <TextArea rows={3} placeholder='Apt. 235 30B NorthPointsettia Street, Syracuse'/> */}
            <Input ref={(c) => {
                // @ts-ignore
                antInputRef.current = c;
                // @ts-ignore
                if (c) antRef.current = c.input;
                }} 
                placeholder="Syracuse, United states" 
                />
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
function EditablePhone({selectedRecord}:EditableProp){

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  const queryClient = useQueryClient()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{selectedRecord.currency}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )

  const nameMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const nameMutation = useMutation({
    mutationKey:['phone'],
    mutationFn: nameMutationHandler,
    onSuccess:()=>{
      toggleEdit()
      queryClient.invalidateQueries(['organizations'])
    }
  })

  function onFinish(field:any){
    const payload = {
      key:'phone',
      value: field.phone,
      orgId: selectedRecord.id
    }
    console.log(payload)
    nameMutation.mutate(payload)
  }

  const {isLoading:isEditing} = nameMutation 

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editablePhone"
     initialValues={selectedRecord}
     onFinish={onFinish}
     >
      <Row>
        <Col span={16}>
          <Form.Item
              name="phone"
              rules={[{ required: true, message: 'Please input a valid phone number' }]}
          >
              <Input disabled={isEditing} placeholder="09023234857" />
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
      <Text type="secondary" style={{ marginRight: '2rem',}}>Phone</Text>
      {isEditMode?editable:readOnly}
    </div>
  )
}

function EditableCurrency({selectedRecord}:EditableProp){

  const [state, setState] = useState(selectedRecord)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()


  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

 

  const mutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/services`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const mutation = useMutation({
    mutationKey:['currency'],
    mutationFn: mutationHandler,
    onSuccess:()=>{
      toggleEdit()
    }
  })

  function onFinish(updatedItem:Service){
    const payload = {
      key:'currency',
      value: updatedItem.currency,
      id: selectedRecord.id
    }
    const updatedRecord = {
      ...selectedRecord,
      currency: updatedItem.currency
    }
    setState(updatedRecord)
    mutation.mutate(payload)
  }

  const {isLoading:isEditing} = mutation ;

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{state.currency}</Text>
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableCurrency"
     initialValues={selectedRecord}
     onFinish={onFinish}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
          <Form.Item
              name="currency"
              rules={[{ required: true, message: 'Please input a valid accountNo' }]}
          >
              <Input  disabled={isEditing} placeholder="USD" />
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
      <Text type="secondary" style={{ marginRight: '2rem',}}>Currency</Text>
    {isEditMode?editable:readOnly}
    </div>
  )
}

function EditableLogoImage({selectedRecord}:EditableProp){

  const [isEditMode, setIsEditMode] = useState(false)
  const [isHashingImage, setIsHashingImage] = useState(false)
  const [updatedLogoImageHash, setUpdatedLogoImageHash] = useState(selectedRecord.logoImageHash)

  const queryClient = useQueryClient()

  const {paseto} = useAuthContext()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const readOnly = (
      <div style={{width:'100%', marginTop:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Image style={{width:'170px', height:'170px', border:'1px solid #f2f2f2', borderRadius:'50%'}} alt='Logo image for organization' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${updatedLogoImageHash}`}/>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )

  const mutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/services`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const mutation = useMutation({
    mutationKey:['logoImage'],
    mutationFn: mutationHandler,
    onSuccess:()=>{
      toggleEdit()
    }
  })

  async function onFinish(field:any){

    // hash it first
    const logoRes = await field.logoImage

    setIsHashingImage(true)
    const logoHash = await asyncStore(logoRes[0].originFileObj)
    setIsHashingImage(false)

    console.log(logoHash)

    const payload = {
      key:'logo_image_hash',
      value: logoHash,
      orgId: selectedRecord.id
    }
    setUpdatedLogoImageHash(logoHash)
    mutation.mutate(payload)
  }

  const {isLoading:isEditing} = mutation

  const extractLogoImage = async(e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
    return e;
    }

   return e?.fileList;
};


  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="EditablelogoImage"
     initialValues={selectedRecord}
     onFinish={onFinish}
     >

      <Row>
        <Col span={10}>
          <Form.Item
              name="logoImage"
              valuePropName="logoImage"
              getValueFromEvent={extractLogoImage}
              rules={[{ required: true, message: 'Please input a valid zip code' }]}
          >
              
              <Upload name="logoImageHash" listType="picture" multiple={false}>
                   <Button size='small' disabled={isHashingImage} type='link'>Upload logo image</Button>
              </Upload>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item style={{ width:'100%'}}>
              <Space >
                  <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                      Cancel
                  </Button>
                  <Button shape="round" loading={isEditing||isHashingImage} type="link" size="small"  htmlType="submit" >
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
      <Text type="secondary" style={{ marginRight: '2rem',}}>Logo</Text>
      {isEditMode?editable:readOnly}
    </div>
  )
}
function EditableCoverImage({selectedRecord}:EditableProp){

  const [isEditMode, setIsEditMode] = useState(false)
  const [isHashingImage, setIsHashingImage] = useState(false)
  const [updatedCoverImageHash, setUpdatedCoverImageHash] = useState(selectedRecord.logoImageHash)

  const queryClient = useQueryClient()

  const {paseto} = useAuthContext()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const readOnly = (
      <div style={{width:'100%', marginTop:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Image style={{width:'500px', height:'200px', objectFit:'cover', border:'1px solid #f2f2f2'}} alt='cover image for organization' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${updatedCoverImageHash}`}/>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )

  const mutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/services`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const mutation = useMutation({
    mutationKey:['logoImage'],
    mutationFn: mutationHandler,
    onSuccess:()=>{
      toggleEdit()
    }
  })

  async function onFinish(field:any){

    // hash it first
    const coverImageRes = await field.coverImage

    setIsHashingImage(true)
    const coverImageHash = await asyncStore(coverImageRes[0].originFileObj)
    setIsHashingImage(false)

    console.log(coverImageHash)

    const payload = {
      key:'cover_image_hash',
      value: coverImageHash,
      orgId: selectedRecord.id
    }
    setUpdatedCoverImageHash(coverImageHash)
    mutation.mutate(payload)
  }

  const {isLoading:isEditing} = mutation

  const extractCoverImage = async(e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
    return e;
    }

   return e?.fileList;
};


  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableCoverImage"
     initialValues={selectedRecord}
     onFinish={onFinish}
     >
      <Row>
        <Col span={10}>
          <Form.Item
              name="coverImage"
              valuePropName="coverImage"
              getValueFromEvent={extractCoverImage}
              rules={[{ required: true, message: 'Please input a valid zip code' }]}
          >
              
              <Upload name="coverImageHash" listType="picture" multiple={false}>
                   <Button size='small' disabled={isHashingImage} type='link'>Upload cover image</Button>
              </Upload>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item style={{ width:'100%'}}>
              <Space >
                  <Button shape="round" size='small' disabled={isEditing} onClick={toggleEdit} type='ghost'>
                      Cancel
                  </Button>
                  <Button shape="round" loading={isEditing||isHashingImage} type="link" size="small"  htmlType="submit" >
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
      <Text type="secondary" style={{ marginRight: '2rem',}}>Cover Image</Text>
      {isEditMode?editable:readOnly}
    </div>
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






