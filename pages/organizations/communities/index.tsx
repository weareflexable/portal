
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../../hooks/useOrgs";
const {Text, Title} = Typography;
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import {Typography,Button, Skeleton, Badge, Image, Table, Input, Radio,  Drawer, Row, Col, Form, Modal, Alert, notification, Dropdown, MenuProps, Tag, Space, Upload, Popover} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import { MoreOutlined, ReloadOutlined, ArrowLeftOutlined,CopyOutlined, PlusOutlined} from '@ant-design/icons'

import { useAuthContext } from '../../../context/AuthContext';
import { useServicesContext } from '../../../context/ServicesContext';
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { useOrgContext } from "../../../context/OrgContext";


import useUrlPrefix from "../../../hooks/useUrlPrefix";
import ServiceLayout from "../../../components/Layout/ServiceLayout";
import { Community } from "../../../types/Community";
import useCommunity from "../../../hooks/useCommunity";
import { EditableArtwork } from "../../../components/CommunityPage/Editables/Artwork";
import { uploadToPinata } from "../../../utils/nftStorage";
import { IMAGE_PLACEHOLDER_HASH } from "../../../constants";
import useRole from "../../../hooks/useRole";

const {TextArea} = Input

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)



function Communities(){

    const {paseto,currentUser} = useAuthContext()
    const {currentOrg} = useOrgContext() // coming from local storage
    const queryClient = useQueryClient()
    const router = useRouter()
    const {switchCommunity} = useCommunity()
    // const [items, setItems] = useState([])

    const isBankConnected = currentOrg?.isBankConnected


    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [pageNumber, setPageNumber] = useState<number|undefined>(1)
    const [pageSize, setPageSize] = useState<number|undefined>(10)

  

    const [selectedRecord, setSelectedRecord] = useState<any|Community>({})
    const [currentFilter, setCurrentFilter] = useState({id:'1',name: 'Active'})
    const [isHydrated, setIsHydrated] = useState(false)

   
   const urlPrefix = useUrlPrefix()


  
    async function fetchCommunities(){
      const res = await axios({
              method:'get',
              //@ts-ignore
              url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community?orgId=${currentOrg.orgId}&pageNumber=${pageNumber}&pageSize=${pageSize}&status=${currentFilter.id}`,

              headers:{
                  "Authorization": paseto
              }
          })

          return res.data.data;
    
    }

    async function reActivateCommunityHandler(record:Community){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community`,
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

    

    const reactivateCommunity = useMutation(reActivateCommunityHandler,{
      onSettled:()=>{
        queryClient.invalidateQueries({queryKey:['community']})
      }
    })

  

   
    // @ts-ignore
    const communityQuery = useQuery({queryKey:['community', currentOrg.orgId, currentFilter.name, pageNumber ], queryFn:fetchCommunities, enabled: paseto !== ''})
    const data = communityQuery.data && communityQuery.data
    // const totalLength = communityQuery.data && communityQuery.data;
    const totalLength = 0;



    const handleChange: TableProps<Community>['onChange'] = (data) => {
      setPageSize(data.pageSize)
      //@ts-ignore
      setPageNumber(data.current); // Subtracting 1 because pageSize param in url starts counting from 0
    };
  
   
function gotoCommunityItemsPage(community:Community){
  // switch org
  // get community switcher here
  switchCommunity(community)
  // navigate user to services page
  router.push('/organizations/communities/communityVenues') // 
}


    function viewCommunityDetails(service:Community){
      // set state
      setSelectedRecord(service)
      // opne drawer
      setIsDrawerOpen(true)

    }
  
    
      const onMenuClick=( record:Community) => {
        viewCommunityDetails(record)
        console.log('click', record);
      };

  
  
    const columns: ColumnsType<Community> = [
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
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${record.logoImageHash.length < 20? IMAGE_PLACEHOLDER_HASH :record.logoImageHash}`}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Button onClick={()=>gotoCommunityItemsPage(record)} type='link'>{record.name}</Button>  
                    </div>
                </div>
            )
        },
      },
      {
        title: 'Number of Venues',
        dataIndex: 'communityVenuesCount',
        key: 'communityVenuesCount',
        width:'100px',
      },
       {
        title: 'Platform Fee',
        dataIndex: 'platformFee',
        // hidden:true, 
        key: 'platformFee',
        width:'100px',
        render: (platformFee)=>(
          <div>
            {<Text>${platformFee}</Text>}
          </div>
        )
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
        title: 'Market Value',
        dataIndex: 'totalMarketValue',
        key: 'totalMarketValue',
        width:'100px',
        render: (totalMarketValue)=>(
          <div>
            <Text>$</Text>
            <Text>{totalMarketValue/100}</Text>
          </div>
        )
      },
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
      width:currentFilter.name === 'Inactive'?'150px':'50px',
      //@ts-ignore
      render:(_,record:Community)=>{
        if(currentFilter.name === 'Inactive'){
          return (<Button  onClick={()=>reactivateCommunity.mutate(record)}>Reactivate</Button>)
        }else{
          return <Button onClick= {()=>onMenuClick(record)} type="text" icon={<MoreOutlined rev={undefined}/>}/>
        }
      }
    }
    ];


    

        return (
            <div style={{background:'#f7f7f7', minHeight:'100vh'}}>
              <div style={{display:'flex', marginTop:'1rem', marginBottom:'1rem', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                 <Title style={{ margin:'0'}} level={2}>Communities</Title>
               </div>
                   {/* {allCommunitysQuery.data && allCommunitysLength === 0 
                   ? null 
                   :  */}
                   <div style={{marginBottom:'1.5em', display:'flex', width:'100%', flexDirection:'column'}}>
                    <div style={{width:'100%',  marginBottom:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        {/* filters */}
                        <Radio.Group defaultValue={currentFilter.id} buttonStyle="solid">
                          {filters.map((filter:any)=>(
                              <Radio.Button key={filter.id} onClick={()=>setCurrentFilter(filter)} value={filter.id}>{filter.name}</Radio.Button>
                          )
                          )}
                      </Radio.Group>
                      <div style={{display:'flex'}}>
                        <Button shape='round' style={{marginRight:'1rem'}} loading={communityQuery.isRefetching} onClick={()=>communityQuery.refetch()} icon={<ReloadOutlined rev={undefined} />}>Refresh</Button>
                        <Button  type="primary" onClick={()=>router.push('/organizations/communities/new')}  icon={<PlusOutlined rev={undefined}/>} >Launch Community</Button>
                      </div>
                    </div>
                     
                   </div>
                   {/* } */}
                
                {/* {
                  allCommunitysQuery.data && allCommunitysLength === 0
                  ? <EmptyState>
                      <Button type="primary"  onClick={()=>router.push('/organizations/communities/new')}  icon={<PlusOutlined rev={undefined}/>} >Launch Community</Button>
                  </EmptyState> 
                  : */}
                   <Table 
                      style={{width:'100%'}} 
                      scroll={{ x: 'calc(500px + 50%)'}} 
                      size='large' 
                      rowKey={(record)=>record.id}
                      // @ts-ignore 
                      onChange={handleChange} 
                      loading={communityQuery.isLoading || communityQuery.isRefetching} 
                      // @ts-ignore 
                      columns={columns} 
                      dataSource={data}
                      pagination={{
                        total:totalLength,  
                        showTotal:(total) => `Total: ${total} items`, 
                      }} 
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

export default Communities

Communities.PageLayout = ServiceLayout



interface DrawerProps{
  selectedRecord: Community,
  isDrawerOpen: boolean,
  closeDrawer: (value:boolean)=>void
}

function DetailDrawer({selectedRecord,isDrawerOpen,closeDrawer}:DrawerProps){

const queryClient = useQueryClient()
const router = useRouter()
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
const {currentOrg} = useOrgContext()

const isBankConnected = currentOrg?.isBankConnected

const {isManager, isSuperAdmin} = useRole()

const {switchCommunity} = useCommunity()
const {paseto} = useAuthContext()

const urlPrefix = useUrlPrefix()

function closeDrawerHandler(){
  queryClient.invalidateQueries(['community']) 
  closeDrawer(!isDrawerOpen)
}

function gotoCommunity(community:Community){
  switchCommunity(community)
  // navigate user to services page
  router.push('/organizations/communities/communityVenues')
}

function toggleDeleteModal(){
  setIsDeleteModalOpen(!isDeleteModalOpen)
}

function deleteCommunity(){ 

  // mutate record
  deleteData.mutate(selectedRecord,{
    onSuccess:()=>{
      notification['success']({
        message: 'Successfully deactivated community!'
      })
      queryClient.invalidateQueries(['community'])
      toggleDeleteModal()
      closeDrawerHandler()
    },
    onSettled:()=>{
      queryClient.invalidateQueries(['community'])
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


const deleteDataHandler = async(record:Community)=>{      
  const {data} = await axios({
    method:'patch',
    url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community`,
    data: {
        id:record.id,
        status: "0"
      },
    headers:{
          "Authorization": paseto 
  }})
  return data
}

const deleteData = useMutation(deleteDataHandler)

const{isLoading:isDeletingItem} = deleteData

  async function publishCommunityHandler(record:Community){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community`,
            data:{
                status: '1', 
                id: record.id  
            },
            headers:{
                "Authorization": paseto
            }
        })
        return res; 
    }


    const publishCommunity = useMutation(publishCommunityHandler,{
      onSettled:()=>{
        queryClient.invalidateQueries({queryKey:['community']})
      }
    })

function copyLink(selectedRecord:any){
  navigator.clipboard.writeText('')
  const eventId = selectedRecord.id
  const marketplaceLink = `https://marketplace.dev.flexabledats.com/communities/${eventId}`
   // Copy the text inside the text field
   navigator.clipboard.writeText(marketplaceLink);
}


return( 
<Drawer 
  title="Community Details" 
  width={640} placement="right" 
  extra={
  <Space>
  <Popover placement="bottom" content={'Copied!'} trigger="click">
    <Button size='large' disabled={!isBankConnected} icon={<CopyOutlined rev={undefined} />} onClick={()=>copyLink(selectedRecord)}>Copy Link</Button>
    </Popover>
    { !isBankConnected && selectedRecord?.status == 4
    ? <Button size='large' disabled={!isBankConnected} type="primary" loading={publishCommunity.isLoading} onClick={()=>publishCommunity.mutate(selectedRecord)}>Publish Community</Button>
    : <Button size='large' onClick={()=>gotoCommunity(selectedRecord)}>Visit Community</Button>
    }
    </Space>}
  closable={true} 
  onClose={closeDrawerHandler} 
  open={isDrawerOpen}
>
 {/* {!isBankConnected && selectedRecord?.status == 4
      ? <Alert
          style={{ marginBottom: '2rem' }}
          type="info"
          showIcon
          message='Connect account to publish'
          closable description='Your community will not be listed on marketplace because you are still yet to add a bank account. It will be saved as drafts until an account is linked to your profile.'
          action={
              <Button onClick={() => router.push('/organizations/billings')} size="small">
                  Add account
              </Button>
          }
      />
      : null
    } */}
  
  
  <EditableName selectedRecord={selectedRecord}/>
  <EditablePrice selectedRecord={selectedRecord}/>
  <EditableDescription selectedRecord={selectedRecord}/>
  <EditableArtwork selectedRecord={selectedRecord}/>
  <EditableLogoImage selectedRecord={selectedRecord}/>

  {isManager || isSuperAdmin ?<EditableCharge selectedRecord={selectedRecord}/>:null}

  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Title level={3}>Danger zone</Title>
    <Button danger onClick={toggleDeleteModal} style={{width:'30%'}} type="link">Deactivate Community</Button>
  </div>


  <DeleteRecordModal 
  isDeletingItem={isDeletingItem} 
  onCloseModal={toggleDeleteModal} 
  onDeleteRecord={deleteCommunity} 
  isOpen={isDeleteModalOpen} 
  selectedRecord={selectedRecord}
  />

</Drawer>
)
}

interface EditableProp{
  selectedRecord: Community
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
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community`,updatedItem,{
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
      queryClient.invalidateQueries(['community'])
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      // key:'description',
      description: updatedItem.description,
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
            rules={[{ required: true, message: 'Please input a description for your community!' }]}
        >
            <TextArea rows={3} placeholder='Tell us what your community is all about.'/>

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

export function EditableCharge({selectedRecord}:EditableProp){
  
  const [state, setState] = useState(selectedRecord.platformFee)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  const queryClient = useQueryClient()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

 const urlPrefix = useUrlPrefix()

  const recordMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const recordMutation = useMutation({
    mutationKey:['platformFee'],
    mutationFn: recordMutationHandler,
    onSuccess:()=>{
      toggleEdit()
    },
    onSettled:(data)=>{
      setState(data.data.platformFee)
      queryClient.invalidateQueries(['community'])
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      // key:'price',
      platformFee: String(updatedItem.platformFee),
      id: selectedRecord.id
    }
    recordMutation.mutate(payload)
  }

  const {isLoading:isEditing} = recordMutation ;

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{state}%</Text> 
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableCharge"
     initialValues={{platformFee: selectedRecord.platformFee}}
     onFinish={onFinish}
     >
      <Row>
        <Col span={10} style={{height:'100%'}}>
          <Form.Item
              name="platformFee"
              rules={[{ required: true, message: 'Please input a valid platform fee' }]}
          >
              <Input suffix='%'  disabled={isEditing} />
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
      <Title level={2} style={{ marginBottom:'.2rem', marginRight: '2rem',}}>Platform fee</Title>
      <Text style={{width:'75%', marginBottom:'2rem'}} type="secondary">This is the amount to charge for any ticket purchase on the marketplace</Text>  
        <div style={{ background:'#f5f5f5', padding:'1rem', width:'70%', borderRadius:'1rem'}}>
          {isEditMode?editable:readOnly} 
        </div>
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

 const urlPrefix = useUrlPrefix()

  const recordMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community`,updatedItem,{
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
      setState(data?.data?.price)
      queryClient.invalidateQueries(['community'])
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      // key:'price',
      price: String(updatedItem.price*100),
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
  
  const [state, setState] = useState(selectedRecord?.name)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  const queryClient = useQueryClient()


  const communityName = selectedRecord?.name;


  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

 const urlPrefix = useUrlPrefix()

  const recordMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community`,updatedItem,{
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
    onSuccess:(data:any)=>{
      toggleEdit()
      setState(data?.data?.name)
    }, 
    onSettled:()=>{
      queryClient.invalidateQueries(['community'])
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      name: updatedItem.name,
      id: selectedRecord.id
    }
    
    recordMutation.mutate(payload)
  }

  const {isLoading:isEditing} = recordMutation ;

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{state}</Text>
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableName"
     initialValues={{name: communityName}}
     onFinish={onFinish}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
          <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input a valid  name' }]}
          >
              <Input disabled={isEditing} placeholder="Flexable serviceItem"/>
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
  const [updatedLogoImageHash, setUpdatedLogoImageHash] = useState(selectedRecord.logoImageHash)


  const urlPrefix = useUrlPrefix()

  const {paseto} = useAuthContext()

  const queryClient = useQueryClient()

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
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community`,updatedItem,{
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
    },
    onSettled:(data)=>{
      setUpdatedLogoImageHash(data?.data?.logoImageHash)
      queryClient.invalidateQueries(['community'])
    }
  })

  async function onFinish(field:any){

    // hash it first
    const logoRes = await field.logoImage

    setIsHashingImage(true)
    const logoHash = await uploadToPinata(logoRes[0].originFileObj)
    setIsHashingImage(false)

    console.log(logoHash)

    const payload = {
      logoImageHash: logoHash,
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
              
              <Upload beforeUpload={()=>false} name="logoImageHash" listType="picture" multiple={false}>
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


interface DeleteProp{
  selectedRecord: Community
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
      name="deleteCommunityForm" 
      layout='vertical'
      onFinish={onFinish}>
      <Form.Item
        name="name"
        style={{marginBottom:'.6rem'}}
        label={`Please type "${selectedRecord.name}" to confirm`}
        rules={[{ required: true, message: 'Please type correct community name!' }]}
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
      name: 'Inactive'
  },
  {
      id: '4',
      name: 'Drafts'
  },
]






