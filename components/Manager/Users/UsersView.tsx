import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useOrgs from "../../../hooks/useOrgs";
const {Text,Title,Paragraph} = Typography
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Badge, Modal, Alert, notification} from 'antd'
import { useRouter } from 'next/router'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined,DashOutlined,MobileOutlined,LaptopOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';

import { useAuthContext } from '../../../context/AuthContext';
import { useServicesContext } from '../../../context/ServicesContext';
import {PlusOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { ServiceItem } from "../../../types/Services";
import { User } from "./Users.types";
import { IMAGE_PLACEHOLDER_HASH } from "../../../constants";
import { convertToAmericanFormat } from "../../../utils/phoneNumberFormatter";
import useUrlPrefix from "../../../hooks/useUrlPrefix";
import utils from "../../../utils/env";
const {TextArea} = Input





export default function UsersView(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient() 
    const router = useRouter()
    const {switchOrg} = useOrgs()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [pageNumber, setPageNumber] = useState<number|undefined>(1)
    const [pageSize, setPageSize] = useState<number|undefined>(10)
  
    const urlPrefix = useUrlPrefix()
    // const isFilterEmpty = Object.keys(filteredInfo).length === 0;

    type DataIndex = keyof ServiceItem;

    const [selectedUser, setSelectedServiceItem] = useState<any|ServiceItem>({})
    // const [currentFilter, setCurrentFilter] = useState({id:'1',name: 'Approved'})

    async function fetchUsers(){
    const res = await axios({
            method:'get',
            url:`${utils.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/users-list?status=1&pageNumber=${pageNumber}&pageSize=${pageSize}`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
   
    }

    const usersQuery = useQuery({queryKey:['users',pageNumber], queryFn:fetchUsers, enabled:paseto !== ''})
    const data = usersQuery.data && usersQuery.data.data
    const totalLength = usersQuery.data && usersQuery.data.dataLength;

    
  
  
    // function getTableRecordActions(){
    //     switch(currentFilter.id){
    //         // 1 = approved
    //         case '1': return activeItemActions 
    //     }
    // }

    function viewUserDetails(user:User){
      // set state
      setSelectedServiceItem(user)
      // opne drawer
      setIsDrawerOpen(true)

    }
  
    
      const onMenuClick=(e:any, record:User) => {
        const event = e.key
        switch(event){
          // break;
          case 'viewDetails': viewUserDetails(record)
        }
      };
      
      const handleChange: TableProps<User>['onChange'] = (data) => {
        console.log(data.current)
        setPageSize(data.pageSize)
        //@ts-ignore
        setPageNumber(data.current); // Subtracting 1 because pageSize param in url starts counting from 0
      };
    
  
    const columns: ColumnsType<User> = [
      {
        title: 'User',
        dataIndex: 'name',
        key: 'name',
        ellipsis:true, 
        fixed: 'left',
        width: '300px',
        render:(_,record)=>{
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    {/* <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`${utils.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${record.profilePic}`}/> */}
                    {/* <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`${utils.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${record.profilePic}`}/>     */}
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`${utils.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${record.profilePic.length < 10? IMAGE_PLACEHOLDER_HASH : record.profilePic}`}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text>{record.name}</Text>  
                        <Text type="secondary">{record.email}</Text>  
                    </div>
                </div>
            )
        },
      },
      {
        title: 'Wallet Address',
        dataIndex: 'walletaddress',
        key: 'walletaddress',
        width:'200px',
        render:(walletaddress)=>{ 

          return <Tag >
             <Paragraph style={{margin:'0'}} copyable={{ text: walletaddress }}>{`${walletaddress.substring(0,6)}....${walletaddress.slice(-4)}`}</Paragraph>
          </Tag>
        }
      },
      {
        title: 'Role',
        dataIndex: 'userRoleName',
        key: 'userRoleName',
        width:'120px',
        render:(userRoleName)=>{
          const color = userRoleName === 'Manager' ? 'purple': userRoleName==='Admin'? 'volcano': userRoleName === 'Supervisor'?'cyan': userRoleName === 'Superadmin'?'blue':'green'
          return <Tag color={color}>{userRoleName}</Tag>
        }
      },
      {
        title: 'Country',
        dataIndex: 'country',
        key: 'country',
        width:'150px',
        render: (_,record)=>{
          return record.country !== '' ? <Text style={{textTransform:'capitalize'}}>{record.country}</Text> : <DashOutlined rev={undefined}/>
          // <div style={{display:'flex',flexDirection:'column'}}>
          //   <Text>{record.country}</Text>
          //   {/* <Text type="secondary">{record.city}</Text> */}
          // </div>
        }
        
      },
     
      {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
        width:'100px',
        render: (gender)=>{

          return gender !== '' ? <Text>{gender}</Text> : <DashOutlined rev={undefined} />
        }
      },
      {
        title: 'Phone',
        dataIndex: 'contactNumber',
        key: 'contactNumber',
        width:'200px',
        render:(contactNumber)=>{
          return contactNumber !== ''? <Text>{convertToAmericanFormat(contactNumber)}</Text> : <DashOutlined rev={undefined}/>
        }
      },
      // {
      //   title: 'Wallet address',
      //   dataIndex: 'walletaddress',
      //   key: 'walletaddress',
      // },
     

      {
        title: 'Device Type',
        dataIndex: 'deviceType',
        key: 'deviceType',
        width:'120px',
        render: (deviceType)=>{
          const deviceIcon = deviceType === 'mobile' ? <MobileOutlined rev={undefined} /> : <LaptopOutlined rev={undefined} />
          return deviceType !== '' ? <Tag icon={deviceIcon} style={{textTransform:'capitalize'}}>{deviceType}</Tag> : <DashOutlined rev={undefined} />
        }
        
      },

      {
        title: 'User Type',
        dataIndex: 'userType',
        key: 'userType',
        width:'100px',
        render: (userType)=>{
          return userType !== '' ? <Tag style={{textTransform:'capitalize'}}>{userType}</Tag> : <DashOutlined rev={undefined} />
        }
        
      },
      // {
      //   title: 'Status',
      //   dataIndex: 'status',
      //   key: 'status',
      //   render: (status)=>{
      //     const statusText = status? "Active": "In-active";
      //     return(
      //       <Badge status="success" text={statusText}/>
      //     )
      //   }
      // },

      {
          title: 'Registered On',
          dataIndex: 'createdAt',
          key: 'createdAt',
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
      width:'70px',
      fixed: 'right',
      render:(_,record)=>{
        // const items = getTableRecordActions()
        return (<Button icon={<MoreOutlined rev={undefined}/>} type='text' onClick={()=>viewUserDetails(record)}/>)
      } 
    }
    ];

        return (
            <div>
                <div style={{marginBottom:'1.5rem', marginTop:'1rem', display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                {/* <Radio.Group defaultValue={currentFilter.id} buttonStyle="solid">
                    {serviceItemsFilters.map(filter=>(
                        <Radio.Button key={filter.id} onClick={()=>setCurrentFilter(filter)} value={filter.id}>{filter.name}</Radio.Button>
                     )
                    )}
                </Radio.Group> */}
                {/* <div style={{width: "100%",display:'flex', marginTop:'2rem', justifyContent:'flex-end', alignItems:'center'}}> */} 
                  <Title style={{margin:'0'}} level={2}>Users</Title>
                  <Button shape="round" loading={usersQuery.isRefetching} onClick={()=>usersQuery.refetch()} icon={<ReloadOutlined rev={undefined} />}>Refresh</Button>
                {/* </div> */}

                </div>
                <Table 
                  size="small"
                  scroll={{ x: 'calc(500px + 50%)'}} 
                  style={{width:'100%'}} 
                  key='dfadfe' 
                  pagination={{
                    total:totalLength,  
                    showTotal:(total) => `Total ${total} items`,
                  }} 
                  // @ts-ignore 
                  onChange={handleChange}
                  loading={usersQuery.isLoading||usersQuery.isRefetching} 
                  // @ts-ignore 
                  columns={columns}  
                  dataSource={data} 
                  />
                {
                  isDrawerOpen
                  ?<DetailDrawer isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedUser={selectedUser}/>
                  :null
                }
            </div>
    )



}

interface DrawerProps{
  selectedUser: User,
  isDrawerOpen: boolean,
  closeDrawer: (value:boolean)=>void
}
function DetailDrawer({selectedUser,isDrawerOpen,closeDrawer}:DrawerProps){

const queryClient = useQueryClient()

const {currentUser,paseto} = useAuthContext()

const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

const urlPrefix = useUrlPrefix()

function closeDrawerHandler(){
  closeDrawer(!isDrawerOpen)
}

function toggleDeleteModal(){
  setIsDeleteModalOpen(!isDeleteModalOpen)
}

function deleteService(){ 
  console.log(selectedUser.id)
  // mutate record
  deleteData.mutate(selectedUser,{
    onSuccess:()=>{
      notification['success']({
        message: 'Successfully blocked the user!'
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

// const urlPrefix = currentUser.role == 1 ? 'manager': 'admin'

const deleteDataHandler = async(record:User)=>{      
  const {data} = await axios({
    method:'patch',
    url:`${utils.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/users-role`,
    data: {
        targetUserId:record.id,
        // key:'status',
        status: "0"
      },
    headers:{
          "Authorization": paseto 
  }})
  return data
}

const deleteData = useMutation(deleteDataHandler)

const{isLoading:isDeletingItem} = deleteData

return( 
<Drawer title={"User details"} width={640} placement="right" closable={true} onClose={closeDrawerHandler} open={isDrawerOpen}>
  
  {/* <EditableName selectedUser={selectedUser}/> */}
  <EditableRole selectedUser={selectedUser}/>

  
  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Title level={3}>Danger zone</Title>
    <Button danger onClick={toggleDeleteModal} style={{width:'30%'}} type="link">Block user</Button>
  </div>

  <DeleteRecordModal 
    isDeletingItem={isDeletingItem} 
    onCloseModal={toggleDeleteModal} 
    onDeleteRecord={deleteService} 
    isOpen={isDeleteModalOpen} 
    selectedUser={selectedUser}
  />

</Drawer>
)
}


interface EditableProp{
  selectedUser: User
}


function EditableRole({selectedUser}:EditableProp){

  const [state, setState] = useState(selectedUser)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  const queryClient = useQueryClient()

  const urlPrefix = useUrlPrefix()


  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const [form]  = Form.useForm()

 


  const mutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${utils.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/users-role`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const mutation = useMutation({
    mutationKey:['role'],
    mutationFn: mutationHandler,
    onSuccess:()=>{
      toggleEdit()
    },
    onSettled:(data)=>{
      setState(data.data.target_user_details[0])
      queryClient.invalidateQueries(['users'])
      // update state here
      }
  })

  function onFinish(updatedItem:any){
    console.log(updatedItem)
    const payload = {
      role: String(updatedItem.role),
      targetUserId: selectedUser.id
    }
    const updatedRecord = {
      ...selectedUser,
      role: updatedItem.role
    }
    // setState(updatedRecord)
    mutation.mutate(payload)
  }

  const {isLoading:isEditing} = mutation 

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{state.userRoleName}</Text>
      <Button type="link"
       onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.8rem' }}    
     name="editableRole"
     initialValues={selectedUser}
     onFinish={onFinish}
     form={form}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
        <Form.Item 
            name="role"
            rules={[{ required: true, message: 'Please input a description for service item!' }]}
        >
          <Radio.Group >
            <Space direction="vertical">
              <Radio value={0}>Superadmin</Radio>
              <Radio value={1}>Manager</Radio>
              <Radio value={2}>Admin</Radio>
              <Radio value={3}>Supervisor</Radio>
              <Radio value={4}>Employee</Radio>
              <Radio value={5}>User</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        </Col>
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
      </Row>
           
    </Form>
  )
  return(
    <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
      <Text type="secondary" style={{ marginRight: '2rem',}}>User Role</Text>
    {isEditMode?editable:readOnly}
    </div>
  )
}



interface DeleteProp{
  selectedUser: User
  isOpen: boolean
  onCloseModal: ()=>void
  onDeleteRecord: ()=>void
  isDeletingItem: boolean
}

function DeleteRecordModal({selectedUser, isOpen, isDeletingItem, onDeleteRecord, onCloseModal}:DeleteProp){

  function onFinish(){
    // call mutate function to delete record
    onDeleteRecord()
  }

  const [form] = Form.useForm()

  return(
    <Modal title="Are you absolutely sure?" footer={null} open={isOpen} onOk={()=>{}} onCancel={onCloseModal}>
      <Alert style={{marginBottom:'.5rem'}} showIcon message="Bad things will happen if you don't read this!" type="warning" />
      <Text >
        {`This action cannot be undone. This will permanently delete ${selectedUser.name} from having access to everything on the platform
        `}
      </Text>

      <Form 
      form={form} 
      style={{marginTop:'1rem'}}
      name="deleteServiceForm" 
      layout='vertical'
      onFinish={onFinish}>
      <Form.Item
        name="email"
        style={{marginBottom:'.6rem'}}
        label={`Please type "${selectedUser.email}" to confirm`}
        rules={[{ required: true, message: 'Please type correct service item email!' }]}
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
              form.getFieldValue('email') !== selectedUser.email
              // !!form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
           I understand the consequences, block user
          </Button>
        )}
      </Form.Item>

    </Form>

  </Modal>
  )
}












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