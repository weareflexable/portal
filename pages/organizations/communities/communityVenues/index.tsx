
import CommunitiesLayout from '../../../../components/shared/Layout/CommunitiesLayout'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../../../hooks/useOrgs";
const {Text,Title} = Typography
import React, { ReactNode, useRef, useState } from 'react'
import {Typography,Button,Table, InputRef, Input, Space, DatePicker, Radio, Drawer, Row, Col, Divider, Form, notification, Modal} from 'antd'
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


import { CommunityVenue, Address } from '../../../../types/CommunityVenue.types';
import useCommunity from '../../../../hooks/useCommunity';







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
    


    async function fetchAllCommunityVenues(){
    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community-venues?communityId=${currentCommunity.id}&pageNumber=${pageNumber}&pageSize=${pageSize}&status=${currentFilter.id}`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
   
    }
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
        mutationFn: changeCommunityVenueStatus,
        onSuccess:(data:any)=>{
            queryClient.invalidateQueries({queryKey:['serviceItems']})
        },
        onError:()=>{
            console.log('Error changing status')
        }
    })




    const communityVenuesQuery = useQuery({queryKey:['communityVenues', {currentSerive:currentCommunity.id, filter:currentFilter.id,pageNumber:pageNumber}], queryFn:fetchCommunityVenues, enabled:paseto !== ''})
    const res = communityVenuesQuery.data && communityVenuesQuery.data;
    const servicesData = res && res.data
    const totalLength = res && res.dataLength;

    const allCommunityVenuesQuery = useQuery({queryKey:['all-communityVenues',{currentCommunity: currentCommunity.id}], queryFn:fetchAllCommunityVenues, enabled:paseto !== '', staleTime:Infinity})
    const allCommunityVenuesLength = allCommunityVenuesQuery.data && allCommunityVenuesQuery.data.dataLength;
 


  
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


  const reactivateVenue = useMutation(reActivateCommunityVenueHandler,{
    onSettled:()=>{
      queryClient.invalidateQueries({queryKey:['serviceItems']})
    }
  })

    
    
  
    const columns: ColumnsType<CommunityVenue> = [
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
        width:'220px',
        render: (_,record)=>{
            return(
          <Text type="secondary">{record.promotion}</Text>
          )
      },
  },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        width:'220px',
        render: (_,record:any)=>{
            return(
          <Text type="secondary">{record.address.fullAddress}</Text>
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
          return <Button type="text" onClick={()=>viewDetails(record)} icon={<MoreOutlined/>}/> 
        }
      }
    }
    ];

        return (
            <div style={{background:'#f7f7f7', minHeight:'100vh'}}>
               { servicesData && allCommunityVenuesLength === 0  
               ? null 
               : <div style={{marginBottom:'1.5em', display:'flex', width:'100%', flexDirection:'column'}}>
                 <div style={{width:'100%',  marginBottom:'1rem', marginTop:'2rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <Title style={{margin: '0'}} level={2}>Community Venues</Title>
                      <div style={{display:'flex'}}>
                        <Button shape='round' style={{marginRight:'1rem'}} loading={communityVenuesQuery.isRefetching} onClick={()=>communityVenuesQuery.refetch()} icon={<ReloadOutlined />}>Refresh</Button>
                        <Button type="primary" onClick={()=>{router.push('/organizations/communities/communityVenues/new')}}   icon={<PlusOutlined/>} >Add Venue</Button>
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

                </div>}
                {
                  servicesData && allCommunityVenuesLength === 0
                  ?<EmptyState>
                    <Button type="primary" icon={<PlusOutlined/>} >Add Venue</Button>
                  </EmptyState>
                  :<Table 
                  style={{width:'100%'}} 
                  scroll={{ x: 'calc(500px + 50%)'}} 
                  rowKey={(record) => record.id}
                  pagination={{
                    total:totalLength,  
                    showTotal:(total) => `Total ${total} items`,
                  }} 
                  loading={communityVenuesQuery.isLoading || communityVenuesQuery.isRefetching} 
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

async function fetchItemAvailability(){
 const res = await axios.get(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community-venues/availability?key=service_item_id&value=${selectedRecord.id}&pageNumber=0&pageSize=10`,{
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

function deleteCommunityVenue(){ 
  console.log(selectedRecord.id)
  // mutate record
  deleteData.mutate(selectedRecord,{
    onSuccess:()=>{
      toggleDeleteModal()
      closeDrawerHandler()
    }
  })
}

const deleteDataHandler = async(record:CommunityVenue)=>{      
  const {data} = await axios({
    method:'patch',
    url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/community-venues`,
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
    options = {{queryKey:'serviceItems',mutationUrl:'community-venues'}}
  />
  {/* <EditableDescription selectedRecord={selectedRecord}/> */}

  {/* <EditableText
    fieldKey="tickets_per_day" // The way the field is named in DB
    currentFieldValue={selectedRecord.name}
    fieldName = 'name'
    title = 'Name'
    id = {selectedRecord.id}
    options = {{queryKey:'communityVenues',mutationUrl:'community-venues'}}
  /> */}


  {/* <Text>CUSTOM AVALABILITY</Text> */}
  <Title style={{marginTop:'3rem'}} level={3}>Custom Dates</Title>

  
  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Title level={3}>Danger zone</Title>
    <Button danger onClick={toggleDeleteModal} style={{width:'30%'}} type="link">Deactivate Service </Button>
  </div>

  {/* <DeleteRecordModal isDeletingItem={isDeletingItem} onCloseModal={toggleDeleteModal} onDeleteRecord={deleteServiceItem} isOpen={isDeleteModalOpen} selectedRecord={selectedRecord}/> */}

  
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