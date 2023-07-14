
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../../hooks/useOrgs";
const {Text, Title} = Typography;
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import {Typography,Button, Skeleton, Badge, Image, Table, Input, Radio,  Drawer, Row, Col, Form, Modal, Alert, notification, Dropdown, MenuProps, Tag, Space, Upload, DatePicker, Select} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import { MoreOutlined, ReloadOutlined, ArrowLeftOutlined, PlusOutlined} from '@ant-design/icons'

import { useAuthContext } from '../../../context/AuthContext';
import { useServicesContext } from '../../../context/ServicesContext';
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { useOrgContext } from "../../../context/OrgContext";

// import { EditableAddress, EditableCoverImage, EditableCurrency, EditableLogoImage, EditableName, EditablePhone } from "../EditServiceForm/EditServiceForm";
import useServiceTypes from "../../../hooks/useServiceTypes";
import { convertToAmericanFormat } from "../../../utils/phoneNumberFormatter";
import { EditableText} from "../../../components/shared/Editables";
import useUrlPrefix from "../../../hooks/useUrlPrefix";
import ServiceLayout from "../../../components/Layout/ServiceLayout";
import { Event } from "../../../types/Event";
// import { EditableArtwork } from "../../../components/EventPage/Editables/Artwork";
import { asyncStore } from "../../../utils/nftStorage";
import useEvent from "../../../hooks/useEvents";
import { IMAGE_PLACEHOLDER_HASH } from "../../../constants";
import { usePlacesWidget } from "react-google-autocomplete";

const {TextArea} = Input

var relativeTime = require('dayjs/plugin/relativeTime')
var utc = require("dayjs/plugin/utc")
var timezone = require("dayjs/plugin/timezone")
var advanced = require("dayjs/plugin/advancedFormat")

dayjs.extend(relativeTime)
dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advanced)




function Events(){

    const {paseto,currentUser} = useAuthContext()
    const {currentOrg} = useOrgContext() // coming from local storage
    const queryClient = useQueryClient()
    const router = useRouter()
    const {switchEvent} = useEvent()
    // const [items, setItems] = useState([])


    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [pageNumber, setPageNumber] = useState<number|undefined>(1)
    const [pageSize, setPageSize] = useState<number|undefined>(10)

  

    const [selectedRecord, setSelectedRecord] = useState<any|Event>({})
    const [currentFilter, setCurrentFilter] = useState({id:'1',name: 'Active'})
    const [isHydrated, setIsHydrated] = useState(false)

   
   const urlPrefix = useUrlPrefix()

  
    async function fetchAllEvents(){
    const res = await axios({
            method:'get',
            //@ts-ignore
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/events?orgId=${currentOrg.orgId}&pageNumber=${pageNumber}&pageSize=${pageSize}&status=${currentFilter.id}`,

            headers:{
                "Authorization": paseto 
            }
        })

        return res.data.data;
   
    }
  
    async function fetchEvents(){
      const res = await axios({
              method:'get',
              //@ts-ignore
              url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/events?orgId=${currentOrg.orgId}&pageNumber=${pageNumber}&pageSize=${pageSize}&status=${currentFilter.id}`,

              headers:{
                  "Authorization": paseto
              }
          })

          return res.data.data;
    
    }

    async function reActivateEventHandler(record:Event){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/events`,
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


    const reactivateEvent = useMutation(reActivateEventHandler,{
      onSettled:()=>{
        queryClient.invalidateQueries({queryKey:['events']})
      }
    })

   

    // const shouldFetch = paseto !== '' && urlPrefix != undefined

    // console.log('prefix',urlPrefix)
    // console.log('shouldfetch',shouldFetch)

    // @ts-ignore
    const eventsQuery = useQuery({queryKey:['events',{currentOrg: currentOrg.orgId, status:currentFilter.name, pageNumber} ], queryFn:fetchEvents, enabled: paseto !== ''})
    const data = eventsQuery.data && eventsQuery.data
    // const totalLength = eventsQuery.data && eventsQuery.data;
    const totalLength = 0;

    // @ts-ignore
    const allEventsQuery = useQuery({queryKey:['all-events',{currentOrg: currentOrg.orgId}], queryFn:fetchAllEvents, enabled: paseto !== '', staleTime:Infinity})
    const allEventsLength = allEventsQuery.data && allEventsQuery.data.dataLength;




    const handleChange: TableProps<Event>['onChange'] = (data) => {
      setPageSize(data.pageSize)
      //@ts-ignore
      setPageNumber(data.current); // Subtracting 1 because pageSize param in url starts counting from 0
    };
  
   
function gotoEventPage(event:Event){
  // switch org
  switchEvent(event)
  // navigate user to services page
  router.push('/organizations/events/bookings') // 
}


    function viewEventDetails(event:Event){
      // set state
      setSelectedRecord(event)
      // opne drawer
      setIsDrawerOpen(true)

    }
  
    
      const onMenuClick=( record:Event) => {
        viewEventDetails(record)
      };

  
  
    const columns: ColumnsType<Event> = [
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
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${record.coverImageHash.length < 10? IMAGE_PLACEHOLDER_HASH : record.coverImageHash}`}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Button onClick={()=>gotoEventPage(record)} type='link'>{record.name}</Button>  
                    </div>
                </div>
            )
        },
      },
      {
        title: 'Venue Name',
        dataIndex: 'locationName',
        key: 'locationName',
        width:'200px',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        width:'100px',
        render: (price)=>(
          <div>
            <Text>$</Text>
            <Text>{price/100}</Text>
          </div>
        )
      },
      {
        title: 'Total Tickets',
        dataIndex: 'totalTickets',
        key: 'totalTickets',
        width:'100px',
        render: (totalTickets)=>(
          <div>
            <Text>{totalTickets}</Text>
          </div>
        )
      },
      
      // {
      //   title: 'Contact Number',
      //   dataIndex: 'contactNumber',
      //   key: 'contactNumber',
      //   width:'140px',
      //   render: (contactNumber)=>{
      //     const formatedNumber = convertToAmericanFormat(contactNumber)
      //     return(
      //     <div>
      //       <Text>{formatedNumber}</Text>
      //     </div>
      //   )
      // },
      {
        title: 'Duration',
        dataIndex: 'duration',
        key: 'duration',
        width:'120px',
        render: (duration)=>{
          return(
          <div>
            <Text>{duration/60}hrs</Text>
          </div>
        )
      }
      },
      {
          title: 'Start Time',
          dataIndex: 'startTime',
          key: 'date',
          fixed:'right',
          width:'140px',
          render: (startTime)=>{
              return(
            <Text type='secondary'>{dayjs(startTime).tz("UTC").format('MMM DD, YYYY H A')}</Text>
            )
        },
    },
    {
      title: 'Timezone',
      dataIndex: 'timeZone',
      key: 'timeZone',
      width:'80px',
      fixed:'right',
      render: (timezone:string)=>(
        <div>
          <Text>{timezone}</Text>
        </div>
      )
    },
    {
      dataIndex: 'actions', 
      key: 'actions',
      fixed: 'right',
      width:currentFilter.name === 'In-active'?'150px':'70px',
      //@ts-ignore
      render:(_,record:Event)=>{
        if(currentFilter.name === 'In-active'){
          return (<Button  onClick={()=>reactivateEvent.mutate(record)}>Reactivate</Button>)
        }else{
          return <Button onClick= {()=>onMenuClick(record)} type="text" icon={<MoreOutlined rev={undefined}/>}/> 
        }
      }
    }
    ];

    

        return (
            <div style={{background:'#f7f7f7', minHeight:'100vh'}}>
              <div style={{display:'flex', marginTop:'1rem', marginBottom:'1rem', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                 <Title style={{ margin:'0'}} level={2}>Events</Title>
               </div>
                   {allEventsQuery.data && allEventsLength === 0 
                   ? null 
                   : <div style={{marginBottom:'1.5em', display:'flex', width:'100%', flexDirection:'column'}}>
                    <div style={{width:'100%',  marginBottom:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        {/* filters */}
                        <Radio.Group defaultValue={currentFilter.id} buttonStyle="solid">
                          {filters.map((filter:any)=>(
                              <Radio.Button key={filter.id} onClick={()=>setCurrentFilter(filter)} value={filter.id}>{filter.name}</Radio.Button>
                          )
                          )}
                       </Radio.Group>
                        <div style={{display:'flex'}}>
                            <Button shape='round' style={{marginRight:'1rem'}} loading={eventsQuery.isRefetching} onClick={()=>eventsQuery.refetch()} icon={<ReloadOutlined rev={undefined} />}>Refresh</Button>
                            <Button  type="primary" onClick={()=>router.push('/organizations/events/new')}  icon={<PlusOutlined rev={undefined}/>} >Launch Event</Button>
                        </div>
                    </div>
                     
                   </div>
                   }
                
                {
                  allEventsQuery.data && allEventsLength === 0
                  ? <EmptyState>
                      <Button type="primary"  onClick={()=>router.push('/organizations/events/new')}  icon={<PlusOutlined rev={undefined}/>} >Launch Event</Button>
                  </EmptyState> 
                  : <Table 
                      style={{width:'100%'}} 
                      scroll={{ x: 'calc(500px + 50%)'}} 
                      size='large' 
                      rowKey={(record)=>record.id}
                      // @ts-ignore 
                      onChange={handleChange} 
                      loading={eventsQuery.isLoading || eventsQuery.isRefetching} 
                      // @ts-ignore 
                      columns={columns} 
                      dataSource={data}
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
                
            </div>
    )


}

export default Events

Events.PageLayout = ServiceLayout



interface DrawerProps{
  selectedRecord: Event,
  isDrawerOpen: boolean,
  closeDrawer: (value:boolean)=>void
}

function DetailDrawer({selectedRecord,isDrawerOpen,closeDrawer}:DrawerProps){

const queryClient = useQueryClient()
const router = useRouter()
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

const {switchEvent} = useEvent()
const {paseto} = useAuthContext()

const urlPrefix = useUrlPrefix()

function closeDrawerHandler(){
  queryClient.invalidateQueries(['communities']) 
  closeDrawer(!isDrawerOpen)
}

function gotoEvents(event:Event){
  switchEvent(event)
  // navigate user to services page
  router.push('/organizations/events/bookings')
}

function toggleDeleteModal(){
  setIsDeleteModalOpen(!isDeleteModalOpen)
}

function deleteEvent(){ 

  // mutate record
  deleteData.mutate(selectedRecord,{
    onSuccess:()=>{
      notification['success']({
        message: 'Successfully deactivated event!'
      })
      queryClient.invalidateQueries(['event'])
      toggleDeleteModal()
      closeDrawerHandler()
    },
    onSettled:()=>{
      queryClient.invalidateQueries(['event'])
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


const deleteDataHandler = async(record:Event)=>{      
  const {data} = await axios({
    method:'patch',
    url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/events`,
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

const deleteData = useMutation(deleteDataHandler,{
    onSettled:()=>{
        queryClient.invalidateQueries(['events'])
    }
})

const{isLoading:isDeletingItem} = deleteData


return( 
<Drawer 
  title="Event Details" 
  width={640} placement="right" 
  extra={<Button size='large' onClick={()=>gotoEvents(selectedRecord)}>Visit Event</Button>}
  closable={true} 
  onClose={closeDrawerHandler} 
  open={isDrawerOpen}
>
  
  <EditableName selectedRecord={selectedRecord}/>
  <EditablePrice selectedRecord={selectedRecord}/>
  <EditableDescription selectedRecord={selectedRecord}/>
  <EditableTickets selectedRecord={selectedRecord}/>
  <EditableTimeZone selectedRecord={selectedRecord}/>
  <EditableDate selectedRecord={selectedRecord}/>
  <EditableAddress selectedRecord={selectedRecord}/>
  {/* <EditableArtwork selectedRecord={selectedRecord}/> */}
  <EditableLogoImage selectedRecord={selectedRecord}/>
  {/* <EditableCoverImage selectedRecord={selectedRecord}/> */}

  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Title level={3}>Danger zone</Title>
    <Button danger onClick={toggleDeleteModal} style={{width:'30%'}} type="link">Deactivate Event</Button>
  </div>

  <DeleteRecordModal 
  isDeletingItem={isDeletingItem} 
  onCloseModal={toggleDeleteModal} 
  onDeleteRecord={deleteEvent} 
  isOpen={isDeleteModalOpen} 
  selectedRecord={selectedRecord}
  />

</Drawer>
)
}

interface EditableProp{
  selectedRecord: Event
}


export function EditableDescription({selectedRecord}:EditableProp){
  
  const [state, setState] = useState(selectedRecord)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()


  const queryClient = useQueryClient()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  
  const [form]  = Form.useForm()

  const urlPrefix = useUrlPrefix()

  const recordMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/events`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }


  const recordMutation = useMutation({
    mutationKey:['description'],
    mutationFn: recordMutationHandler,
    onSuccess:(data:any)=>{
      console.log(data)
      toggleEdit()
    },
    onSettled:()=>{
      queryClient.invalidateQueries(['event'])
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      key:'description',
      value: updatedItem.description,
      id: selectedRecord.id
    }
    const updatedRecord = {
      ...selectedRecord,
      description: updatedItem.description
    }
    setState(updatedRecord)
    recordMutation.mutate(payload)
  }

  const {isLoading:isEditing} = recordMutation 

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{state.description}</Text>
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableDescription"
     initialValues={selectedRecord}
     onFinish={onFinish}
     form={form}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
        <Form.Item 
            name="description"
            rules={[{ required: true, message: 'Please input a description for your events!' }]}
        >
            <TextArea rows={3} placeholder='Tell us what your events is all about.'/>

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
      <Text type="secondary" style={{ marginRight: '2rem',}}>Description</Text>
    {isEditMode?editable:readOnly}
    </div>
  )
}

export function EditablePrice({selectedRecord}:EditableProp){
  
  const [state, setState] = useState(selectedRecord.price)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  const queryClient = useQueryClient()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

 const transformedRecord = {
  ...selectedRecord,
  price: Number(selectedRecord.price)/100
 }
 const urlPrefix = useUrlPrefix()

  const recordMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/events`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const recordMutation = useMutation({
    mutationKey:['price'],
    mutationFn: recordMutationHandler,
    onSuccess:()=>{
      toggleEdit()
    },
    onSettled:(data)=>{
        console.log(data)
      setState(data.data.price)
      queryClient.invalidateQueries(['events'])
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      key:'price',
      value: String(updatedItem.price*100),
      id: selectedRecord.id
    }
    recordMutation.mutate(payload)
  }

  const {isLoading:isEditing} = recordMutation ;

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>${state/100}</Text> 
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editablePrice"
     initialValues={{price: state/100}}
     onFinish={onFinish}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
          <Form.Item
              name="price"
              rules={[{ required: true, message: 'Please input a valid price' }]}
          >
              <Input  prefix="$" disabled={isEditing} />
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
      <Text type="secondary" style={{ marginRight: '2rem',}}>Price</Text>
    {isEditMode?editable:readOnly}
    </div>
  )
}

export function EditableName({selectedRecord}:EditableProp){

  // console.log(selectedRecord.name)
  
  const [state, setState] = useState(selectedRecord)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  const queryClient = useQueryClient()





  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

 const urlPrefix = useUrlPrefix()

  const recordMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/events`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const recordMutation = useMutation({
    mutationKey:['name'],
    mutationFn: recordMutationHandler,
    onSuccess:()=>{
      toggleEdit()
    },
    onSettled:()=>{
      queryClient.invalidateQueries({queryKey:['events']})
    }
  })

  function onFinish(updatedItem:any){
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
    recordMutation.mutate(payload)
  }

  const {isLoading:isEditing} = recordMutation ;

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
     initialValues={{name: selectedRecord.name}}
     onFinish={onFinish}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
          <Form.Item
              name="name"
              rules={[{ required: true, message: 'This field is required' }]}
          >
              <Input  disabled={isEditing} placeholder=""/>
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
      <Text type="secondary" style={{ marginRight: '2rem',}}>Title</Text>
    {isEditMode?editable:readOnly}
    </div>
  )
}

export function EditableLogoImage({selectedRecord}:EditableProp){
  
  const [isEditMode, setIsEditMode] = useState(false)
  const [isHashingImage, setIsHashingImage] = useState(false)
  const [updatedCoverImageHash, setUpdatedCoverImageHash] = useState(selectedRecord.coverImageHash)


  const urlPrefix = useUrlPrefix()

  const {paseto} = useAuthContext()

  const queryClient = useQueryClient()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const readOnly = (
      <div style={{width:'100%', marginTop:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Image style={{width:'170px', height:'170px', border:'1px solid #f2f2f2', borderRadius:'50%'}} alt='Cover image for event' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${updatedCoverImageHash}`}/>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )

  const mutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/events`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const mutation = useMutation({
    mutationKey:['coverImage'],
    mutationFn: mutationHandler,
    onSuccess:()=>{
      toggleEdit()
    },
    onSettled:(data)=>{
      setUpdatedCoverImageHash(data.data.coverImageHash)
      queryClient.invalidateQueries({queryKey:['events']})
    }
  })

  async function onFinish(field:any){

    // hash it first
    const logoRes = await field.coverImage

    setIsHashingImage(true)
    const logoHash = await asyncStore(logoRes[0].originFileObj)
    setIsHashingImage(false)


    const payload = {
      key:'cover_image_hash',
      value: logoHash,
      id: selectedRecord.id
    }
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
     name="EditableCoverImage"
     initialValues={selectedRecord}
     onFinish={onFinish}
     >

      <Row>
        <Col span={10}>
          <Form.Item
              name="coverImage"
              valuePropName="coverImage"
              getValueFromEvent={extractLogoImage}
              rules={[{ required: true, message: 'Please input a valid zip code' }]}
          >
              
              <Upload name="coverImageHash" listType="picture" multiple={false}>
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
    <div style={{width:'100%', display:'flex', marginTop:'2rem', flexDirection:'column'}}>
      <Text type="secondary" style={{ marginRight: '2rem',}}>Cover Image</Text>
      {isEditMode?editable:readOnly}
    </div>
  )
}

export function EditableDate({selectedRecord}:EditableProp){

    // console.log(selectedRecord.name)
    
    const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    const queryClient = useQueryClient()
  
  
  
  
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
   const urlPrefix = useUrlPrefix()
  
    const recordMutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/events`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const recordMutation = useMutation({
      mutationKey:['startTime'],
      mutationFn: recordMutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:()=>{
        queryClient.invalidateQueries({queryKey:['events']})
      }
    })
  
    function onFinish(updatedItem:any){
      const payload = {
        key:'start_time',
        value: updatedItem.startTime,
        id: selectedRecord.id
      }
  
      const updatedRecord = {
        ...selectedRecord,
        startTime: updatedItem.startTime
      }
      setState(updatedRecord)
      recordMutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = recordMutation ;
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{dayjs(state.startTime).tz("UTC").format('MMM DD, YYYY H A')}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )

  
  const convertedDate = dayjs(selectedRecord.startTime).tz("UTC").toISOString()
  // console.log(convertedDate)    
  console.log( dayjs(selectedRecord.startTime).utc().isValid())
   
    const editable = (  
      <Form
       style={{ marginTop:'.5rem' }} 
       name="editableDateAndTime"
       initialValues={{startTime: dayjs(selectedRecord.startTime).utc()}}  
       onFinish={onFinish}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
            <Form.Item
                name="startTime"
                rules={[{ required: true, message: 'This field is required' }]}
            >
                 <DatePicker  style={{ width: 300 }}  showTime placeholder="Select Date and Time"  format={'MMM DD, YYYY, H A'}  size="large" />
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
      <div style={{width:'100%', display:'flex', marginTop:'2rem', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Date and Time</Text>
      {isEditMode?editable:readOnly}
      </div>
    )
  }
export function EditableTimeZone({selectedRecord}:EditableProp){

    // console.log(selectedRecord.name)
    
    const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    const queryClient = useQueryClient()
  
  
  
  
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
   const urlPrefix = useUrlPrefix()
  
    const recordMutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/events`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const recordMutation = useMutation({
      mutationKey:['timeZone'],
      mutationFn: recordMutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:()=>{
        queryClient.invalidateQueries({queryKey:['events']})
      }
    })
  
    function onFinish(updatedItem:any){
      const payload = {
        key:'timeZone',
        value: updatedItem.timeZone,
        id: selectedRecord.id
      }
  
      const updatedRecord = {
        ...selectedRecord,
        timeZone: updatedItem.timeZone
      }
      setState(updatedRecord)
      recordMutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = recordMutation ;
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{state.timeZone}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editableTimeZone"
       initialValues={{timeZone: selectedRecord.timeZone}}
       onFinish={onFinish}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
            <Form.Item
                name="timeZone"
                rules={[{ required: true, message: 'This field is required' }]}
            >
                 <Select
                    // defaultValue="EST"
                    style={{ width: 120 }}
                    // onChange={handleChange}
                    options={[
                      { value: 'EST', label: 'EST' },
                      { value: 'EDT', label: 'EDT' },
                      { value: 'CST', label: 'CST' },
                      { value: 'CDT', label: 'CDT' },
                      { value: 'MST', label: 'MST' },
                      { value: 'PST', label: 'PST' },
                      { value: 'PDT', label: 'PDT' },
                      { value: 'AKST', label: 'AKST' },
                      { value: 'HST', label: 'HST' },
                      { value: 'AST', label: 'AST' },
                    ]}
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
      <div style={{width:'100%', display:'flex', marginTop:'2rem', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Time zone</Text>
      {isEditMode?editable:readOnly}
      </div>
    )
  }
export function EditableTickets({selectedRecord}:EditableProp){

    // console.log(selectedRecord.name)
    
    const [state, setState] = useState(selectedRecord)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    const queryClient = useQueryClient()
  
  
  
  
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
   const urlPrefix = useUrlPrefix()
  
    const recordMutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/events`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const recordMutation = useMutation({
      mutationKey:['totalTickets'],
      mutationFn: recordMutationHandler,
      onSuccess:()=>{
        toggleEdit()
      },
      onSettled:()=>{
        queryClient.invalidateQueries({queryKey:['events']})
      }
    })
  
    function onFinish(updatedItem:any){
      const payload = {
        key:'totalTickets',
        value: updatedItem.totalTickets,
        id: selectedRecord.id
      }
  
      const updatedRecord = {
        ...selectedRecord,
        totalTickets: updatedItem.totalTickets
      }
      setState(updatedRecord)
      recordMutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = recordMutation ;
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{state.totalTickets}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editableTickets"
       initialValues={{totalTickets: selectedRecord.totalTickets}}
       onFinish={onFinish}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
            <Form.Item
                name="totalTickets"
                rules={[{ required: true, message: 'This field is required' }]}
            >
                <Input  disabled={isEditing} placeholder=""/>
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
      <div style={{width:'100%', display:'flex', marginTop:'2rem', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Tickets</Text>
      {isEditMode?editable:readOnly}
      </div>
    )
  }

  interface EditableProp{
    selectedRecord: Event
  }
  export function EditableAddress({selectedRecord}:EditableProp){
    
    const [state, setState] = useState(selectedRecord.address.fullAddress)
  
    const [isEditMode, setIsEditMode] = useState(false)
  
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
  
    const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{state}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )
  
    return(
      <div style={{width:'100%', display:'flex', marginTop:'2rem', flexDirection:'column'}}>
        <Text type="secondary" style={{ marginRight: '2rem',}}>Address</Text>
        {isEditMode
        ?<AddressField currentFieldValue={state} updateState={setState} toggleEdit={toggleEdit} selectedRecord={selectedRecord}/>
        :readOnly
        }
      </div>
    )
  }
  
  interface AddressFieldProp{
    selectedRecord: Event
    toggleEdit: ()=>void,
    updateState: (value:any)=>void
    currentFieldValue: string
  }
  function AddressField({selectedRecord, currentFieldValue, toggleEdit,updateState}:AddressFieldProp){
  
    // const [isEditMode, setIsEditMode] = useState(false)
    const antInputRef = useRef();
    const [fullAddress, setFullAddress] = useState({
      latitude:0,
      longitude:0,
      placeId: '',
      street: '',
      fullAddress: '',
      state: '',
      country:'',
      city:''
  })
  
  const queryClient = useQueryClient()
  
  const urlPrefix = useUrlPrefix()
  
   const {paseto} = useAuthContext()
  
  
    const [form]  = Form.useForm()
  
    const extractFullAddress = (place:any)=>{
      const addressComponents = place.address_components 
            let addressObj = {
              state:'',
              country:'',
              city:'',
              street: '',
              latitude:place.geometry.location.lat(),
              longitude:place.geometry.location.lng()
          };
          addressComponents.forEach((address:any)=>{
            const type = address.types[0]
            if(type==='country') addressObj.country = address.long_name
            if(type==='route') addressObj.street = address.long_name
            if(type === 'locality') addressObj.state = address.short_name
            if(type === 'administrative_area_level_1') addressObj.city = address.short_name
        })
            return addressObj
  }
  
  const { ref: antRef } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_MAPS_AUTOCOMPLETE_API,  // move this key to env
    options:{
        componentRestrictions:{country:'us'},
        types: ['address'],
        fields: ['address_components','geometry','formatted_address','name', 'place_id']
    },
    onPlaceSelected: (place) => {
        // console.log(antInputRef.current.input)
        form.setFieldValue('street',place?.formatted_address)
  
        console.log(place)  
        
        const fullAddress = extractFullAddress(place)
        // add street address
        const addressWithStreet={
          ...fullAddress,
          placeId: place?.place_id,
          fullAddress: place?.formatted_address
      }
        setFullAddress(addressWithStreet)
  
        //@ts-ignore
      antInputRef.current.input.value = place?.formatted_address
  
    },
  });
  
  const mutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/events`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  
  const mutation = useMutation({
    mutationKey:['address'],
    mutationFn: mutationHandler,
    onSuccess:()=>{ 
      toggleEdit()
    },
    onSettled:(data)=>{
      updateState(data.data.address.fullAddress)
      queryClient.invalidateQueries(['events'])
    }
  })
  
  function onFinish(updatedItem:any){
  
  
    const payload = { 
      // communityId: currentCommunity.id,
      //@ts-ignore
      id: selectedRecord.id,
      // name: selectedRecord.name,
      key: 'address',
      value: JSON.stringify({
        street:fullAddress.street,
        fullAddress: fullAddress.fullAddress,
        city: fullAddress.city,
        country: fullAddress.country,
        placeId: fullAddress.placeId,
        state: fullAddress.state,
        latitude:String(fullAddress.latitude),
        longitude:String(fullAddress.longitude),
      })
    }
    // setState(updatedRecord)
    mutation.mutate(payload)
  }
  
  const {isLoading:isEditing} = mutation 
  
  
    return(
      <Form
       style={{ marginTop:'.5rem' }}
       name="editableAddress"
       initialValues={{street:currentFieldValue}}
       onFinish={onFinish}
       form={form}
       >
        <Row>
          <Col span={16} style={{height:'100%'}}>
          <Form.Item 
              name="street"
              rules={[{ required: true, message: 'Please input a valid address!' }]}
          >
             <Input allowClear  ref={(c) => {
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
  }
  
  


interface DeleteProp{
  selectedRecord: Event
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
      name="deleteEventForm" 
      layout='vertical'
      onFinish={onFinish}>
      <Form.Item
        name="name"
        style={{marginBottom:'.6rem'}}
        label={`Please type "${selectedRecord.name}" to confirm`}
        rules={[{ required: true, message: 'This field is required!' }]}
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




const filters = [
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
        <Text style={{textAlign:'center'}}>Oops! We have found no active communities in your organization</Text>
        <div style={{marginTop:'1rem', display:'flex',justifyContent:'center'}}>
            {children}
        </div>
      </div>
    </div>
  )
}




