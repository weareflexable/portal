import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NewOrg } from "../../../../types/OrganisationTypes";
import useOrgs from "../../../../hooks/useOrgs";
const {Text,Title} = Typography
import { SearchOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Alert, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Modal, notification} from 'antd'
import { useRouter } from 'next/router'
import Highlighter from 'react-highlight-words'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';

import { useAuthContext } from '../../../../context/AuthContext';
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { useOrgContext } from "../../../../context/OrgContext";
import { asyncStore } from "../../../../utils/nftStorage";
import { usePlacesWidget } from "react-google-autocomplete";
import { EditableName, EditableAddress, EditablePhone, EditableZipCode, EditableLogoImage, EditableCoverImage } from "../EditOrg";


var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime) 


export default function ManagerOrgsView(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()
    const router = useRouter()
    const {switchOrg} = useOrgs()

    const [searchText, setSearchText] = useState('');
    const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
    const [searchedDate, setSearchedDate] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const ticketSearchRef = useRef(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
    // const isFilterEmpty = Object.keys(filteredInfo).length === 0;

    type DataIndex = keyof NewOrg;

    const [selectedOrg, setSelelectedOrg] = useState<any|NewOrg>({})
    const [currentStatus, setCurrentStatus] = useState({id:'1',name: 'Approved'})

    async function fetchOrgs(){
    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/orgs?key=status&value=${currentStatus.id}&pageNumber=0&pageSize=10`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
   
    }

   

    async function changeOrgStatus({orgId, statusNumber}:{orgId:string, statusNumber: string}){
      console.log(orgId)
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,
            data:{
                key:'status',
                value: statusNumber, // 0 means de-activated in db
                orgId: orgId 
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
      // setSelelectedOrg(org.orgId)

      // @ts-ignore
        changeStatusMutation.mutate({orgId:org.orgId, statusNumber:'1'})
    }

    const orgQuery = useQuery({queryKey:['organizations', currentStatus], queryFn:fetchOrgs, enabled:paseto !== ''})
    const orgs = orgQuery.data && orgQuery.data.data


    
  
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
  
    const handleChange: TableProps<NewOrg>['onChange'] = (pagination, filters, sorter) => {
      console.log('Various parameters', pagination, filters, sorter);
      setFilteredInfo(filters);
    };
  
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<NewOrg> => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
        <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              shape='round'
              style={{ width: 90, display:'flex',alignItems:'center' }}
            >
              Search
            </Button>
            
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
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
                confirm({ closeDropdown: false });
                setSearchText((selectedKeys as string[])[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type='link'
              danger
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
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: visible => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: text =>{
        console.log('text',text)
        console.log('dataIndex',dataIndex)
        return searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        )
      }
    });
  
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
              icon={<SearchOutlined />}
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
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
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
  
    function gotoServices(org:NewOrg){
      console.log(org)
      // switch org
      switchOrg(org)
      // navigate user to services page
      router.push('/organizations/services/')
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
        console.log('click', record);
      };
      
  
    const columns: ColumnsType<NewOrg> = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render:(_,record)=>{
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${record.logoImageHash}`}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                       { record.status !==1?<Text>{record.name}</Text>:<Text style={{color:'#1677ff', cursor:'pointer'}} onClick={()=>gotoServices(record)}>{record.name}</Text> }   
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
        render:(_,record)=>(
          <div style={{display:'flex',flexDirection:'column'}}>
              <Text style={{textTransform:'capitalize'}}>{record.country}</Text>  
              <Text type="secondary">{record.city}</Text>
          </div>
        )
      },
      
      {
        title: 'Zip Code',
        dataIndex: 'zipCode',
        key: 'zipCode',
        render:(_,record)=>{
          const zipCode = record.zipCode  === ""? <Text>--</Text>: <Text>{record.zipCode}</Text>
          return zipCode
      }
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
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
    //   {
    //       title: 'UpdatedAt',
    //       dataIndex: 'updatedAt',
    //       key: 'updatedAt',
    //       render: (_,record)=>{
    //         //@ts-ignore
    //           const date = dayjs().from(dayjs(record.updatedAt),true)
    //           return(
    //         <Text>{date} ago</Text>
    //         )
    //     },
    // },
    {
      dataIndex: 'actions', 
      key: 'actions',
      render:(_,record)=>{
        const items = getCurrentStatusActionItems()
        return (<Dropdown menu={{ items , onClick: (e)=>onMenuClick(e,record) }}>
          <Button type='text' icon={<MoreOutlined/>}/>
        </Dropdown>)
      }
    }
    ];

        return (
            <div>
                <div style={{marginBottom:'1.5em', display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                <Radio.Group defaultValue={currentStatus.id} buttonStyle="solid">
                    {orgStatus.map(status=>(
                        <Radio.Button key={status.id} onClick={()=>setCurrentStatus(status)} value={status.id}>{status.name}</Radio.Button>
                     )
                    )}
                </Radio.Group>
                <Button type='link' loading={orgQuery.isRefetching} onClick={()=>orgQuery.refetch()} icon={<ReloadOutlined />}>Refresh</Button>

                </div>
                <Table 
                  style={{width:'100%'}} 
                  // rowKey={(record)=>record.id}  
                  loading={orgQuery.isLoading||orgQuery.isRefetching} 
                  columns={columns} 
                  onChange={handleChange} 
                  dataSource={orgs} 
                />
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
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

const {paseto, currentUser} = useAuthContext()

function closeDrawerHandler(){
  queryClient.invalidateQueries(['organizations'])
  closeDrawer(!isDrawerOpen)
}

function gotoServices(org:NewOrg){
  console.log(org)
  // switch org
  switchOrg(org)
  // navigate user to services page
  router.push('/organizations/services/')
}

function toggleDeleteModal(){
  setIsDeleteModalOpen(!isDeleteModalOpen)
}

function deleteServiceItem(){ 

  // mutate record
  deleteData.mutate(selectedOrg,{
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

// const urlPrefix = currentUser.role == 1 ? 'manager': 'admin'

const deleteDataHandler = async(record:NewOrg)=>{      
  const {data} = await axios({
    method:'patch',
    url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,
    data: {
        //@ts-ignore
        orgId:record.orgId,
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
  extra={selectedOrg.status === 1?<Button size='large' onClick={()=>gotoServices(selectedOrg)}>Visit organization</Button>:null}
  closable={true} 
  onClose={closeDrawerHandler} 
  open={isDrawerOpen}
>
  
  <EditableName selectedOrg={selectedOrg}/>
  <EditableAddress selectedOrg={selectedOrg}/>
  <EditablePhone selectedOrg={selectedOrg}/>
  {/* <EditableZipCode selectedOrg={selectedOrg}/> */}
  <EditableLogoImage selectedOrg={selectedOrg}/>
  <EditableCoverImage selectedOrg={selectedOrg}/>

  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Title level={3}>Danger zone</Title>
    <Button danger onClick={toggleDeleteModal} style={{width:'30%'}} type="link">De-activate organization</Button>
  </div>

  <DeleteRecordModal isDeletingItem={isDeletingItem} onCloseModal={toggleDeleteModal} onDeleteRecord={deleteServiceItem} isOpen={isDeleteModalOpen} selectedRecord={selectedOrg}/>


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
      <Alert style={{marginBottom:'.5rem'}} showIcon message="Bad things will happen if you don't read this!" type="warning" />
      <Text >
        {`This action cannot be undone. This will permanently delete the ${selectedRecord.name} and all other entities created under it like services and service items most importantly, all services and service items under this org will be removed from the marketplace `}
      </Text>

      <Form 
      form={form} 
      style={{marginTop:'1rem'}}
      name="deleteServiceItemForm" 
      layout='vertical'
      onFinish={onFinish}>
      <Form.Item
        name="name"
        style={{marginBottom:'.6rem'}}
        label={`Please type "${selectedRecord.name}" to confirm`}
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
      name: 'De-activated'
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
        label: 'Accept'
    },
    {
        key: 'reject',
        label: 'Reject'
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