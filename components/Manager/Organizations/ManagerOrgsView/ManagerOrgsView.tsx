import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NewOrg } from "../../../../types/OrganisationTypes";
import useOrgs from "../../../../hooks/useOrgs";
const {Text,Title} = Typography
import { SearchOutlined, PlusOutlined, LikeOutlined, DashOutlined, DislikeOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Alert, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Modal, notification} from 'antd'
import { useRouter } from 'next/router'
import Highlighter from 'react-highlight-words'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';
import Head from 'next/head'
import { useAuthContext } from '../../../../context/AuthContext';
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { useOrgContext } from "../../../../context/OrgContext";
import { EditableName, EditableAddress, EditablePhone, EditableZipCode, EditableLogoImage, EditableCoverImage } from "../EditOrg";
import { convertToAmericanFormat } from "../../../../utils/phoneNumberFormatter";
import { EditableText } from "../../../shared/Editables";
import useUrlPrefix from "../../../../hooks/useUrlPrefix";
import useRole from "../../../../hooks/useRole";


var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime) 

const IMAGE_PLACEHOLDER_HASH='bafkreiexo2kwvwmgfhutm7k4y6oaqo7vawlwlg6je55pqho6ch3ooxjiqa'


export default function ManagerOrgsView(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()
    const router = useRouter()
    const {switchOrg} = useOrgContext()
    // const {switchOrg} = useOrgs()
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

    // async function fetchAllOrgs(){
    // const res = await axios({
    //         method:'get',
    //         url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/orgs?pageNumber=${pageNumber}&pageSize=10`,
    //         headers:{
    //             "Authorization": paseto
    //         }
    //     })

    //     return res.data;
   
    // }

    async function fetchOrgs(){
    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/orgs?status=${currentStatus.id}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
                // key:'status',
                status: statusNumber, // 0 means de-activated in db
                id: orgId 
            },
            headers:{
                "Authorization": paseto
            }
        })
        return res; 
    }
    async function changeOrgOwnerToAdmin({userId}:{userId:string}){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/users-role`,
            data:{
                // key:'role',
                role: '2', // 2 is for admin
                targetUserId: userId 
            },
            headers:{
                "Authorization": paseto
            }
        })
        return res; 
    }


    function gotoOrg(org:NewOrg){
      // switch org
      switchOrg(org)
      // navigate user to services page
      router.push('/organizations/venues')
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

    const changeOrgOwnerToAdminMutation = useMutation({
        mutationFn: changeOrgOwnerToAdmin,
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

    function changeOwnerToAdmin (org:NewOrg){
      console.log(org)
        // setSelelectedOrg(org.orgId)
        // @ts-ignore
        // changeOrgOwnerToAdminMutation.mutate({userId:''})
      }
      
      function reviewHandler(org:NewOrg){
        // setSelelectedOrg(org.orgId)
        // @ts-ignore
        changeStatusMutation.mutate({orgId:org.orgId, statusNumber:'2'})
      }
      
      function rejectOrgHandler(org:NewOrg){
      // @ts-ignore
      changeStatusMutation.mutate({orgId:org.orgId, statusNumber:'4'})
    }
    
    function acceptOrgHandler(org:NewOrg){

      changeOrgOwnerToAdminMutation.mutate({userId:org.createdBy},{
        onSuccess:()=>{
          // @ts-ignore
          changeStatusMutation.mutate({orgId:org.orgId, statusNumber:'1'})
          // call api for changing custom role rn
        },
        onError:()=>{
          console.log('error upgrading owner role to admin')
        }
      })
    }

    const orgQuery = useQuery({queryKey:['organizations', currentStatus], queryFn:fetchOrgs, enabled:paseto !== ''})
    const orgs = orgQuery.data && orgQuery.data.data
    const totalLength = orgQuery.data && orgQuery.data.dataLength;

    // const allOrgsQuery = useQuery({queryKey:['all-orgs'], queryFn:fetchAllOrgs, enabled:paseto !== '',staleTime:Infinity})
    // const allOrgsTotal = allOrgsQuery.data && allOrgsQuery.data.dataLength;


    
  
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

    function getCurrentStatusActionItems(){
        switch(currentStatus.id){
            // 1 = approved
            case '1': return approvedOrgsActions 
            // 2 = inReview
            case '2': return inReviewOrgsActions 
            // 4 = rejected
            case '4': return rejectedOrgsActions 
            // 0 = deActivated
            case '0': return deActivatedOrgsActions 
        }
    }

    function viewOrgDetails(org:NewOrg){
      // set state
      setSelelectedOrg(org)
      // opne drawer
      setIsDrawerOpen(true)

    }
  
    
    
      const onMenuClick=(e:any, record:NewOrg) => {
        const event = e.key
        switch(event){
          case 'deActivate': deActivateOrgHandler(record);
          break;
          case 'review': reviewHandler(record)
          break;
          case 'accept': acceptOrgHandler(record)
          break;
          case 'reject': rejectOrgHandler(record)
          break;
          case 'viewDetails': viewOrgDetails(record)
        }
      };

      const urlPrefix = useUrlPrefix()
        
    async function reActivateOrgHandler(record:NewOrg){
      console.log(record)
      const res = await axios({
          method:'patch',
          url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org`,
          data:{
              // key:'status',
              status: '1', 
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
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${record.logoImageHash.length < 20? IMAGE_PLACEHOLDER_HASH :record.logoImageHash}`}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                       { record.status !==1?<Text>{record.name}</Text>:<Text style={{color:'#1677ff', cursor:'pointer'}} onClick={()=>gotoOrg(record)}>{record.name}</Text> }   
                        {/* <Text>{record.name}</Text> */}
                        <Text type="secondary">{record.email}</Text>
                    </div>
                </div>
            )
        },
        // ...getColumnSearchProps('name'),
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        width:'370px',
        ellipsis: true,
        render:(_,record)=>{
          return(
            <>
            {
              record.street !== ''
              ? <div style={{display:'flex',flexDirection:'column'}}>
                    <Text style={{textTransform:'capitalize'}}>{record.country}</Text>  
                    <Text type="secondary">{record.street}</Text>
                </div>
              : <DashOutlined rev={undefined}/>
            }
          </>
        )
      }
      },
    
      {
        title: 'Contact Number',
        dataIndex: 'contactNumber',
        key: 'contactNumber',
        width:'150px',
        render: (_,record)=>(
          <>
          {
          //@ts-ignore
          record.contactNumber !=='' ?<Text>{convertToAmericanFormat(record.contactNumber)}</Text>: <DashOutlined rev={undefined}/>
           }
          </>
        )
      },
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
    {
      dataIndex: 'actions', 
      key: 'actions',
      width: currentStatus.name !== 'Deactivated'?'70px':'150px',
      fixed:'right',
      render:(_,record:NewOrg)=>{
        if(currentStatus.name !== 'Deactivated'){
          const items = getCurrentStatusActionItems()
          return (<Dropdown trigger={["click"]} menu={{ items , onClick: (e)=>onMenuClick(e,record) }}>
          <Button type='text' icon={<MoreOutlined rev={undefined}/>}/>
        </Dropdown>)
        }else{
          return (<Button onClick={()=>reactivateOrg.mutate(record)}>Reactivate</Button>)
        }
      }
    }
    ];

 

        return (
            <div>
              <Head>
                <title>Flexable|Portal</title>
                <link rel="icon" href="/favicon.png" />
               </Head>
              
               {/* { allOrgsQuery && allOrgsTotal === 0 
               ? null 
               :  */}
               <div style={{marginBottom:'2rem', marginTop:'2rem', display:'flex', width:'100%', flexDirection:'column',}}>
                  <div style={{width:'100%', marginBottom:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                          <Title style={{margin: '0'}} level={2}>Organizations</Title>
                          <div>
                            <Button shape='round' style={{marginRight:'1rem'}} loading={orgQuery.isRefetching} onClick={()=>orgQuery.refetch()} icon={<ReloadOutlined rev={undefined} />}>Refresh</Button>
                            <Button shape='round' type='primary' icon={<PlusOutlined rev={undefined}/>} onClick={()=>router.push('/manager/organizations/new')}>New Organization</Button>
                          </div>
                  </div>
                  <Radio.Group defaultValue={currentStatus.id} buttonStyle="solid">
                      {orgStatus.map(status=>(
                          <Radio.Button  key={status.id} onClick={()=>setCurrentStatus(status)} value={status.id}>{status.name}</Radio.Button>
                      )
                      )}
                  </Radio.Group>

                </div>
                {/* } */}
  
                {/* { allOrgsQuery && allOrgsTotal === 0 
                ?<EmptyState/>
                : */}
                <Table 
                  style={{width:'100%'}} 
                  size='middle'
                  scroll={{ x: 'calc(500px + 50%)'}}
                  rowKey={(record)=>record.id}  
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
                />

                {/* } */}
                {
                  isDrawerOpen
                  ?<DetailDrawer isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedOrg={selectedOrg}/>
                  :null
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
// const {switchOrg} = useOrgs()
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

const {paseto, currentUser} = useAuthContext()

function closeDrawerHandler(){
  // queryClient.invalidateQueries(['organizations'])
  closeDrawer(!isDrawerOpen)
}

function gotoOrg(org:NewOrg){
  console.log(org)
  // switch org
  switchOrg(org)
  // navigate user to services page
  router.push('/organizations/venues')
}

function toggleDeleteModal(){
  setIsDeleteModalOpen(!isDeleteModalOpen)
}

function deleteOrg(){ 

  // mutate record
  deleteData.mutate(selectedOrg,{
    onSuccess:()=>{
      notification['success']({
        message: 'Successfully deactivated organization!'
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

async function reActivateOrgHandler(record:NewOrg){
  console.log(record)
  const res = await axios({
      method:'patch',
      url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org`,
      data:{
          // key:'status',
          status: '1', 
          //@ts-ignore
          id: record.orgId  
      },
      headers:{
          "Authorization": paseto
      }
  })
  return res; 
}

const urlPrefix = useUrlPrefix()

const reactivateOrg = useMutation(reActivateOrgHandler,{
onSettled:()=>{
  queryClient.invalidateQueries({queryKey:['organizations']})
}
})

const deleteDataHandler = async(record:NewOrg)=>{      
  const {data} = await axios({
    method:'patch',
    url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org`,
    data: {
        //@ts-ignore
        id:record.orgId,
        // key:'status',
        status: '0'
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
  extra={selectedOrg.status === 1?<Button shape='round' onClick={()=>gotoOrg(selectedOrg)}>Visit organization</Button>:null}
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
  {/* <EditableCoverImage selectedOrg={selectedOrg}/> */}

  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Title level={3}>Danger zone</Title>
    <Button danger onClick={toggleDeleteModal} style={{width:'30%'}} type="link">Deactivate organization</Button>
  </div>

  <DeleteRecordModal isDeletingItem={isDeletingItem} onCloseModal={toggleDeleteModal} onDeleteRecord={deleteOrg} isOpen={isDeleteModalOpen} selectedRecord={selectedOrg}/>


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

const approvedOrgsActions = [
    {
        key: 'viewDetails',
        label: 'View details'
    },

]
const deActivatedOrgsActions = [
    {
        key: 'review',
        label: 'Review'
    },
    {
        key: 'viewDetails',
        label: 'View details'
    },

]
const inReviewOrgsActions = [
    {
        key: 'accept',
        label: "Accept",
        icon: <LikeOutlined rev={undefined} />
    },
    {
        key: 'reject',
        label: 'Reject',
        icon:<DislikeOutlined rev={undefined} />
    },
    {
        key: 'viewDetails',
        label: 'View details'
    },

]
const rejectedOrgsActions = [
    {
        key: 'review',
        label: 'Review'
    },
    {
        key: 'viewDetails',
        label: 'View details'
    },

]


function EmptyState(){
  const router = useRouter()
  return(
    <div style={{border: '1px solid #dddddd', display:'flex', justifyContent:'center', height:'30vh', marginTop:'4rem', alignItems:'center', padding: '2rem'}}>
      <div style={{maxWidth:'300px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <Title style={{textAlign:'center'}} level={3}>Get Started</Title>
        <Text style={{textAlign:'center'}}>Ready to get started listing your services on the Flexable Marketplace? The first step is to load in your organization’s details</Text>
        <Button size="large" shape="round" type="primary" style={{marginTop:'2rem'}} icon={<PlusOutlined rev={undefined} />} onClick={()=>router.push('/manager/organizations/new')}>Create New Organization</Button>
      </div>
    </div>
  )
}