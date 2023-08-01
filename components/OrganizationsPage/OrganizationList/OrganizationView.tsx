import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NewOrg } from "../../../types/OrganisationTypes";
import useOrgs from "../../../hooks/useOrgs";
const {Text,Title} = Typography

import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Modal, notification, Empty, Alert} from 'antd'
import { useRouter } from 'next/router'
import Highlighter from 'react-highlight-words'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';

import { useAuthContext } from '../../../context/AuthContext';
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { useOrgContext } from "../../../context/OrgContext";
import { asyncStore } from "../../../utils/nftStorage";
import { usePlacesWidget } from "react-google-autocomplete";
import useUrlPrefix from "../../../hooks/useUrlPrefix";
import { numberFormatter } from "../../../utils/numberFormatter";
import { convertToAmericanFormat } from "../../../utils/phoneNumberFormatter";
import { EditableText } from "../../shared/Editables";
import useRole from "../../../hooks/useRole";
import EmptyState from "../EmptyState";


var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime) 


export default function AdminOrgsView(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()
    const router = useRouter()
    const {switchOrg} = useOrgContext()
    const {isUser} = useRole()

    const [searchText, setSearchText] = useState('');
    const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
    const [searchedDate, setSearchedDate] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const ticketSearchRef = useRef(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [pageNumber, setPageNumber] = useState<number|undefined>(1)
    const [pageSize, setPageSize] = useState<number|undefined>(10)
  
    // const isFilterEmpty = Object.keys(filteredInfo).length === 0;

    type DataIndex = keyof NewOrg;

    const [selectedOrg, setSelelectedOrg] = useState<any|NewOrg>({})
    const [currentStatus, setCurrentStatus] = useState({id:'1',name: 'Approved'})

    const urlPrefix = useUrlPrefix()

    async function fetchAllOrgs(){
      const res = await axios({
              method:'get',
              url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/orgs?pageNumber=${pageNumber}&pageSize=10&key2=created_by`,
              headers:{
                  "Authorization": paseto
              }
          })
  
          return res.data;
     
      }

    async function fetchOrgs(){
        const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/orgs?key=status&value=${currentStatus.id}&pageNumber=${pageNumber}&pageSize=${pageSize}&key2=created_by`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
   
    }

   

    async function changeOrgStatus({orgId, statusNumber}:{orgId:string, statusNumber: string}){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org`,
            data:{
                key:'status',
                value: statusNumber, // 0 means de-activated in db
                id: orgId 
            },
            headers:{
                "Authorization": paseto
            }
        })
        return res; 
    }

   
    

    const changeStatusMutation = useMutation(['orgs'],{
        mutationFn: changeOrgStatus,
        onSuccess:(data:any)=>{
            queryClient.invalidateQueries({queryKey:['organizations',currentStatus]})
        },
        onError:()=>{
            console.log('Error changing status')
        }
    })


    function deActivateOrgHandler(org:NewOrg){
        // setSelelectedOrg(org.orgId)
        // @ts-ignore
        changeStatusMutation.mutate({orgId:org.orgId, statusNumber:'0'})
      }
      
    
 

    const orgQuery = useQuery({queryKey:['organizations', currentStatus], queryFn:fetchOrgs, enabled:paseto !== ''})
    const orgs = orgQuery.data && orgQuery.data.data
    // const data = servicesQuery.data && servicesQuery.data.data
    const totalLength = orgQuery.data && orgQuery.data.dataLength;

    const allOrgsQuery = useQuery({queryKey:['all-orgs'], queryFn:fetchAllOrgs, enabled:paseto !== '',staleTime:Infinity})
    const allOrgsTotal = allOrgsQuery.data && allOrgsQuery.data.dataLength;



  
    const handleSearch = (
      selectedKeys: string[],
      confirm: (param?: FilterConfirmProps) => void,
      dataIndex: DataIndex,
    ) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };
  
    const handleDateSearch = (
      selectedKeys: string[],
      confirm: (param?: FilterConfirmProps) => void,
      dataIndex: DataIndex,
    ) => {
      confirm();
      setSearchedDate(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };
  
    const clearFilters = () => {
      setFilteredInfo({});
    };
  
    const clearDateSearch = ()=>{
      setSearchedDate('') // convert to filter
    }
  
  
    const handleReset = (clearFilters: () => void) => {
      clearFilters();
      setSearchText('');
    };
  
    const handleDateReset = () => {
      clearDateSearch();
      setSearchedDate('');
    };
  
    const handleChange: TableProps<NewOrg>['onChange'] = (data) => {
      setPageSize(data.pageSize)
      //@ts-ignore
      setPageNumber(data.current); 
    };
  
    // const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<NewOrg> => ({
    //   filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
    //     <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
    //       <Input
    //         ref={searchInput}
    //         placeholder={`Search ${dataIndex}`}
    //         value={selectedKeys[0]}
    //         onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
    //         onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
    //         style={{ marginBottom: 8, display: 'block' }}
    //       />
    //       <Space>
    //         <Button
    //           type="primary"
    //           onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
    //           icon={<SearchOutlined />}
    //           size="small"
    //           shape='round'
    //           style={{ width: 90, display:'flex',alignItems:'center' }}
    //         >
    //           Search
    //         </Button>
            
    //         <Button
    //           onClick={() => clearFilters && handleReset(clearFilters)}
    //           size="small"
    //           shape='round'
    //           style={{ width: 90 }}
    //         >
    //           Reset
    //         </Button>
    //         <Button
    //           type="link"
    //           size="small"
    //           onClick={() => {
    //             confirm({ closeDropdown: false });
    //             setSearchText((selectedKeys as string[])[0]);
    //             setSearchedColumn(dataIndex);
    //           }}
    //         >
    //           Filter
    //         </Button>
    //         <Button
    //           type='link'
    //           danger
    //           size="small"
    //           onClick={() => {
    //             confirm({closeDropdown:true})
    //           }}
    //         >
    //           close
    //         </Button>
    //       </Space>
    //     </div>
    //   ),
    //   filterIcon: (filtered: boolean) => (
    //     <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    //   ),
    //   onFilter: (value, record) =>
    //     record[dataIndex]
    //       .toString()
    //       .toLowerCase()
    //       .includes((value as string).toLowerCase()),
    //   onFilterDropdownOpenChange: visible => {
    //     if (visible) {
    //       setTimeout(() => searchInput.current?.select(), 100);
    //     }
    //   },
    //   render: text =>{
    //     console.log('text',text)
    //     console.log('dataIndex',dataIndex)
    //     return searchedColumn === dataIndex ? (
    //       <Highlighter
    //         highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //         searchWords={[searchText]}
    //         autoEscape
    //         textToHighlight={text ? text.toString() : ''}
    //       />
    //     ) : (
    //       text
    //     )
    //   }
    // });
  
    const getTicketDateColumnSearchProps = (dataIndex: DataIndex): ColumnType<NewOrg> =>({
      filterDropdown:({ setSelectedKeys, selectedKeys, confirm, clearFilters})=>(
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <DatePicker 
            value={dayjs(selectedKeys[0])}
            onChange={e => setSelectedKeys([dayjs(e).format('MMM DD, YYYY')] )}  
            style={{ marginBottom: 8, display: 'block' }} 
            ref={ticketSearchRef}
            />
  
          <Space>
            <Button
              type="primary"
              onClick={() => handleDateSearch(selectedKeys as string[], confirm, dataIndex)}
              icon={<SearchOutlined rev={undefined} />}
              size="small"
              shape='round'
              style={{ width: 90, display:'flex',alignItems:'center' }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleDateReset()}
              size="small"
              shape='round'
              style={{ width: 90 }}
            >
              Reset
            </Button>
        
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({closeDropdown:true})
              }}
            >
              close
            </Button>
          </Space>
        </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} rev={undefined} />
    ),
    render: date =>{
      // console.log('searchedDate',searchedDate)
      // console.log('dataIndex',dataIndex)
       return searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchedDate]}
            autoEscape
            textToHighlight={date ? dayjs(date).format('MMM DD, YYYY') : ''}
          />
        ) : (
          dayjs(date).format('MMM DD, YYYY')
        )
    }
    })


    function viewOrgDetails(org:NewOrg){
      console.log(org)
      // set state
      setSelelectedOrg(org)
      // opne drawer
      setIsDrawerOpen(true)

    }
  
    function gotoServices(org:NewOrg){

      switchOrg(org)
      // navigate user to services page
      router.push('/organizations/venues/')
    }
    
    

  
    const columns: ColumnsType<NewOrg> = [
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
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${record.logoImageHash}`}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                       { record.status !==1?<Text>{record.name}</Text>:<Text style={{color:`${isUser?'black':'#1677ff'}`, cursor:'pointer'}} onClick={isUser?()=>{}:()=>gotoServices(record)}>{record.name}</Text> }   
                        <Text>{record.name}</Text>
                        <Text type="secondary">{record.email}</Text>
                    </div>
                </div>
            )
        },
        // ...getColumnSearchProps('name'),
      },
      {
        title: 'Address',
        // dataIndex: 'address',
        key: 'address',
        width:'370px',
        ellipsis:true,
        render:(_,record)=>(
          <div style={{display:'flex',flexDirection:'column'}}>
              <Text style={{textTransform:'capitalize'}}>{record.country}</Text>  
              <Text type="secondary">{record.street}</Text>
          </div>
        )
      },
      
      {
        title: 'Contact Number',
        dataIndex: 'contactNumber',
        key: 'contactNumber',
        width:'150px',
        render:(number)=>{
          const formattedNumber = convertToAmericanFormat(number)
          return <Text>{formattedNumber}</Text>
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
    {
      dataIndex: 'actions', 
      key: 'actions',
      fixed:'right',
      width: currentStatus.name !== 'Deactivated'?'70px':'150px',
      //@ts-ignore
      render:(_,record:NewOrg)=>{
        if(currentStatus.name !== 'Deactivated'){
          return (<Button type='text' onClick={()=>viewOrgDetails(record)} icon={<MoreOutlined rev={undefined}/>}/>)
        }else{
          return (<Button onClick={()=>reactivateOrg.mutate(record)}>Reactivate</Button>)
        }
      }
}
    ];

  
    async function reActivateOrgHandler(record:NewOrg){
      console.log(record)
      const res = await axios({
          method:'patch',
          url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org`,
          data:{
              key:'status',
              value: '1', 
              //@ts-ignore
              id: record.orgId  
          },
          headers:{
              "Authorization": paseto
          }
      })
      return res; 
  }

  const reactivateOrg = useMutation(reActivateOrgHandler,{
    onSettled:()=>{
      queryClient.invalidateQueries({queryKey:['organizations']})
    }
  })

   
  

        return (
            <div>
              {/* {isUser && currentStatus.id == '1' && (orgs && orgs.length > 0) 
               ? <Alert
                  style={{marginBottom:'1rem', marginTop:'1rem'}} 
                  type='warning'
                  message = 'Organization accepted!'
                  description="Congratulations! One or more of your organizations have been reviewed and accepted. Please logout and log back into your account in order to visit your organization and start launching venues and services."
                  banner
                  closable
                />:null} */}
                {allOrgsQuery && allOrgsTotal === 0  
                ? null
                : <div style={{marginBottom:'2rem', marginTop:'1.5rem', display:'flex', width:'100%', flexDirection:'column'}}>
                  <div style={{width:'100%', marginBottom:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <Title style={{margin: '0'}} level={2}>Organizations</Title>
                      <div>
                        <Button shape='round' style={{marginRight:'1rem'}} loading={orgQuery.isRefetching} onClick={()=>orgQuery.refetch()} icon={<ReloadOutlined rev={undefined} />}>Refresh</Button>
                        <Button shape='round' type='primary' icon={<PlusOutlined rev={undefined}/>} onClick={()=>router.push('/organizations/new')}>New Organization</Button>
                      </div>
                  </div>

                  <Radio.Group defaultValue={currentStatus.id} buttonStyle="solid">
                      {orgStatus.map(status=>(
                          <Radio.Button key={status.id} onClick={()=>setCurrentStatus(status)} value={status.id}>{status.name}</Radio.Button>
                      )
                      )}
                  </Radio.Group>

                </div>
                }
                
                {allOrgsQuery && allOrgsTotal === 0 
                ?<EmptyState/>
                :<Table 
                  style={{width:'100%'}} 
                  rowKey={(record)=>record.id}  
                  size="middle"
                  scroll={{ x: 'calc(500px + 50%)'}}
                  loading={orgQuery.isLoading||orgQuery.isRefetching} 
                  // @ts-ignore 
                  columns={columns} 
                  // @ts-ignore 
                  onChange={handleChange} 
                  dataSource={orgs}
                  pagination={{
                    total:totalLength,  
                    showTotal:(total) => `Total: ${total} items`,
                  }} 
                />}
                {/* {
                  isDrawerOpen && currentStatus.name === 'Approved'
                  ?<DetailDrawer isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedOrg={selectedOrg}/>
                  :null
                } */}
                {
                  isDrawerOpen?<DetailDrawer  isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedOrg={selectedOrg}/>:null
                }
            </div>
    )



}

interface DrawerProps{
  selectedOrg: NewOrg,
  isDrawerOpen: boolean,
  closeDrawer: (value:boolean)=>void
}
function DetailDrawer({selectedOrg,isDrawerOpen,closeDrawer}:DrawerProps){


const queryClient = useQueryClient()
const router = useRouter()
const {switchOrg} = useOrgContext()
const {paseto} = useAuthContext()
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
const {isUser} = useRole()
const urlPrefix = useUrlPrefix()

function closeDrawerHandler(){
  // queryClient.invalidateQueries(['organizations'])
  closeDrawer(!isDrawerOpen)
}

function gotoServices(org:NewOrg){

  switchOrg(org)
  // navigate user to services page
  router.push('/organizations/venues/')
}

function toggleDeleteModal(){
  setIsDeleteModalOpen(!isDeleteModalOpen)
}

function deleteOrg(){  
  // mutate record
  deleteData.mutate(selectedOrg,{
    onSuccess:()=>{
      notification['success']({
        message: 'Successfully deactivate organization!'
    })  
      toggleDeleteModal()
      closeDrawerHandler()
    },
    onSettled:()=>{
      queryClient.invalidateQueries(['organizations'])
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




const deleteDataHandler = async(record:NewOrg)=>{  
  const {data} = await axios({
    method:'patch',
    url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org`,
    data: {
        //@ts-ignore
        id:record.orgId,
        key:'status',
        value: '0'
      },
    headers:{
          "Authorization": paseto
  }})
  return data
}

const deleteData = useMutation(deleteDataHandler)

const{isLoading:isDeletingItem} = deleteData


return( 
<Drawer 
  title="Organization Details" 
  width={640} placement="right" 
  extra={selectedOrg.status === 1?<Button disabled={isUser} shape='round' onClick={()=>gotoServices(selectedOrg)}>Visit Organization</Button>:null}
  closable={true} 
  onClose={closeDrawerHandler} 
  open={isDrawerOpen}
>
  
<EditableText
    fieldKey="name" // The way the field is named in DB
    currentFieldValue={selectedOrg.name}
    fieldName = 'name'
    title = 'Name'
    // @ts-ignore
    id = {selectedOrg.orgId}
    options = {{queryKey:'organizations',mutationUrl:'org'}}
/>
  <EditableAddress selectedOrg={selectedOrg}/>
  <EditableText
    fieldKey="contact_number" // The way the field is named in DB
    currentFieldValue={selectedOrg.contactNumber} 
    fieldName = 'contactNumber'
    title = 'Contact Number'
    // @ts-ignore
    id = {selectedOrg.orgId}
    options = {{queryKey:'organizations',mutationUrl:'org'}}
/>
  <EditableLogoImage selectedOrg={selectedOrg}/>

  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Title level={3}>Danger zone</Title>
    <Button danger onClick={toggleDeleteModal} style={{width:'30%'}} type="link">Deactivate organization</Button>
  </div>



 { isDeleteModalOpen? <DeleteRecordModal isDeletingItem={isDeletingItem} onCloseModal={toggleDeleteModal} onDeleteRecord={deleteOrg} isOpen={isDeleteModalOpen} selectedRecord={selectedOrg}/>:null}

</Drawer>
)
}

interface DeleteProp{
  selectedRecord: NewOrg
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
        {`This action will remove ${selectedRecord.name} organization and all other venues and DATs associated with it. All venues of the organization will be removed from marketplace. The organization can be reactivated in the future`}
      </Text>

      <Form 
      form={form} 
      style={{marginTop:'1rem'}}
      name="deleteOrgForm" 
      layout='vertical'
      onFinish={onFinish}>
      <Form.Item
        name="name"
        style={{marginBottom:'.6rem'}}
        label={`Please type "${selectedRecord.name}" to confirm`}
        rules={[{ required: true, message: 'Please type correct service item name!' }]}
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



interface EditableProp{
  selectedOrg: NewOrg
}


export function EditableAddress({selectedOrg}:EditableProp){
  

  const [state, setState] = useState(selectedOrg.street)

  const [isEditMode, setIsEditMode] = useState(false)

  // You'll probably need to parse the address here.


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
      ?<AddressField currentFieldValue={state} updateState={setState} toggleEdit={toggleEdit} selectedRecord={selectedOrg}/>
      :readOnly
      }
    </div>
  )
}


function EditableLogoImage({selectedOrg}:EditableProp){

  const [isEditMode, setIsEditMode] = useState(false)
  const [isHashingImage, setIsHashingImage] = useState(false)
  const [updatedLogoImageHash, setUpdatedLogoImageHash] = useState(selectedOrg.logoImageHash)

  const queryClient = useQueryClient()

  const {paseto} = useAuthContext()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const urlPrefix = useUrlPrefix()

  const readOnly = (
      <div style={{width:'100%', marginTop:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Image style={{width:'170px', height:'170px', border:'1px solid #f2f2f2', borderRadius:'50%'}} alt='Logo image for organization' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${updatedLogoImageHash}`}/>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )

  const mutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org`,updatedItem,{
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
    }
  })

  async function onFinish(field:any){

    // hash it first
    const logoRes = await field.logoImage

    setIsHashingImage(true)
    const logoHash = await asyncStore(logoRes[0].originFileObj)
    setIsHashingImage(false)

    console.log(logoHash)

    const payload = {
      key:'logo_image_hash',
      value: logoHash,
      //@ts-ignore
      id: selectedOrg.orgId
    }
    setUpdatedLogoImageHash(logoHash)
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
     initialValues={selectedOrg}
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


interface AddressFieldProp{
  selectedRecord: NewOrg
  toggleEdit: ()=>void
  currentFieldValue: string
  updateState: (value:any)=>void
}
function AddressField({selectedRecord, updateState, currentFieldValue,toggleEdit}:AddressFieldProp){

  // const [isEditMode, setIsEditMode] = useState(false)
  const antInputRef = useRef();
  const [fullAddress, setFullAddress] = useState({
    state: '',
    country:'',
    city:'',
    street:'',
    postalCode: ''
})

const urlPrefix = useUrlPrefix()

 const {paseto} = useAuthContext()

 const queryClient = useQueryClient()

  const [form]  = Form.useForm()

  const extractFullAddress = (place:any)=>{
    const addressComponents = place.address_components 
        let addressObj = {
            state:'',
            country:'',
            city:'',
            postalCode:''
        };
        addressComponents.forEach((address:any)=>{
            const type = address.types[0]
            if(type==='country') addressObj.country = address.long_name
            if(type === 'locality') addressObj.state = address.short_name
            if(type === 'postal_code') addressObj.postalCode = address.short_name
            if(type === 'administrative_area_level_1') addressObj.city = address.short_name
        })

        return addressObj
}

const { ref: antRef } = usePlacesWidget({
  apiKey: process.env.NEXT_PUBLIC_MAPS_AUTOCOMPLETE_API,  // move this key to env
  options:{
      componentRestrictions:{country:'us'},
      types: ['address'],
      fields: ['address_components','geometry','formatted_address','name']
  },
  onPlaceSelected: (place) => {
      // console.log(antInputRef.current.input)
      form.setFieldValue('street',place?.formatted_address)

      console.log(place)  
      
      const fullAddress = extractFullAddress(place)
      // add street address
      const addressWithStreet={
          ...fullAddress,
          street: place?.formatted_address
      }
      setFullAddress(addressWithStreet)

      //@ts-ignore
    antInputRef.current.input.value = place?.formatted_address

  },
});

const mutationHandler = async(updatedItem:any)=>{
  // call a put api here instead
  const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org`,updatedItem,{
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
    updateState(data.data[0].street)
    queryClient.invalidateQueries(['organizations'])
  }
})

function onFinish(updatedItem:any){

  // only take fullAddress and stringify it
  const payload = {
    //@ts-ignore
    id: selectedRecord.orgId,
    address: 'yes',
    street:fullAddress.street,
    state: fullAddress.state,
    city: fullAddress.city,
    country: fullAddress.country,
    zipCode: fullAddress.postalCode,
  }


  mutation.mutate(payload)
}

const {isLoading:isEditing} = mutation 


  return(
    <Form
     style={{ marginTop:'.5rem' }}
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
           <Input allowClear ref={(c) => {
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




const orgStatus = [
  {
      id: '1',
      name: 'Approved'
  },
  {
      id: '2',
      name: 'In Review'
  },
  {
      id: '4',
      name: 'Rejected'
  },
  {
      id: '0',
      name: 'Deactivated'
  },
]


