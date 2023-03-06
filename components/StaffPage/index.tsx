import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const {Text,Title} = Typography
import React, { useRef, useState } from 'react'
import {Typography,Button,Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Badge, Modal, Alert, notification, Empty} from 'antd'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';

import { useAuthContext } from '../../context/AuthContext';
import { useServicesContext } from '../../context/ServicesContext';
import {PlusOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { Staff } from "../../types/Staff";
import useUrlPrefix from "../../hooks/useUrlPrefix";
import { useRouter } from "next/router";
const {TextArea} = Input





export default function StaffView(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()
    const {currentService} = useServicesContext()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)


    const [pageNumber, setPageNumber] = useState(0)
  


    type DataIndex = keyof Staff;

    const [selectedStaff, setSelectedStaff] = useState<any|Staff>({})
    const [currentFilter, setCurrentFilter] = useState({id:'1',name: 'Approved'})
    const [showForm, setShowForm] = useState(false)

    const urlPrefix = useUrlPrefix()

    async function fetchAllStaff(){
      const res = await axios({
              method:'get',
              url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/staff?key=service_id&value=${currentService.id}&pageNumber=${pageNumber}&pageSize=10`,
              headers:{
                  "Authorization": paseto
              }
          })

          return res.data;
    }
    async function fetchStaff(){
      const res = await axios({
              method:'get',
              url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/staff?key=service_id&value=${currentService.id}&pageNumber=${pageNumber}&pageSize=10&key2=status&value2=${currentFilter.id}`,
              headers:{
                  "Authorization": paseto
              }
          })

          return res.data;
    }


    // async function changeServiceItemStatus({serviceItemId, statusNumber}:{serviceItemId:string, statusNumber: string}){
    //     const res = await axios({
    //         method:'patch',
    //         url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/service-items`,
    //         data:{
    //             key:'status',
    //             value: statusNumber, // 0 means de-activated in db
    //             serviceItemId: serviceItemId 
    //         },
    //         headers:{
    //             "Authorization": paseto
    //         }
    //     })
    //     return res; 
    // }

    

    // const changeStatusMutation = useMutation(['data'],{
    //     mutationFn: changeServiceItemStatus,
    //     onSuccess:(data:any)=>{
    //         queryClient.invalidateQueries({queryKey:['users']})
    //     },
    //     onError:()=>{
    //         console.log('Error changing status')
    //     }
    // })

    

  


    const staffQuery = useQuery({queryKey:['staff',currentService.id,currentFilter.id], queryFn:fetchStaff, enabled:paseto !== ''})
    const data = staffQuery.data && staffQuery.data.data

    const allStaffQuery = useQuery({queryKey:['all-staff'], queryFn:fetchAllStaff, enabled:paseto !== '', staleTime:Infinity})
    const allStaffLength = allStaffQuery.data && allStaffQuery.data.dataLength



    
  
  
    // function getTableRecordActions(){
    //     switch(currentFilter.id){
    //         // 1 = approved
    //         case '1': return activeItemActions 
    //     }
    // }

    function viewStaffDetails(user:Staff){
      // set state
      setSelectedStaff(user)
      // opne drawer
      setIsDrawerOpen(true)

    }
  
    
      const onMenuClick=(e:any, record:Staff) => {
        const event = e.key
        switch(event){
          // break;
          case 'viewDetails': viewStaffDetails(record)
        }
      };
      
  
    const columns: ColumnsType<Staff> = [
      {
        title: 'Staff',
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
        title: 'Role',
        dataIndex: 'userRoleName',
        key: 'userRoleName',
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
          title: 'Created On',
          dataIndex: 'createdAt',
          key: 'createdAt',
          render: (_,record)=>{
              const date = dayjs(record.createdAt).format('MMM DD, YYYY')
              return(
            <Text>{date}</Text>
            )
        },
      },
    //   {
    //       title: 'UpdatedAt',
    //       dataIndex: 'updatedAt',
    //       key: 'updatedAt',
    //       render: (_,record)=>{
    //           const date = dayjs(record.updatedAt).format('MMM DD, YYYY')
    //           return(
    //         <Text>{date}</Text>
    //         )
    //     },
    // },

    {
      dataIndex: 'actions', 
      key: 'actions',
      render:(_,record)=>{
        // const items = getTableRecordActions()
        return (<Button icon={<MoreOutlined/>} onClick={()=>viewStaffDetails(record)}/>)
      } 
    }
    ];

        return (
            <div>
                {data && allStaffLength === 0 ? null : 
                <div style={{marginBottom:'1.5em', display:'flex', width:'100%', flexDirection:'column'}}>
                  <div style={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
                    <Title style={{margin:'0', width:'100%'}} level={2}>Staff</Title>
                    <div style={{width: "100%",display:'flex', marginTop:'1.5rem', justifyContent:'flex-end', alignItems:'center'}}>
                      <Button shape="round" style={{marginRight:'1rem'}} loading={staffQuery.isRefetching} onClick={()=>staffQuery.refetch()} icon={<ReloadOutlined />}>Refresh</Button>
                      <Button
                        type="primary"
                        icon={<PlusOutlined/>}
                        onClick={() => {
                          setShowForm(true)
                        }}
                      >
                        New Staff
                      </Button>
                    </div>
                  </div>
                  
                  <Radio.Group defaultValue={currentFilter.id} style={{width:'100%'}} buttonStyle="solid">
                      {staffFilter.map(filter=>(
                          <Radio.Button key={filter.id} onClick={()=>setCurrentFilter(filter)} value={filter.id}>{filter.name}</Radio.Button>
                      )
                      )}
                  </Radio.Group>
                  
                </div>
                }

                {
                  data && allStaffLength === 0
                  ? <EmptyState onOpenForm={()=>setShowForm(true)}/>
                  : <Table 
                      style={{width:'100%'}} 
                      key='dfadfe' 
                      loading={staffQuery.isLoading||staffQuery.isRefetching} 
                      columns={columns}  
                      dataSource={data} 
                    />
                }
                

                {
                  isDrawerOpen
                  ?<DetailDrawer isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedStaff={selectedStaff}/>
                  :null
                }

                <AddStaffForm open={showForm} onCancel={()=>setShowForm(false)} />
            </div>
    )
}


interface StaffFormProps {
  open: boolean;
  onCreate?: (values:any) => void;
  onCancel: () => void;
}

const AddStaffForm: React.FC<StaffFormProps> = ({
  open,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const {paseto} = useAuthContext()
  const {currentService} = useServicesContext()

  const urlPrefix = useUrlPrefix()

  const createDataHandler = async(newItem:any)=>{
    const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/staff`, newItem,{
        headers:{
            "Authorization": paseto
        },
    })
    if(data.status > 200){
      throw new Error(data.message)
    }
    return data
}

const queryClient = useQueryClient()

const createData = useMutation(createDataHandler,{
   onSuccess:(data)=>{
    let message;

    const user = data.data[0]
    const status = user.status
    message = status == 0 ? `Staff could not be added because they aren't registered. A registration link has beens sent to ${user.email} to register and will be added automatically to as ${user.userRoleName} after registration`:`User has been added to service as a ${user.userRoleName}`
    notification['success']({
        message: message,
      });
      onCancel()
   },
    onError:(data:any)=>{
      console.log(data)
        notification['error']({
            message:data.message ,
          });
        // leave modal open
    },
    onSettled:()=>{
      queryClient.invalidateQueries(['staff',currentService.id])
      queryClient.invalidateQueries(['all-staff'])
    }
})

const staffMutation = createData

function handleSubmit(formData:any){
  // console.log(formData)
  const payload = {
    ...formData,
    serviceId: currentService.id
  }
  // console.log(payload)
  createData.mutate(payload)
}

  return (
    <Modal
      open={open}
      title="Add staff to your venue"
      onCancel={onCancel}
      footer={null}

    >
      <Form
        form={form}
        layout="vertical"
        name="addStaffForm"
        onFinish={handleSubmit}
        initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          name="email"
          label="Email"
          extra={'Please be sure to provide an email of a registered user.'}
          style={{marginTop:'1rem'}}
          rules={[{ required: true, message: 'Please provide a valid email' }]}
        >
          <Input allowClear size="large" />
        </Form.Item>

        <Form.Item 
          name="role" 
          label="Role" 
          rules={[{ required: true, message: 'Please select a role' }]}
          >
          <Radio.Group>
            <Radio value="3">Supervisor</Radio>
            <Radio value="4">Employee</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item style={{marginTop:'4rem',marginBottom:'0'}}>
            <Space>
                <Button shape="round" onClick={()=>onCancel()} type='ghost'>
                    Cancel
                </Button>

                <Button shape="round" type="primary" size="large" loading={staffMutation.isLoading}  htmlType="submit" >
                    Add staff
                </Button>
            </Space>     
        </Form.Item>
      </Form>
    </Modal>
  );
};



interface DrawerProps{
  selectedStaff: Staff,
  isDrawerOpen: boolean,
  closeDrawer: (value:boolean)=>void
}
function DetailDrawer({selectedStaff,isDrawerOpen,closeDrawer}:DrawerProps){

const queryClient = useQueryClient()

const {currentUser,paseto} = useAuthContext()
const {currentService} = useServicesContext()

const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

function closeDrawerHandler(){
  queryClient.invalidateQueries(['users'])
  closeDrawer(!isDrawerOpen)
}

function toggleDeleteModal(){
  setIsDeleteModalOpen(!isDeleteModalOpen)
}

function deleteService(){ 
  console.log(selectedStaff.id)
  // mutate record
  deleteMutation.mutate(selectedStaff,{
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

const urlPrefix = useUrlPrefix()

const deleteDataHandler = async(record:Staff)=>{      
  const {data} = await axios({
    method:'delete',
    url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/staff`,
    data: {
        id:record.id,
        serviceId: currentService.id
      },
    headers:{
          "Authorization": paseto 
  }})
  return data
}

const deleteMutation = useMutation(deleteDataHandler)


return( 
<Drawer title={"Staff details"} width={640} placement="right" closable={true} onClose={closeDrawerHandler} open={isDrawerOpen}>
  
  <EditableRole selectedStaff={selectedStaff}/>

  
  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Title level={3}>Danger zone</Title>
    <Button danger onClick={toggleDeleteModal} style={{width:'30%'}} type="link">Remove staff</Button>
  </div>

  <DeleteRecordModal 
    isDeletingItem={deleteMutation.isLoading} 
    onCloseModal={toggleDeleteModal} 
    onDeleteRecord={deleteService} 
    isOpen={isDeleteModalOpen} 
    selectedStaff={selectedStaff}
  />

</Drawer>
)
}


interface EditableProp{
  selectedStaff: Staff
}


function EditableRole({selectedStaff}:EditableProp){

  const [state, setState] = useState(selectedStaff)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()


  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const [form]  = Form.useForm()

 const urlPrefix = useUrlPrefix()


  const mutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/staff`,updatedItem,{
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
    }
  })

  function onFinish(updatedItem:any){
    console.log(updatedItem)
    const payload = {
      key:'role',
      value: String(updatedItem.role),
      id: selectedStaff.id
    }
    const updatedRecord = {
      ...selectedStaff,
      role: updatedItem.role
    }
    setState(updatedRecord)
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
     initialValues={selectedStaff}
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
              <Radio value={3}>Supervisor</Radio>
              <Radio value={4}>Employee</Radio>
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
      <Text type="secondary" style={{ marginRight: '2rem',}}>Staff role</Text>
    {isEditMode?editable:readOnly}
    </div>
  )
}



interface DeleteProp{
  selectedStaff: Staff
  isOpen: boolean
  onCloseModal: ()=>void
  onDeleteRecord: ()=>void
  isDeletingItem: boolean
}

function DeleteRecordModal({selectedStaff, isOpen, isDeletingItem, onDeleteRecord, onCloseModal}:DeleteProp){

  function onFinish(){
    // call mutate function to delete record
    onDeleteRecord()
  }

  const [form] = Form.useForm()

  return(
    <Modal title="Are you absolutely sure?" footer={null} open={isOpen} onOk={()=>{}} onCancel={onCloseModal}>
      <Alert style={{marginBottom:'.5rem'}} showIcon message="Bad things will happen if you don't read this!" type="warning" />
      <Text >
        {`This action cannot be undone. This will permanently delete the ${selectedStaff.name} service item, staff, bookings, and remove from listing on marketplace 
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
        label={`Please type "${selectedStaff.name}" to confirm`}
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
              form.getFieldValue('name') !== selectedStaff.name
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







const staffFilter = [
  {
    id:'1',
    name:'Approved'
  },
  {
    id:'0',
    name:'Pending'
  }
]





// const users:Staff[] = [
//     {
//         id: '34343',
//         name: 'Mujahid Bappai',
//         email: 'mujahid.bappai@yahoo.com',
//         mobileNumber: '08043437583',
//         gender: 'male',
//         createdAt: "2023-01-07T10:45:24.002929Z",
//         city: 'Kano',
//         country: 'Nigeria',
//         userRoleName: 'Staff',
//         profilePic: 'bafkreic3hz2mfy7rpyffzwbf2jfklehmuxnvvy3ardoc5vhtkq3cjd7of4'  
//     },
   
// ]

interface EmptyProps{
  onOpenForm: ()=>void
}

function EmptyState({onOpenForm}:EmptyProps){

  return(
    <div style={{border: '1px solid #d6d6d6', marginTop:'2rem', borderRadius:'4px', height:'50vh', display:'flex', justifyContent:'center', alignItems:'center', padding: '2rem'}}>
      <div style={{maxWidth:'350px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <Title level={3}>Get Started</Title> 
        <Text style={{textAlign:'center'}}>Ready to get started listing your services on the Flexable Marketplace? The first step is to load in your organization’s details</Text>
        <Button size="large" type="primary" shape="round" icon={<PlusOutlined />} onClick={onOpenForm} style={{marginTop:'1rem'}}>Add your first staff</Button>
      </div>
    </div>
  )
}