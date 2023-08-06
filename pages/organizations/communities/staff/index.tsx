
import CommunitiesLayout from '../../../../components/Layout/CommunitiesLayout'



import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const {Text,Title} = Typography
import React, { useEffect, useRef, useState } from 'react'
import {Typography,Button,Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Badge, Modal, Alert, notification, Empty, Tag, FormInstance} from 'antd'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';

import { useAuthContext } from '../../../../context/AuthContext';
import { useServicesContext } from '../../../../context/ServicesContext';
import {PlusOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { Staff } from "../../../../types/Staff";
import useUrlPrefix from "../../../../hooks/useUrlPrefix";
import { useRouter } from "next/router";
import useCommunity from '../../../../hooks/useCommunity';
const {TextArea} = Input





function CommunityStaff(){

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

    const {currentCommunity} = useCommunity()

    const urlPrefix = useUrlPrefix()

    async function fetchAllStaff(){
      const res = await axios({
              method:'get',
              url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/staff/community?communityId=${currentCommunity.id}&pageNumber=${pageNumber}&pageSize=10`,
              headers:{
                  "Authorization": paseto
              }
          })

          return res.data;
    }
    async function fetchStaff(){
      const res = await axios({
              method:'get',
              url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/staff/community?communityId=${currentCommunity.id}&pageNumber=${pageNumber}&pageSize=10&status=${currentFilter.id}`,
              headers:{
                  "Authorization": paseto
              }
          })

          return res.data;
    }

    


    const staffQuery = useQuery({queryKey:['community-staff',currentCommunity.id,currentFilter.id], queryFn:fetchStaff, enabled:paseto !== ''})
    const data = staffQuery.data && staffQuery.data.data
    const totalLength = staffQuery.data && staffQuery.data.dataLength;

    const allStaffQuery = useQuery({queryKey:['all-community-staff'], queryFn:fetchAllStaff, enabled:paseto !== '', staleTime:Infinity})
    const allStaffLength = allStaffQuery.data && allStaffQuery.data.dataLength



    
    const handleChange: TableProps<Staff>['onChange'] = (data) => {
      setPageSize(data.pageSize)
      //@ts-ignore
      setPageNumber(data.current); // Subtracting 1 because pageSize param in url starts counting from 0
    };
  
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
        width:'350px',
        fixed:'left',
        ellipsis:true,
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
          width:'150px',
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
                {data && allStaffLength === 0 ? null : 
                <div style={{marginBottom:'1.5em', marginTop:'2rem', display:'flex', width:'100%', flexDirection:'column'}}>
                    <Title style={{margin:'0', width:'100%'}} level={2}>Staff</Title>
                  <div style={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
                        <Radio.Group defaultValue={currentFilter.id} style={{width:'100%'}} buttonStyle="solid">
                          {filters.map(filter=>(
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
                }

                {
                  data && allStaffLength === 0
                  ? <EmptyState onOpenForm={()=>setShowForm(true)}/>
                  : <Table 
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


CommunityStaff.PageLayout = CommunitiesLayout

export default CommunityStaff


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
  const {currentCommunity} = useCommunity()

  const urlPrefix = useUrlPrefix()

  const createDataHandler = async(newItem:any)=>{
    const {data} = await axios.post(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/staff/community`, newItem,{
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
    message = status == 0 ? `Staff could not be added because they aren't registered. A registration link has beens sent to ${user.email} to register and will be added automatically to as ${user.staffRoleName} after registration`:`User has been added to service as a ${user.staffRoleName}`
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
      console.log(data)
        notification['error']({
            message:data.message ,
          });
        // leave modal open
    },
    onSettled:()=>{
      queryClient.invalidateQueries(['community-staff',currentCommunity.id])
      queryClient.invalidateQueries(['all-community-staff'])
    }
})

const staffMutation = createData

function handleSubmit(formData:any){
  // console.log(formData)
  const payload = {
    ...formData,
    communityId: currentCommunity.id
  }
  // console.log(payload)
  createData.mutate(payload)
}

  return (
    <Modal
      open={open}
      title="Add staff to your community"
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
          rules={[{type:'email',message:'Please provide a valid email address'},{required: true, message: 'Please provide a valid email' }]}
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

const {currentCommunity} = useCommunity()

const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

function closeDrawerHandler(){
  queryClient.invalidateQueries(['users'])
  closeDrawer(!isDrawerOpen)
}

function toggleDeleteModal(){
  setIsDeleteModalOpen(!isDeleteModalOpen)
}

function deleteStaff(){ 
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
            message: 'Encountered an error while deleting staff',
          });
    }
  })
}

const urlPrefix = useUrlPrefix()

const deleteDataHandler = async(record:Staff)=>{      
  const {data} = await axios({
    method:'delete',
    url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/staff/community`,
    data: {
        id:record.id,
        communityId: currentCommunity.id
      },
    headers:{
          "Authorization": paseto 
  }})
  return data
}

const deleteMutation = useMutation(deleteDataHandler)


return( 
<Drawer title={"Staff details"} width={640} placement="right" closable={true} onClose={closeDrawerHandler} open={isDrawerOpen}>
  
  <EditableRadio
    id={selectedStaff.id}
    currentFieldValue = {selectedStaff.userRoleName}
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
    onDeleteRecord={deleteStaff} 
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
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/staff/community`,updatedItem,{
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
      key:fieldKey,
      value: formData[fieldName],
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
     initialValues={{[fieldName]:currentFieldValue}}
     onFinish={onFinish}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
          <Form.Item 
              // label={title} 
              name={fieldName}
              initialValue={{[fieldName]:selectedItem}}
              rules={[{ required: true, message: 'Please select an accountType' }]}
              >
              <Radio.Group defaultValue={selectedItem} size='large'>
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
      name="deleteStaffForm" 
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







const filters = [
  {
    id:'1',
    name:'Approved'
  },
  {
    id:'0',
    name:'Pending'
  }
]



interface EmptyProps{
  onOpenForm: ()=>void
}

function EmptyState({onOpenForm}:EmptyProps){

  return(
    <div style={{border: '1px solid #d6d6d6', marginTop:'2rem', borderRadius:'4px', height:'50vh', display:'flex', justifyContent:'center', alignItems:'center', padding: '2rem'}}>
      <div style={{maxWidth:'350px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <Title level={3}>Get Started</Title> 
        <Text style={{textAlign:'center'}}>Add staff to your community to help you manage it</Text>
        <Button size="large" type="primary" shape="round" icon={<PlusOutlined rev={undefined} />} onClick={onOpenForm} style={{marginTop:'1rem'}}>Add Staff</Button>
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