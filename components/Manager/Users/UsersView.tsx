import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../../hooks/useOrgs";
const {Text} = Typography
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Badge} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';

import { useAuthContext } from '../../../context/AuthContext';
import { useServicesContext } from '../../../context/ServicesContext';
import {PlusOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { useOrgContext } from "../../../context/OrgContext";
import { asyncStore } from "../../../utils/nftStorage";
import { ServiceItem } from "../../../types/Services";
import { User } from "./Users.types";
const {TextArea} = Input





export default function UsersView(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()
    const router = useRouter()
    const {switchOrg} = useOrgs()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const [pageNumber, setPageNumber] = useState(0)
  
    // const isFilterEmpty = Object.keys(filteredInfo).length === 0;

    type DataIndex = keyof ServiceItem;

    const [selectedServiceItem, setSelectedServiceItem] = useState<any|ServiceItem>({})
    // const [currentFilter, setCurrentFilter] = useState({id:'1',name: 'Approved'})

    async function fetchUsers(){
    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/super-admin/users-list?&pageNumber=${pageNumber}&pageSize=10`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
   
    }

    function nextPage(){
      setPageNumber(pageNumber+1)
    }

    function prevPage(){
      setPageNumber(pageNumber-1)
    }

    
    function jumpToPage(pageNumber:number){
      setPageNumber(pageNumber)
    }

   

    async function changeServiceItemStatus({serviceItemId, statusNumber}:{serviceItemId:string, statusNumber: string}){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/service-items`,
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
            queryClient.invalidateQueries({queryKey:['users']})
        },
        onError:()=>{
            console.log('Error changing status')
        }
    })


  


    const bookingsQuery = useQuery({queryKey:['users'], queryFn:fetchUsers, enabled:paseto !== ''})
    const data = bookingsQuery.data && bookingsQuery.data.data


    console.log(data)
    
  
  
    // function getTableRecordActions(){
    //     switch(currentFilter.id){
    //         // 1 = approved
    //         case '1': return activeItemActions 
    //     }
    // }

    function viewOrgDetails(user:User){
      // set state
      setSelectedServiceItem(user)
      // opne drawer
      setIsDrawerOpen(true)

    }
  
    
      const onMenuClick=(e:any, record:User) => {
        const event = e.key
        switch(event){
          // break;
          case 'viewDetails': viewOrgDetails(record)
        }
      };
      
  
    const columns: ColumnsType<User> = [
      {
        title: 'User',
        dataIndex: 'name',
        key: 'name',
        render:(_,record)=>{
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    {/* <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${record.profilePic}`}/> */}
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`/favicon.ico`}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text>{record.name}</Text>  
                        <Text type="secondary">{record.email}</Text>  
                    </div>
                </div>
            )
        },
      },
      {
        title: 'Country',
        dataIndex: 'country',
        key: 'country',
        render: (_,record)=>(
          <div style={{display:'flex',flexDirection:'column'}}>
            <Text>{record.country}</Text>
            <Text type="secondary">{record.city}</Text>
          </div>
        )
      },
     
      {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
      },
      {
        title: 'Phone',
        dataIndex: 'mobileNumber',
        key: 'mobileNumber',
      },
      {
        title: 'Role',
        dataIndex: 'userRoleName',
        key: 'userRoleName',
      },

      {
        title: 'User Type',
        dataIndex: 'userType',
        key: 'userType',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status)=>{
          const statusText = status? "Active": "In-active";
          return(
            <Badge status="success" text={statusText}/>
          )
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
          title: 'UpdatedAt',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
          render: (_,record)=>{
              const date = dayjs(record.updatedAt).format('MMM DD, YYYY')
              return(
            <Text>{date}</Text>
            )
        },
    },

    // {
    //   dataIndex: 'actions', 
    //   key: 'actions',
    //   render:(_,record)=>{
    //     // const items = getTableRecordActions()
    //     return (
    //     <Dropdown menu={{  onClick: (e)=>onMenuClick(e,record) }}>
    //       <MoreOutlined />
    //       </Dropdown>)
    //   } 
    // }
    ];

        return (
            <div>
                <div style={{marginBottom:'1.5em', display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                {/* <Radio.Group defaultValue={currentFilter.id} buttonStyle="solid">
                    {serviceItemsFilters.map(filter=>(
                        <Radio.Button key={filter.id} onClick={()=>setCurrentFilter(filter)} value={filter.id}>{filter.name}</Radio.Button>
                     )
                    )}
                </Radio.Group> */}
                <div style={{width: "100%",display:'flex', marginTop:'2rem', justifyContent:'flex-end', alignItems:'center'}}>
                  <Button type='link' loading={bookingsQuery.isRefetching} onClick={()=>bookingsQuery.refetch()} icon={<ReloadOutlined />}>Refresh</Button>
                </div>

                </div>
                <Table style={{width:'100%'}} key='dfadfe' loading={bookingsQuery.isLoading||bookingsQuery.isRefetching} columns={columns}  dataSource={data} />
                {
                  isDrawerOpen
                  ?<DetailDrawer isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedServiceItem={selectedServiceItem}/>
                  :null
                }
            </div>
    )



}

interface DrawerProps{
  selectedServiceItem: ServiceItem,
  isDrawerOpen: boolean,
  closeDrawer: (value:boolean)=>void
}
function DetailDrawer({selectedServiceItem,isDrawerOpen,closeDrawer}:DrawerProps){

const queryClient = useQueryClient()

function closeDrawerHandler(){
  queryClient.invalidateQueries(['serviceItems'])
  closeDrawer(!isDrawerOpen)
}

return( 
<Drawer title="Organization Details" width={640} placement="right" closable={true} onClose={closeDrawerHandler} open={isDrawerOpen}>
  
  <EditableName selectedServiceItem={selectedServiceItem}/>
  <EditableDescription selectedServiceItem={selectedServiceItem}/>

  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Divider/>
    <Button danger type="link">De-activate service-item</Button>
    <Divider/>
  </div>

</Drawer>
)
}


interface EditableProp{
  selectedServiceItem: ServiceItem
}

function EditableName({selectedServiceItem}:EditableProp){

  const [state, setState] = useState(selectedServiceItem)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  const queryClient = useQueryClient()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }


  const nameMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/serviceItem`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const nameMutation = useMutation({
    mutationKey:['name'],
    mutationFn: nameMutationHandler,
    onSuccess:()=>{
      toggleEdit()
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      key:'name',
      value: updatedItem.name,
      serviceItemId: selectedServiceItem.id
    }
    const updatedOrg = {
      ...selectedServiceItem,
      name: updatedItem.name
    }
    setState(updatedOrg)
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
     initialValues={selectedServiceItem}
     onFinish={onFinish}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
          <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input a valid service name' }]}
          >
              <Input  disabled={isEditing} placeholder="Flexable serviceItem" />
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
function EditableDescription({selectedServiceItem}:EditableProp){

  const [state, setState] = useState(selectedServiceItem)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()


  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const [form]  = Form.useForm()

 


  const nameMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/serviceItem`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const nameMutation = useMutation({
    mutationKey:['description'],
    mutationFn: nameMutationHandler,
    onSuccess:()=>{
      toggleEdit()
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      key:'country',
      value: updatedItem.country,
      serviceItemId: selectedServiceItem.id
    }
    const updatedOrg = {
      ...selectedServiceItem,
      name: updatedItem.country
    }
    setState(updatedOrg)
    nameMutation.mutate(payload)
  }

  const {isLoading:isEditing} = nameMutation 

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{state.description}</Text>
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableAddress"
     initialValues={selectedServiceItem}
     onFinish={onFinish}
     form={form}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
        <Form.Item 
            name="description"
            rules={[{ required: true, message: 'Please input a description for service item!' }]}
        >
            <TextArea rows={3} placeholder='Best bars in syracuse'/>

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





// const serviceItemsFilters = [
//   {
//       id: '1',
//       name: 'Active'
//   },
//   {
//       id: '2',
//       name: 'In-active'
//   },
// ]

const activeItemActions = [
    {
        key: 'review',
        label: 'Review'
    },
    {
        key: 'viewDetails',
        label: 'View details'
    },

]



// const users:User[] = [
//     {
//         id: '34343',
//         name: 'Mujahid Bappai',
//         email: 'mujahid.bappai@yahoo.com',
//         mobileNumber: '08043437583',
//         gender: 'male',
//         createdAt: "2023-01-07T10:45:24.002929Z",
//         city: 'Kano',
//         country: 'Nigeria',
//         userRoleName: 'User',
//         profilePic: 'bafkreic3hz2mfy7rpyffzwbf2jfklehmuxnvvy3ardoc5vhtkq3cjd7of4'  
//     },
   
// ]