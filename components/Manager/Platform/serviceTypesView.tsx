import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const {Text,Title} = Typography
import React, { useRef, useState } from 'react'
import {Typography,Button,Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Badge, Modal, Alert, notification} from 'antd'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';

import { useAuthContext } from '../../../context/AuthContext';
import { useServicesContext } from '../../../context/ServicesContext';
import {PlusOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import useUrlPrefix from "../../../hooks/useUrlPrefix";
import PlatformLayout from "../../Layout/PlatformLayout";
const {TextArea} = Input 





export default function ServiceTypesView(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()
    const {currentService} = useServicesContext()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)


    const [pageNumber, setPageNumber] = useState(0)
  
    const urlPrefix = useUrlPrefix()


    const [selectedServiceType, setSelectedServiceType] = useState<any|ServiceType>({})
    const [currentFilter, setCurrentFilter] = useState({id:'1',name: 'Active'})
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

    

  // console.log('current',currentService!.length!==0)
  // @ts-ignore


    const ServiceTypesQuery = useQuery({queryKey:['service-types',currentFilter.id], queryFn:fetchServiceType, enabled:paseto !== ''})


     

    function viewServiceTypeDetails(user:ServiceType){
      // set state
      setSelectedServiceType(user)
      // opne drawer
      setIsDrawerOpen(true)

    }
  
  
    const columns: ColumnsType<ServiceType> = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
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
        render: (status)=>{
          const statusText = status == 1 ? "Active": "In-active";
          return(
            <Badge status="success" text={statusText}/>
          )
        }
      },

      {
          title: 'Created On',
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

    // {
    //   dataIndex: 'actions', 
    //   key: 'actions',
    //   width:'70px',
    //   render:(_,record)=>{
    //     // const items = getTableRecordActions()
    //     return (<Button type="text" icon={<MoreOutlined rev={undefined}/>} onClick={()=>viewServiceTypeDetails(record)}/>)
    //   } 
    // }
    ];

        return (
            <div>
                <div style={{marginBottom:'1.5em', display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                {/* <Radio.Group defaultValue={currentFilter.id} style={{width:'100%'}} buttonStyle="solid">
                    {staffFilter.map(filter=>(
                        <Radio.Button key={filter.id} onClick={()=>setCurrentFilter(filter)} value={filter.id}>{filter.name}</Radio.Button>
                     )
                    )}
                </Radio.Group> */}
                <div style={{width: "100%",display:'flex', justifyContent:'flex-end', alignItems:'center'}}>
                  <Button type='link' loading={ServiceTypesQuery.isRefetching} onClick={()=>ServiceTypesQuery.refetch()} icon={<ReloadOutlined rev={undefined} />}>Refresh</Button>
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
                  loading={ServiceTypesQuery.isLoading||ServiceTypesQuery.isRefetching} 
                  // @ts-ignore 
                  columns={columns}  
                  dataSource={ServiceTypesQuery && ServiceTypesQuery.data && ServiceTypesQuery.data.data || []}
                />
                {
                  isDrawerOpen
                  ?<DetailDrawer isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedServiceType={selectedServiceType}/>
                  :null
                }

                <AddServiceTypeForm open={showForm} onCancel={()=>setShowForm(false)} />
            </div>
    )
}

ServiceTypesView.PageLayout = PlatformLayout

interface ServiceTypeFormProps {
  open: boolean;
  onCreate?: (values:any) => void;
  onCancel: () => void;
}

const AddServiceTypeForm: React.FC<ServiceTypeFormProps> = ({
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
    message = status == 0 ? `ServiceType could not be added because they aren't registered. A registration link has beens sent to ${user.email} to register and will be added automatically to as ${user.userRoleName} after registration`:`User has been added to service as a ${user.userRoleName}`
    notification['success']({
        message: message,
      });
      onCancel()
   },
    onError:(data:any)=>{
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
        name="addServiceTypeForm"
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
  selectedServiceType: ServiceType,
  isDrawerOpen: boolean,
  closeDrawer: (value:boolean)=>void
}
function DetailDrawer({selectedServiceType,isDrawerOpen,closeDrawer}:DrawerProps){

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
  // mutate record
  deleteMutation.mutate(selectedServiceType,{
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


const deleteDataHandler = async(record:ServiceType)=>{      
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
<Drawer title={"ServiceType details"} width={640} placement="right" closable={true} onClose={closeDrawerHandler} open={isDrawerOpen}>
  
  <EditableRole selectedServiceType={selectedServiceType}/>

  
  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Title level={3}>Danger zone</Title>
    <Button danger onClick={toggleDeleteModal} style={{width:'30%'}} type="link">Remove staff</Button>
  </div>

  <DeleteRecordModal 
    isDeletingItem={deleteMutation.isLoading} 
    onCloseModal={toggleDeleteModal} 
    onDeleteRecord={deleteService} 
    isOpen={isDeleteModalOpen} 
    selectedServiceType={selectedServiceType}
  />

</Drawer>
)
}


interface EditableProp{
  selectedServiceType: ServiceType
}


function EditableRole({selectedServiceType}:EditableProp){

  const [state, setState] = useState(selectedServiceType)

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
      id: selectedServiceType.id
    }
    const updatedRecord = {
      ...selectedServiceType,
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
     initialValues={selectedServiceType}
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
      <Text type="secondary" style={{ marginRight: '2rem',}}>ServiceType role</Text>
    {isEditMode?editable:readOnly}
    </div>
  )
}



interface DeleteProp{
  selectedServiceType: ServiceType
  isOpen: boolean
  onCloseModal: ()=>void
  onDeleteRecord: ()=>void
  isDeletingItem: boolean
}

function DeleteRecordModal({selectedServiceType, isOpen, isDeletingItem, onDeleteRecord, onCloseModal}:DeleteProp){

  function onFinish(){
    // call mutate function to delete record
    onDeleteRecord()
  }

  const [form] = Form.useForm()

  return(
    <Modal title="Are you absolutely sure?" footer={null} open={isOpen} onOk={()=>{}} onCancel={onCloseModal}>
      <Alert style={{marginBottom:'.5rem'}} showIcon message="Bad things will happen if you don't read this!" type="warning" />
      <Text >
        {`This action cannot be undone. This will permanently delete the ${selectedServiceType.name} service item, staff, bookings, and remove from listing on marketplace 
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
        label={`Please type "${selectedServiceType.name}" to confirm`}
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
              form.getFieldValue('name') !== selectedServiceType.name
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
    name:'Active'
  },
  {
    id:'0',
    name:'Inactive'
  }
]



type ServiceType = {
    name: string,
    id: string,
    createdAt: string,
    updatedAt: string,
    serviceTypeId: string,
    status: string,
    status_name: string
}


