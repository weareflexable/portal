import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const {Text,Title} = Typography
import React, { useEffect, useRef, useState } from 'react'
import {Typography,Button,Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Badge, Modal, Alert, notification} from 'antd'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined} from '@ant-design/icons'

import { useAuthContext } from '../../../context/AuthContext';
import { useServicesContext } from '../../../context/ServicesContext';
import {PlusOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import useUrlPrefix from "../../../hooks/useUrlPrefix";
import PlatformLayout from "../../Layout/PlatformLayout";
const {TextArea} = Input 





export default function ServiceItemTypesView(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)


    const [pageNumber, setPageNumber] = useState(0)

    const urlPrefix = useUrlPrefix()
  

    type ServiceType ={
      id: string,
      name: string
    }


    const [selectedServiceItemType, setSelectedServiceItemType] = useState<any|ServiceItemType>({})
    const [currentFilters, setCurrentFilters] = useState([])
    const [selectedFilter, setSelectedFilter] = useState<ServiceType>({id:'',name:''})
    const [showForm, setShowForm] = useState(false)

    async function fetchServiceType(){
      const res = await axios({
              method:'get',
              url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-types?pageNumber=1&pageSize=10  `,
              headers:{
                  "Authorization": paseto
              }
          })

          return res.data;
    }


    async function fetchServiceItemType(){
      const res = await axios({
              method:'get',
              url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-item-types?pageNumber=1&pageSize=10&key=service_type_id&value=${selectedFilter.id}`,
              headers:{
                  "Authorization": paseto
              }
          })

          return res.data;
    }

    const serviceTypesQuery = useQuery({queryKey:['service-types'], queryFn:fetchServiceType, enabled:paseto !== ''})

    useEffect(() => {
      if(serviceTypesQuery){
        console.log(serviceTypesQuery.data)
        setCurrentFilters(serviceTypesQuery.data && serviceTypesQuery.data.data)
      }
    }, [serviceTypesQuery])



    const serviceItemTypesQuery = useQuery({queryKey:['service-item-types',selectedFilter], queryFn:fetchServiceItemType, enabled:paseto !== '' && serviceTypesQuery.isFetched})

    function viewServiceItemTypeDetails(user:ServiceItemType){
      // set state
      setSelectedServiceItemType(user)
      // opne drawer
      setIsDrawerOpen(true)

    }
  
    
      const onMenuClick=(e:any, record:ServiceItemType) => {
        const event = e.key
        switch(event){
          // break;
          case 'viewDetails': viewServiceItemTypeDetails(record)
        }
      };
      
  
    const columns: ColumnsType<ServiceItemType> = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width:'250px',
        render:(_,record)=>{
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    {/* <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${record.profilePic}`}/> */}
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text>{record.name}</Text>  
                        {/* <Text type="secondary">{record.email}</Text>   */}
                    </div>
                </div>
            )
        },
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width:'200px',
        render: (status)=>{
          const statusText = status == 1 ? "Active": "In-active";
          return(
            <Badge status="success" text={statusText}/>
          )
        }
      },
    //   {
    //     title: 'Service type',
    //     dataIndex: 'serviceType',
    //     key:'serviceType',
    //     render:(_,record)=>{
    //         const serviceType = record.serviceType[0].name
    //         return(
    //             <Text>{serviceType}</Text>
    //         )
    //     }
    //   },

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
      width:'70px',
      render:(_,record)=>{
        // const items = getTableRecordActions()
        return (<Button type="text" icon={<MoreOutlined/>} onClick={()=>viewServiceItemTypeDetails(record)}/>)
      } 
    }
    ];

        return (
            <div>
                <div style={{marginBottom:'1.5em', display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                {serviceTypesQuery.isLoading
                ?<Text>Loading service-types ...</Text>
                :<Radio.Group defaultValue={selectedFilter!.id} style={{width:'100%'}} buttonStyle="solid">
                    {serviceTypesQuery.data && serviceTypesQuery.data && serviceTypesQuery.data.data.map((item:any)=>(
                        <Radio.Button key={item.id} onClick={()=>setSelectedFilter(item)} value={item.id}>{item.name}</Radio.Button>
                     )
                    )}
                </Radio.Group>}
                <div style={{width: "100%",display:'flex', justifyContent:'flex-end', alignItems:'center'}}>
                  <Button type='link' loading={serviceItemTypesQuery.isRefetching} onClick={()=>serviceItemTypesQuery.refetch()} icon={<ReloadOutlined />}>Refresh</Button>
                  <Button
                   disabled
                    type="primary"
                    onClick={() => {
                      setShowForm(true)
                    }}
                   >
                    Add new
                  </Button>
                </div>

                </div>
                <Table 
                style={{width:'100%'}}
                scroll={{ x: 'calc(500px + 50%)'}} 
                 key='dfadfe' 
                 loading={serviceItemTypesQuery.isLoading||serviceItemTypesQuery.isRefetching} 
                 columns={columns}  
                 dataSource={serviceItemTypesQuery && serviceItemTypesQuery.data && serviceItemTypesQuery.data.data || []}
                  />
                {
                  isDrawerOpen
                  ?<DetailDrawer isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedServiceItemType={selectedServiceItemType}/>
                  :null
                }

                <AddServiceItemTypeForm open={showForm} onCancel={()=>setShowForm(false)} />
            </div>
    )
}

// ServiceItemTypesView.PageLayout = PlatformLayout

interface ServiceItemTypeFormProps {
  open: boolean;
  onCreate?: (values:any) => void;
  onCancel: () => void; 
}

const AddServiceItemTypeForm: React.FC<ServiceItemTypeFormProps> = ({
  open,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const {paseto} = useAuthContext()
  const {currentService} = useServicesContext()

  const urlPrefix = useUrlPrefix()


  const createDataHandler = async(newItem:any)=>{
    const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-item-types`, newItem,{
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
    message = status == 0 ? `ServiceItemType could not be added because they aren't registered. A registration link has beens sent to ${user.email} to register and will be added automatically to as ${user.userRoleName} after registration`:`User has been added to service as a ${user.userRoleName}`
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
      title="Add a staff to your service"
      onCancel={onCancel}
      footer={null}

    >
      <Form
        form={form}
        layout="vertical"
        name="addServiceItemTypeForm"
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
  selectedServiceItemType: ServiceItemType,
  isDrawerOpen: boolean,
  closeDrawer: (value:boolean)=>void
}
function DetailDrawer({selectedServiceItemType,isDrawerOpen,closeDrawer}:DrawerProps){

const queryClient = useQueryClient()

const {currentUser,paseto} = useAuthContext()
const {currentService} = useServicesContext()
const urlPrefix = useUrlPrefix()

const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

function closeDrawerHandler(){
  queryClient.invalidateQueries(['users'])
  closeDrawer(!isDrawerOpen)
}

function toggleDeleteModal(){
  setIsDeleteModalOpen(!isDeleteModalOpen)
}

function deleteService(){ 
  console.log(selectedServiceItemType.id)
  // mutate record
  deleteMutation.mutate(selectedServiceItemType,{
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


const deleteDataHandler = async(record:ServiceItemType)=>{      
  const {data} = await axios({
    method:'delete',
    url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-item-types`,
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
<Drawer title={"ServiceItemType details"} width={640} placement="right" closable={true} onClose={closeDrawerHandler} open={isDrawerOpen}>
  
  <EditableRole selectedServiceItemType={selectedServiceItemType}/>

  
  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Title level={3}>Danger zone</Title>
    <Button danger onClick={toggleDeleteModal} style={{width:'30%'}} type="link">Remove staff</Button>
  </div>

  <DeleteRecordModal 
    isDeletingItem={deleteMutation.isLoading} 
    onCloseModal={toggleDeleteModal} 
    onDeleteRecord={deleteService} 
    isOpen={isDeleteModalOpen} 
    selectedServiceItemType={selectedServiceItemType}
  />

</Drawer>
)
}


interface EditableProp{
  selectedServiceItemType: ServiceItemType
}


function EditableRole({selectedServiceItemType}:EditableProp){

  const [state, setState] = useState(selectedServiceItemType)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  const urlPrefix = useUrlPrefix()


  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const [form]  = Form.useForm()



  const mutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-item-types`,updatedItem,{
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
      key:'name',
      value: String(updatedItem.name),
      id: selectedServiceItemType.id
    }
    const updatedRecord = {
      ...selectedServiceItemType,
      role: updatedItem.role
    }
    setState(updatedRecord)
    mutation.mutate(payload)
  }

  const {isLoading:isEditing} = mutation 

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{state.name}</Text>
      <Button type="link"
       onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.8rem' }}
     name="editableRole"
     initialValues={selectedServiceItemType}
     onFinish={onFinish}
     form={form}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
        <Form.Item 
            name="name"
            rules={[{ required: true, message: 'Please input a description for service item!' }]}
        >
            <Input/>
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
      <Text type="secondary" style={{ marginRight: '2rem',}}>ServiceItemType role</Text>
    {isEditMode?editable:readOnly}
    </div>
  )
}



interface DeleteProp{
  selectedServiceItemType: ServiceItemType
  isOpen: boolean
  onCloseModal: ()=>void
  onDeleteRecord: ()=>void
  isDeletingItem: boolean
}

function DeleteRecordModal({selectedServiceItemType, isOpen, isDeletingItem, onDeleteRecord, onCloseModal}:DeleteProp){

  function onFinish(){
    // call mutate function to delete record
    onDeleteRecord()
  }

  const [form] = Form.useForm()

  return(
    <Modal title="Are you absolutely sure?" footer={null} open={isOpen} onOk={()=>{}} onCancel={onCloseModal}>
      <Alert style={{marginBottom:'.5rem'}} showIcon message="Bad things will happen if you don't read this!" type="warning" />
      <Text >
        {`This action cannot be undone. This will permanently delete the ${selectedServiceItemType.name} service item, staff, bookings, and remove from listing on marketplace 
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
        label={`Please type "${selectedServiceItemType.name}" to confirm`}
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
              form.getFieldValue('name') !== selectedServiceItemType.name
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
    name:'Pending registration'
  }
]



type ServiceItemType = {
    name: string,
    id: string,
    createdAt: string,
    updatedAt: string,
    serviceTypeId: string,
    status: string,
    status_name: string
}


// const users:ServiceItemType[] = [
//     {
//         id: '34343',
//         name: 'Mujahid Bappai',
//         email: 'mujahid.bappai@yahoo.com',
//         mobileNumber: '08043437583',
//         gender: 'male',
//         createdAt: "2023-01-07T10:45:24.002929Z",
//         city: 'Kano',
//         country: 'Nigeria',
//         userRoleName: 'ServiceItemType',
//         profilePic: 'bafkreic3hz2mfy7rpyffzwbf2jfklehmuxnvvy3ardoc5vhtkq3cjd7of4'  
//     },
   
// ]