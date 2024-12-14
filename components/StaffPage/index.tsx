import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const {Text,Title} = Typography
import React, { useEffect, useRef, useState } from 'react'
import {Typography,Button,Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Badge, Modal, Alert, notification, Empty, Tag, FormInstance} from 'antd'
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
import EventsLayout from "../Layout/EventsLayout";
import utils from "../../utils/env";
const {TextArea} = Input





export default function StaffView(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()
    const {currentService} = useServicesContext()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)


    const [pageNumber, setPageNumber] = useState<number|undefined>(1)
    const [pageSize, setPageSize] = useState<number|undefined>(10)
    
  


    type DataIndex = keyof Staff;

    const [selectedStaff, setSelectedStaff] = useState<any|Staff>({})
    const [currentFilter, setCurrentFilter] = useState({id:'1',name: 'Approved'})
    const [showForm, setShowForm] = useState(false)

    const urlPrefix = useUrlPrefix()

    async function fetchStaff(){
      const res = await axios({ 
              method:'get',
              url:`${utils.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/staff/service?serviceId=${currentService.id}&pageNumber=${pageNumber}&pageSize=10&status=${currentFilter.id}`,
              headers:{
                  "Authorization": paseto 
              } 
          })
          return res.data;
    }

    

  console.log('current',currentFilter)


    const staffQuery = useQuery({queryKey:['staff',currentFilter.id], queryFn:fetchStaff, enabled:paseto !== ''})
    
    const data = staffQuery.data && staffQuery.data.data
    const totalLength = staffQuery.data && staffQuery.data.dataLength;


    
    const handleChange: TableProps<Staff>['onChange'] = (data) => {
      setPageSize(data.pageSize)
      //@ts-ignore
      setPageNumber(data.current); // Subtracting 1 because pageSize param in url starts counting from 0
    };
  

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
        width:'350px',
        fixed:'left',
        ellipsis:true,
        render:(_,record)=>{
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    {/* <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`${utils.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${record.profilePic}`}/> */}
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
        dataIndex: 'staffRoleName',
        key: 'staffRoleName',

        render:(userRoleName)=>{
          const color = userRoleName === 'Manager' ? 'purple': userRoleName==='Admin'? 'volcano': userRoleName === 'Supervisor'?'cyan':'blue'
          return <Tag color={color}>{userRoleName}</Tag>
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
 
    {
      dataIndex: 'actions', 
      key: 'actions',
      width:'70px',
      fixed:'right',
      // width: currentFilter.name == 'pending'
      render:(_,record)=>{
        // const items = getTableRecordActions()
        return (<Button type="text" icon={<MoreOutlined rev={undefined}/>} onClick={()=>viewStaffDetails(record)}/>)
      } 
    }
    ];

        return (
            <div>
                {/* {data && allStaffLength === 0 ? null :  */}

                <div style={{marginBottom:'1.5em', display:'flex', width:'100%', flexDirection:'column'}}>
                  <div style={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
                  <Radio.Group defaultValue={currentFilter.id} style={{width:'100%'}} buttonStyle="solid">
                      {staffFilter.map(filter=>(
                          <Radio.Button key={filter.id} onClick={()=>setCurrentFilter(filter)} value={filter.id}>{filter.name}</Radio.Button>
                      )
                      )}
                  </Radio.Group>
                    <div style={{width: "100%",display:'flex', marginTop:'1.5rem', justifyContent:'flex-end', alignItems:'center'}}>
                      <Button shape="round" style={{marginRight:'1rem'}} loading={staffQuery.isRefetching} onClick={()=>staffQuery.refetch()} icon={<ReloadOutlined rev={undefined} />}>Refresh</Button>
                      <Button
                        type="primary"
                        icon={<PlusOutlined rev={undefined}/>}
                        onClick={() => {
                          setShowForm(true)
                        }}
                      >
                        New Staff
                      </Button>
                    </div>
                  </div>
                  
                </div>
                {/* } */}

                {/* {
                  data && allStaffLength === 0
                  ? <EmptyState onOpenForm={()=>setShowForm(true)}/>
                  :  */}
                  <Table 
                      style={{width:'100%'}} 
                      scroll={{ x: 'calc(500px + 50%)'}} 
                      rowKey={(record)=>record.id}
                      // @ts-ignore
                      onChange={handleChange} 
                      loading={staffQuery.isLoading||staffQuery.isRefetching} 
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
                  ?<DetailDrawer isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedStaff={selectedStaff}/>
                  :null
                }

                <AddStaffForm open={showForm} onCancel={()=>setShowForm(false)} />
            </div>
    )
}


StaffView.PageLayout = EventsLayout


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
    const {data} = await axios.post(`${utils.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/staff/service`, newItem,{
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

    const user = data?.data?.userDetails
    const status = user.status
    message =  !status ? data.message : status == 0 ? `Staff could not be added because they aren't registered. A registration link has beens sent to ${user.email} to register and will be added automatically to as ${user.staffRoleName} after registration`:`User has been added to service as a ${user.staffRoleName}`
    notification['success']({
        message: message,
        style:{
          width:600
        },
        duration:0
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
      // queryClient.invalidateQueries(['all-staff'])
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
          hasFeedback
          extra={'Please be sure to provide an email of a registered user.'}
          style={{marginTop:'1rem'}}
          rules={[{type:'email', message:'Please provide a valid email'},{ required: true, message: 'Please provide a valid email' }]}
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

                <SubmitButton
                  form={form}
                  isLoading={staffMutation.isLoading}
                />
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
  // mutate record
  deleteMutation.mutate(selectedStaff,{
    onSuccess:()=>{
      notification['success']({
        message: 'Successfully deleted record!'
      })
      toggleDeleteModal()
      closeDrawerHandler()

    },
    onSettled:()=>{
      queryClient.invalidateQueries(['staff'])
    },
    onError:(err)=>{
        console.log(err)
        notification['error']({
            message: 'Encountered an error while deleting record custom custom dates',
          });
    }
  })
}

const urlPrefix = useUrlPrefix()

const deleteDataHandler = async(record:Staff)=>{      
  const {data} = await axios({
    method:'delete',
    url:`${utils.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/staff/service`,
    data: {
        id:record.id,
        // serviceId: currentService.id
      },
    headers:{
          "Authorization": paseto 
  }})
  return data
}

const deleteMutation = useMutation(deleteDataHandler)

console.log(selectedStaff)


return( 
<Drawer title={"Staff details"} width={640} placement="right" closable={true} onClose={closeDrawerHandler} open={isDrawerOpen}>
  
  <EditableRadio
    id={selectedStaff.id}
    currentFieldValue = {selectedStaff.staffRoleName}
    fieldKey ='role'
    selectedItem={selectedStaff.role}
    fieldName="role"
    title = 'Staff Role'
    options ={{queryKey:'staff'}}
  /> 

  
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

interface EditableProps{
  id: string,
  selectedItem: string,
  currentFieldValue: string | undefined | number,
  fieldKey: string,
  fieldName: string
  title: string,
  options?:{queryKey:string,mutationUrl?:string}
}


export function EditableRadio({id, options, selectedItem, fieldName, currentFieldValue, fieldKey, title}:EditableProps){
  
  const [state, setState] = useState(currentFieldValue)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  const urlPrefix = useUrlPrefix()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

 const queryClient = useQueryClient()

  const mutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${utils.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/staff/service`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const mutation = useMutation({
    mutationFn: mutationHandler,
    onSuccess:()=>{
      toggleEdit()
    },
    onSettled:(data)=>{
      setState(data.data[0].userRoleName)
      queryClient.invalidateQueries({queryKey:[options?.queryKey]})
    }
  })

  function onFinish(formData:any){
    const payload = {
      // key:fieldKey,
      [fieldKey]: formData[fieldName],
      id: id
    }
    mutation.mutate(payload)
  }

  const {isLoading:isEditing} = mutation ;

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text style={{textTransform:'capitalize'}}>{state}</Text>
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     initialValues={{[fieldName]:selectedItem.toString()}}
     onFinish={onFinish} 
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
          <Form.Item 
              // label={title} 
              name={fieldName}
              rules={[{ required: true, message: 'Please select an accountType' }]}
              >
              <Radio.Group  size='large'>
                  <Radio.Button value="3">Supervisor</Radio.Button>
                  <Radio.Button value="4">Employee</Radio.Button>
              </Radio.Group>
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
      <Text type="secondary" style={{ marginRight: '2rem',}}>{title}</Text>
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
        label={`Please type "${selectedStaff.email}" to confirm`}
        rules={[{ required: true, message: 'Please type correct staff email' }]}
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
              form.getFieldValue('name') !== selectedStaff.email
              // !!form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
           I understand the consequences, remove staff
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
        <Button size="large" type="primary" shape="round" icon={<PlusOutlined rev={undefined} />} onClick={onOpenForm} style={{marginTop:'1rem'}}>Add your first staff</Button>
      </div>
    </div>
  )
}

interface SubmitButtonProps{
  isLoading: boolean,
  form: FormInstance
}


const SubmitButton = ({ form, isLoading }:SubmitButtonProps) => {
  const [submittable, setSubmittable] = useState(false);

  // Watch all values
  const values = Form.useWatch([], form);

  const router = useRouter() 

  useEffect(() => {
      

    form.validateFields({validateOnly:true}).then(
      (res) => {
          console.log('issubmittable',res)
        setSubmittable(true);
      },
      () => {
          console.log('isNot')
        setSubmittable(false);
      },
    );
  }, [values]);

  return (
      <Button shape="round" type="primary" disabled={!submittable} size="large" loading={isLoading}  htmlType="submit" >
      Add Staff
   </Button>
  );
};