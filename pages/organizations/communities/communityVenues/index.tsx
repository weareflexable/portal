
import CommunitiesLayout from '../../../../components/Layout/CommunitiesLayout'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../../../hooks/useOrgs";
const {Text,Title} = Typography
import React, { ReactNode, useRef, useState } from 'react'
import {Typography,Button,Table, InputRef, Input, Space, DatePicker, Radio, Drawer, Row, Col, Divider, Form, notification, Modal, Popconfirm} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined,MinusCircleOutlined,PlusOutlined} from '@ant-design/icons'

import { useAuthContext } from '../../../../context/AuthContext';
import { useServicesContext } from '../../../../context/ServicesContext';
import dayjs from 'dayjs'
import  { ColumnsType, TableProps } from 'antd/lib/table';
import useUrlPrefix from "../../../../hooks/useUrlPrefix";
import useRole from "../../../../hooks/useRole";
import { EditableText } from "../../../../components/shared/Editables";


import { CommunityVenue, Address } from '../../../../types/CommunityVenue';
import useCommunity from '../../../../hooks/useCommunity';
import { usePlacesWidget } from 'react-google-autocomplete';

const {TextArea} = Input







function CommunityVenues(){

    const {paseto} = useAuthContext()
    const {currentCommunity} = useCommunity()
    const urlPrefix  = useUrlPrefix()
    const queryClient = useQueryClient()
    const router = useRouter()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
    // const isFilterEmpty = Object.keys(filteredInfo).length === 0;

    type DataIndex = keyof CommunityVenue;

    const [selectedRecord, setSelectedRecord] = useState<any|CommunityVenue>({})
    const [currentFilter, setCurrentFilter] = useState({id:'1',name: 'Active'})
    const [pageNumber, setPageNumber] = useState<number|undefined>(1)
    const [pageSize, setPageSize] = useState<number|undefined>(10)
    


    // async function fetchAllCommunityVenues(){
    // const res = await axios({
    //         method:'get',
    //         url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community-venues?communityId=${currentCommunity.id}&pageNumber=${pageNumber}&pageSize=${pageSize}&status=${currentFilter.id}`,
    //         headers:{
    //             "Authorization": paseto
    //         }
    //     })

    //     return res.data;
   
    // }
    async function fetchCommunityVenues(){
    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community-venues?communityId=${currentCommunity.id}&pageNumber=${pageNumber}&pageSize=${pageSize}&status=${currentFilter.id}`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
   
    }

   
    async function changeCommunityVenueStatus({serviceItemId, statusNumber}:{serviceItemId:string, statusNumber: string}){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community-venues`,
            data:{
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
        mutationFn: changeCommunityVenueStatus,
        onSuccess:(data:any)=>{
            queryClient.invalidateQueries({queryKey:['serviceItems']})
        },
        onError:()=>{
            console.log('Error changing status')
        }
    })




    const communityVenuesQuery = useQuery({queryKey:['community-venues', {currentSerive:currentCommunity.id, filter:currentFilter.id,pageNumber:pageNumber}], queryFn:fetchCommunityVenues, enabled:paseto !== ''})
    const res = communityVenuesQuery.data && communityVenuesQuery.data;
    const servicesData = res && res.data
    const totalLength = res && res.dataLength;

    // const allCommunityVenuesQuery = useQuery({queryKey:['all-communityVenues',{currentCommunity: currentCommunity.id}], queryFn:fetchAllCommunityVenues, enabled:paseto !== '', staleTime:Infinity})
    // const allCommunityVenuesLength = allCommunityVenuesQuery.data && allCommunityVenuesQuery.data.dataLength;
 


  
    const handleChange: TableProps<CommunityVenue>['onChange'] = (data) => {
      setPageSize(data.pageSize)
      //@ts-ignore
      setPageNumber(data.current); // Subtracting 1 because pageSize param in url starts counting from 0
    };
  
 
    function viewDetails(serviceItem:CommunityVenue){
      // set state
      setSelectedRecord(serviceItem)
      // opne drawer
      setIsDrawerOpen(true)

    }
  
    async function reActivateCommunityVenueHandler(record:CommunityVenue){
      const res = await axios({
          method:'patch',
          url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community-venues`,
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


  const reactivateVenue = useMutation(reActivateCommunityVenueHandler,{
    onSettled:()=>{
      queryClient.invalidateQueries({queryKey:['community-venues']})
    }
  })

    
    
  
    const columns: ColumnsType<CommunityVenue> = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width:'220px',
        ellipsis:true,
        fixed:'left',
        render:(_,record)=>{
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text style={{textTransform:'capitalize'}}>{record.name}</Text>  
                    </div>
                </div>
            )
        },
      },
      
      {
        title: 'Promotion',
        dataIndex: 'promotion',
        key: 'promotion',
        width:'270px',
        render: (_,record)=>{
            return(
          <Text >{record.promotion}</Text>
          )
      },
  },
  {
    title: 'Market Value',
    dataIndex: 'marketValue',
    key: 'marketValue',
    width:'100px',
    render: (marketValue)=>(
      <div>
        <Text>$</Text>
        <Text>{marketValue/100}</Text>
      </div>
    )
  },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        width:'220px',
        render: (_,record:any)=>{
            return(
          <Text >{record.address.fullAddress}</Text>
          )
      },
  },
          
      {
          title: 'Created On',
          dataIndex: 'createdAt',
          key: 'createdAt',
          fixed:'right',
          width:'120px',
          render: (_,record)=>{
              const date = dayjs(record.createdAt).format('MMM DD, YYYY')
              return(
            <Text type="secondary">{date}</Text>
            )
        },
    },
      
    {
      dataIndex: 'actions', 
      key: 'actions',
      fixed:'right',
      width:currentFilter.name === 'In-active'?'150px':'70px',
      //@ts-ignore
      render:(_,record:Service)=>{
        if(currentFilter.name === 'In-active'){
          return (<Button   onClick={()=>reactivateVenue.mutate(record)}>Reactivate</Button>)
        }else{
          return <Button type="text" onClick={()=>viewDetails(record)} icon={<MoreOutlined rev={undefined}/>}/> 
        }
      }
    }
    ];

        return (
            <div style={{background:'#f7f7f7', minHeight:'100vh'}}>
               {/* { servicesData && allCommunityVenuesLength === 0  
               ? null 
               : */}
                <div style={{marginBottom:'1.5em', display:'flex', width:'100%', flexDirection:'column'}}>
                 <div style={{width:'100%',  marginBottom:'1rem', marginTop:'2rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <Title style={{margin: '0'}} level={2}>Community Venues</Title>
                      <div style={{display:'flex'}}>
                        <Button shape='round' style={{marginRight:'1rem'}} loading={communityVenuesQuery.isRefetching} onClick={()=>communityVenuesQuery.refetch()} icon={<ReloadOutlined rev={undefined} />}>Refresh</Button>
                        <Button type="primary" onClick={()=>{router.push('/organizations/communities/communityVenues/new')}}   icon={<PlusOutlined rev={undefined}/>} >Add Venue</Button>
                      </div>
                    </div>
                  <Radio.Group defaultValue={currentFilter.id} buttonStyle="solid">
                        {filters.map(filter=>(
                            <Radio.Button key={filter.id} onClick={()=>setCurrentFilter(filter)} value={filter.id}>{filter.name}</Radio.Button>
                        )
                        )}
                  </Radio.Group>

                <div style={{width: "20%",display:'flex', justifyContent:'space-between', alignItems:'center'}}>

                  {/* <Dropdown.Button trigger={['click']} type="primary"   icon={<PlusOutlined/>} menu={{ items, onClick: (item)=>onLaunchButtonClick(item) }}>Launch New ...</Dropdown.Button> */}
                </div>

                </div>
                {/* } */}

                {/* {
                  servicesData && allCommunityVenuesLength === 0
                  ?<EmptyState>
                    <Button type="primary" onClick={()=>{router.push('/organizations/communities/communityVenues/new')}} icon={<PlusOutlined rev={undefined}/>} >Add Venue</Button>
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
                  loading={communityVenuesQuery.isLoading || communityVenuesQuery.isRefetching} 
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


CommunityVenues.PageLayout = CommunitiesLayout

export default CommunityVenues

interface DrawerProps{
  selectedRecord: CommunityVenue,
  isDrawerOpen: boolean,
  closeDrawer: (value:boolean)=>void
}
function DetailDrawer({selectedRecord,isDrawerOpen,closeDrawer}:DrawerProps){

const queryClient = useQueryClient()

const {paseto} = useAuthContext()

const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

 const [isEditAvailability, setIsEditAvailability] = useState(false)

 const urlPrefix = useUrlPrefix()






function closeDrawerHandler(){
  queryClient.invalidateQueries(['serviceItems'])
  closeDrawer(!isDrawerOpen)
}

function toggleDeleteModal(){
  setIsDeleteModalOpen(!isDeleteModalOpen)
}

function deactivateCommunityVenue(){ 
  // mutate record
  deactivateVenue.mutate(selectedRecord,{
    onSuccess:()=>{
      toggleDeleteModal()
      closeDrawerHandler()
    }
  })
}

function deleteCommunityVenue(){ 
  // mutate record
  deleteData.mutate(selectedRecord,{
    onSuccess:()=>{
      toggleDeleteModal()
      closeDrawerHandler()
    }
  })
}

const deactivateDataHandler = async(record:CommunityVenue)=>{      
  const {data} = await axios({
    method:'patch',
    url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community-venues`,
    data: {
        id:record.id,
        status: '0'
      },
    headers:{
          "Authorization": paseto
  }})
  return data
}
const deleteDataHandler = async(record:CommunityVenue)=>{      
  const {data} = await axios({
    method:'delete',
    url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community-venues`,
    data: {
        id:record.id,
      },
    headers:{
          "Authorization": paseto
  }})
  return data
}

const deactivateVenue = useMutation(deactivateDataHandler,{
 onSuccess:(data)=>{
  notification['success']({
      message: 'Successfully deactivate venue'
  })
    // remove from list  
 },
 onSettled:()=>{
  queryClient.invalidateQueries(['community-venues'])
 },
  onError:(err:any)=>{
      console.log(err)
      notification['error']({
          message: err.message,
        });
      // leave modal open
  } 
})
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

const {isLoading:isDeactivating} = deactivateVenue

const{isLoading:isDeletingItem} = deleteData

return( 
<Drawer title="Community Venue Details" width={640} placement="right" closable={true} onClose={closeDrawerHandler} open={isDrawerOpen}>
  
{/* <EditableText
    fieldKey="name" // The way the field is named in DB
    currentFieldValue={selectedRecord.name}
    fieldName = 'name'
    title = 'Name'
    id = {selectedRecord.id}
    options = {{queryKey:'community-venues',mutationUrl:'community-venues'}}
  /> */}
  <EditableName selectedRecord={selectedRecord}/>
  <EditablePromotion selectedRecord={selectedRecord}/>
  <EditableAddress selectedRecord={selectedRecord}/>
  <EditableMarketValue selectedRecord={selectedRecord}/>
  <EditablePhone selectedRecord={selectedRecord}/>



  
  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Title level={3}>Danger zone</Title>
    {/* <Popconfirm
    title="Deactivate Community Venue"
    description="Are you sure to deactivate this community venue?"
    okText="Yes"
    onConfirm={()=>deactivateCommunityVenue()}
    cancelText="No"
  >
    <Button loading={isDeactivating}>Deactivate Community Venue </Button>
  </Popconfirm> */}
    <Button danger onClick={toggleDeleteModal} style={{marginTop:'1rem'}} >Deactivate Community Venue </Button>
  </div>

  <DeleteRecordModal isDeletingItem={isDeletingItem} onCloseModal={toggleDeleteModal} onDeleteRecord={deactivateCommunityVenue} isOpen={isDeleteModalOpen} selectedRecord={selectedRecord}/>

  
</Drawer>

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

interface EditableProp{
  selectedRecord: CommunityVenue
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
    <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
      <Text type="secondary" style={{ marginRight: '2rem',}}>Address</Text>
      {isEditMode
      ?<AddressField currentFieldValue={state} updateState={setState} toggleEdit={toggleEdit} selectedRecord={selectedRecord}/>
      :readOnly
      }
    </div>
  )
}

interface AddressFieldProp{
  selectedRecord: CommunityVenue
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
const {currentCommunity} = useCommunity()

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
  const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community-venues`,updatedItem,{
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
  onSuccess:(data:any)=>{
    updateState(data.data[0].address.fullAddress)
    toggleEdit()
  },
  onSettled:()=>{
    queryClient.invalidateQueries(['community-venues'])
  }
})

function onFinish(updatedItem:any){
  const payload = { 
    // communityId: currentCommunity.id,
    //@ts-ignore
    id: selectedRecord.id,
    address: {
      street:fullAddress.street,
      fullAddress: fullAddress.fullAddress,
      city: fullAddress.city,
      country: fullAddress.country,
      placeId: fullAddress.placeId,
      state: fullAddress.state,
      latitude:String(fullAddress.latitude),
      longitude:String(fullAddress.longitude),
    }
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

export function EditablePromotion({selectedRecord}:EditableProp){
  
  const [state, setState] = useState(selectedRecord)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const [form]  = Form.useForm()

  const queryClient = useQueryClient()

  const urlPrefix = useUrlPrefix()

  const recordMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community-venues`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }

  const recordMutation = useMutation({
    mutationKey:['promotion'],
    mutationFn: recordMutationHandler,
    onSuccess:(data:any)=>{
      setState(data.data[0])
      toggleEdit()
    },
    onSettled:()=>{
      queryClient.invalidateQueries(['community-venues'])
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      promotion: updatedItem.promotion,
      id: selectedRecord.id
    }
    // setState(updatedRecord)
    recordMutation.mutate(payload)
  }

  const {isLoading:isEditing} = recordMutation 

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{state.promotion}</Text>
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editablePromotion"
     initialValues={selectedRecord}
     onFinish={onFinish}
     form={form}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
        <Form.Item 
            name="promotion"
            rules={[{ required: true, message: 'Please input a promotion for the venue!' }]}
        >
            <TextArea rows={3} placeholder='What do you have to offer?'/>
 
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
      <Text type="secondary" style={{ marginRight: '2rem',}}>Promotion</Text>
    {isEditMode?editable:readOnly}
    </div>
  )
}
export function EditableName({selectedRecord}:EditableProp){
  
  const [state, setState] = useState(selectedRecord)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const [form]  = Form.useForm()

  const queryClient = useQueryClient()

  const urlPrefix = useUrlPrefix()

  const recordMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community-venues`,updatedItem,{
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
      setState(data.data[0])
      toggleEdit()
    },
    onSettled:()=>{
      queryClient.invalidateQueries(['community-venues'])
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      name: updatedItem.name,
      id: selectedRecord.id
    }
    // setState(updatedRecord)
    recordMutation.mutate(payload)
  }

  const {isLoading:isEditing} = recordMutation 

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{state.name}</Text>
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editablePromotion"
     initialValues={selectedRecord}
     onFinish={onFinish}
     form={form}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
        <Form.Item 
            name="name"
            rules={[{ required: true, message: 'Please input a name for the venue!' }]}
        >
            <TextArea rows={3} />
 
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
      <Text type="secondary" style={{ marginRight: '2rem',}}>Name</Text>
    {isEditMode?editable:readOnly}
    </div>
  )
}

export function EditableMarketValue({selectedRecord}:EditableProp){
  
  const [state, setState] = useState(selectedRecord.marketValue)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  const queryClient = useQueryClient()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }


 const urlPrefix = useUrlPrefix()

  const recordMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community-venues`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const recordMutation = useMutation({
    mutationKey:['marketValue'],
    mutationFn: recordMutationHandler,
    onSuccess:(data:any)=>{
      setState(data.data[0].marketValue)
      toggleEdit()
    },
    onSettled:(data)=>{
      queryClient.invalidateQueries(['community-venues'])
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      marketValue: String(updatedItem.marketValue*100),
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
     initialValues={{marketValue: state/100}}
     onFinish={onFinish}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
          <Form.Item
              name="marketValue"
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
      <Text type="secondary" style={{ marginRight: '2rem',}}>Market Value</Text>
    {isEditMode?editable:readOnly}
    </div>
  )
}

export function EditablePhone({selectedRecord}:EditableProp){
  

    const [state, setState] = useState(selectedRecord.contactNumber)

    const [isEditMode, setIsEditMode] = useState(false)
  
    const {paseto} = useAuthContext()
  
    const queryClient = useQueryClient()

    const urlPrefix = useUrlPrefix()
   
    function toggleEdit(){
      setIsEditMode(!isEditMode)
    }
  
    const readOnly = (
        <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <Text>{state}</Text>
          <Button type="link" onClick={toggleEdit}>Edit</Button>
        </div>
    )
  
    const nameMutationHandler = async(updatedItem:any)=>{
      const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community-venues`,updatedItem,{
        headers:{
            //@ts-ignore
            "Authorization": paseto
        }
      })
        return data;
    }
    const nameMutation = useMutation({
      mutationKey:['contactNumber'],
      mutationFn: nameMutationHandler,
      onSuccess:(data)=>{
         setState(data.data[0].contactNumber)
        toggleEdit()
        queryClient.invalidateQueries(['community-venues'])
      }
    })
  
    function onFinish(field:any){
      const payload = {
        // key:'contact_number',
        contactNumber: field.contactNumber,
        id: selectedRecord.id
      }
      console.log(payload)
      nameMutation.mutate(payload)
    }
  
    const {isLoading:isEditing} = nameMutation 
  
    const editable = (
      <Form
       style={{ marginTop:'.5rem' }}
       name="editableContactNumber"
       initialValues={selectedRecord}
       onFinish={onFinish}
       >
        <Row>
          <Col span={16}>
            <Form.Item
                name="contactNumber"
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
        <Text type="secondary" style={{ marginRight: '2rem',}}>Contact number</Text>
        {isEditMode?editable:readOnly}
      </div>
    )
  }





interface DeleteProp{
  selectedRecord: CommunityVenue
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
      name="deleteForm" 
      layout='vertical'
      onFinish={onFinish}>
      <Form.Item
        name="name"
        style={{marginBottom:'.6rem'}}
        label={`Please type "${selectedRecord.name}" to confirm`}
        rules={[{ required: true, message: 'Please type correct venue name' }]}
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
           I understand the consequences, remove venue
          </Button>
        )}
      </Form.Item>

    </Form>

  </Modal>
  )
}



interface Empty{
  children: ReactNode
} 

function EmptyState({children}:Empty){
  const router = useRouter()
  return(
    <div style={{border: '1px solid #d6d6d6', marginTop:'2rem', borderRadius:'4px', height:'50vh', display:'flex', justifyContent:'center', alignItems:'center', padding: '2rem'}}>
      <div style={{maxWidth:'300px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <Title level={3}>Get Started</Title> 
        <Text style={{textAlign:'center'}}>Add venues to your community?</Text>

          <div style={{marginTop:'1rem', display:'flex',justifyContent:'center'}}>
            {children}
          </div>
      </div>
    </div>
  )
}