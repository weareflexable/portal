
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const {Text,Title} = Typography
const {Option} = Select
import { SearchOutlined, PlusOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import React, { ReactNode, useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form, Modal, notification, Select} from 'antd'
import axios from 'axios';
import {MoreOutlined,ReloadOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';

import { useAuthContext } from '../../context/AuthContext';
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import { Bank } from "./Types/Banks.types";
import { usePlacesWidget } from "react-google-autocomplete";
import useUrlPrefix from '../../hooks/useUrlPrefix'
import { useOrgContext } from "../../context/OrgContext";
import { useRouter } from "next/router";
import { useServicesContext } from "../../context/ServicesContext";
import { EditableCountry, EditableRadio, EditableText } from "../shared/Editables";
import useRole from "../../hooks/useRole";
const {TextArea} = Input

const countryList = require('country-list')


export default function BillingsView(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()
    const {currentOrg} = useOrgContext()
    const {isAdmin} = useRole()

    const router = useRouter()

    const [pageNumber, setPageNumber] = useState<number|undefined>(1)
    const [pageSize, setPageSize] = useState<number|undefined>(10)

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)


    type DataIndex = keyof Bank;

    const [selectedBank, setSelelectedOrg] = useState<any|Bank>({})
    const [currentFilter, setCurrentStatus] = useState({id:'1',name: 'Verified'})

    async function fetchAllBanks(){
        const res = await axios({
            method:'get',
            //@ts-ignore
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org-bank?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
    }
    async function fetchBanks(){
        const res = await axios({
            method:'get',
            //@ts-ignore
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org-bank?key=org_id&value=${currentOrg.orgId}&pageNumber=${pageNumber}&pageSize=${pageSize}&key2=status&value2=${currentFilter.id}`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
    }

    const urlPrefix = useUrlPrefix()

    async function changeStatus({id, statusNumber}:{id:string, statusNumber: string}){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org-bank`,
            data:{
                key:'status',
                value: statusNumber, // 0 means de-activated in db
                id: id 
            },
            headers:{
                "Authorization": paseto
            }
        })
        return res; 
    }

    const changeStatusMutation = useMutation(['data'],{
        mutationFn: changeStatus,
        onSuccess:(data:any)=>{
            queryClient.invalidateQueries({queryKey:['banks',currentFilter]})
        },
        onError:()=>{
            console.log('Error changing status')
        }
    })

    function deActivateBankHandler(bank:Bank){
        // setSelelectedOrg(org.orgId)
        changeStatusMutation.mutate({id: bank.id, statusNumber:'0'})
    }

    function verifyBankHandler(bank:Bank){
        // setSelelectedOrg(org.orgId)
        changeStatusMutation.mutate({id:bank.id, statusNumber:'1'})
    }
    function rejectBankHandler(bank:Bank){
        // setSelelectedOrg(org.orgId)
        changeStatusMutation.mutate({id:bank.id, statusNumber:'3'})
    }
    function reviewBankHandler(bank:Bank){
        // setSelelectedOrg(org.orgId)
        changeStatusMutation.mutate({id:bank.id, statusNumber:'2'})
    }

    function reActivateBankHandler(bank:Bank){
        changeStatusMutation.mutate({id:bank.id, statusNumber:'1'})
    }

    
      const allBanksQuery = useQuery({queryKey:['all-banks'], queryFn:fetchAllBanks, enabled:paseto !== '', staleTime:Infinity})
      const allBanksLength = allBanksQuery.data && allBanksQuery.data.data.length
      
      
      const banksQuery = useQuery({queryKey:['banks', currentFilter], queryFn:fetchBanks, enabled:paseto !== '' && allBanksQuery.isFetched})
      const data = banksQuery.data && banksQuery.data.data
      const totalLength = banksQuery.data && banksQuery.data.dataLength;

  
  

    function getCurrentFilterActions(){
        switch(currentFilter.id){
            // 1 = verified
            case '1': return verifiedBankActions 
            break;
            // 2 = unVerified
            case '2': return isAdmin? adminUnVerifiedBankActions: unVerifiedBankActions  
            break;
            // 0 = deActivated
            case '0': return deActivatedBankActions 
            break;
            case '3': return rejectedBankActions 
            default: return verifiedBankActions
        }
    }

    function viewOrgDetails(org:Bank){
      // set state
      setSelelectedOrg(org)
      // opne drawer
      setIsDrawerOpen(true)

    }


    const handleChange: TableProps<Bank>['onChange'] = (data) => {
      setPageSize(data.pageSize)
      //@ts-ignore
      setPageNumber(data.current); // Subtracting 1 because pageSize param in url starts counting from 0
    };
  
  
    
      const onMenuClick=(e:any, record:Bank) => {
        const event = e.key
        switch(event){
          case 'deActivate': deActivateBankHandler(record);
          break;
          case 'accept': verifyBankHandler(record)
          break;
          case 'reject': rejectBankHandler(record)
          break;
          case 'review': reviewBankHandler(record)
          break;
          case 'reActivate': reActivateBankHandler(record)
          break;
          case 'viewDetails': viewOrgDetails(record)
        }
      };
      
  
    const columns: ColumnsType<Bank> = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        fixed:'left',
        width:'270px',
        ellipsis:true,
        render:(_,record)=>{
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    {/* <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={'/favicon.ico'}/> */}
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text style={{textTransform:'capitalize'}}>{record.bankName}</Text>  
                        <Text style={{textTransform:'capitalize'}} type="secondary">{record.accountType}</Text>
                    </div>
                </div>
            )
        },
      },
      {
        title: 'Account Name',
        dataIndex: 'beneficiaryName',
        key: 'beneficiaryName',
        width:'200px',
      },

      {
        title: 'Account No',
        dataIndex: 'accountNo',
        key: 'accountNo',
        width:'150px'
      },
     
      // {
      //   title: 'Currency',
      //   dataIndex: 'currency',
      //   key: 'currency'
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
      fixed:'right',
      width: currentFilter.id == '0' ? '120px' : '70px',
      render:(_,record)=>{
        const items = getCurrentFilterActions()
        if(currentFilter.id == '0'){
          return (<Button   onClick={()=>reActivateBankHandler(record)}>Reactivate</Button>)
        }
        return (
        <Dropdown trigger={['click']} menu={{ items , onClick: (e)=>onMenuClick(e,record) }}>
            <Button type='text' icon={<MoreOutlined />}/>
          </Dropdown>)
      } 
    }
    ];

        return (
            <div>
              <div style={{display:'flex', marginTop:'1rem', marginBottom:'1rem', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                 <Title style={{ margin:'0'}} level={2}>Billings</Title>
               </div>
               {  allBanksQuery.data && allBanksLength == 0? null : <div style={{marginBottom:'1.5em', display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                  <Radio.Group defaultValue={currentFilter.id} buttonStyle="solid">
                      {bankFilters.map(bankFilter=>(
                          <Radio.Button key={bankFilter.id} onClick={()=>setCurrentStatus(bankFilter)} value={bankFilter.id}>{bankFilter.name}</Radio.Button>
                      )
                      )}
                  </Radio.Group>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <Button shape="round" style={{marginRight:'1rem'}} loading={banksQuery.isRefetching} onClick={()=>banksQuery.refetch()} icon={<ReloadOutlined />}>Refresh</Button>
                    <Button shape='round' type='primary' icon={<PlusOutlined/>} onClick={()=>router.push('/organizations/billings/new')}>New Bank</Button>
                  </div>
                </div>}
                {
                  allBanksQuery.data && allBanksLength == 0
                  ?<EmptyState>
                    <Button shape='round' type='primary' icon={<PlusOutlined/>} onClick={()=>router.push('/organizations/billings/new')}>New Bank</Button>
                  </EmptyState>
                  : <Table 
                  style={{width:'100%'}} 
                  scroll={{ x: 'calc(500px + 50%)'}} 
                  rowKey={(record)=>record.id}
                  onChange={handleChange} 
                  loading={banksQuery.isLoading||banksQuery.isRefetching} 
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
                  ?<DetailDrawer isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedRecord={selectedBank}/>
                  :null
                }
            </div>
    )



}

interface DrawerProps{
  selectedRecord: Bank,
  isDrawerOpen: boolean,
  closeDrawer: (value:boolean)=>void
}

function DetailDrawer({selectedRecord,isDrawerOpen,closeDrawer}:DrawerProps){

const queryClient = useQueryClient()

const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
const {paseto} = useAuthContext()

function closeDrawerHandler(){
  queryClient.invalidateQueries(['services']) 
  closeDrawer(!isDrawerOpen)
}



function toggleDeleteModal(){
  setIsDeleteModalOpen(!isDeleteModalOpen)
}

function deleteService(){ 
  console.log(selectedRecord.id)
  // mutate record
  deleteData.mutate(selectedRecord,{
    onSuccess:()=>{
      notification['success']({
        message: 'Successfully deleted record!'
      })
      toggleDeleteModal()
      closeDrawerHandler()

    },
    onSettled:()=>{
      queryClient.invalidateQueries(['banks'])
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

const deleteDataHandler = async(record:Bank)=>{      
  const {data} = await axios({
    method:'patch',
    url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org-bank`,
    data: {
        id:record.id,
        key:'status',
        value: "0"
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
  title="Bank Details" 
  width={640} placement="right" 
  closable={true} 
  onClose={closeDrawerHandler} 
  open={isDrawerOpen}
>
  
  <Title style={{marginBottom:'1.5rem'}} level={3}>Beneficiary Info</Title>

  <EditableText
    fieldKey="beneficiary_name" // The way the field is named in DB
    currentFieldValue={selectedRecord.beneficiaryName}
    fieldName = 'beneficiaryName'
    title = 'Beneficiary Name'
    id = {selectedRecord.id}
    options = {{queryKey:'banks',mutationUrl:'org-bank'}}
   />

  <EditableCountry
    fieldKey="beneficiary_country" // The way the field is named in DB
    currentFieldValue={selectedRecord.beneficiaryCountry}
    fieldName = 'beneficiaryCountry'
    title = 'Beneficiary Country'
    id = {selectedRecord.id}
    options = {{queryKey:'banks',mutationUrl:'org-bank'}}
   />

  <EditableText
    fieldKey="beneficiary_state" // The way the field is named in DB
    currentFieldValue={selectedRecord.beneficiaryState}
    fieldName = 'beneficiaryState'
    title = 'Beneficiary State'
    id = {selectedRecord.id}
    options = {{queryKey:'banks',mutationUrl:'org-bank'}}
   />

  <EditableText
    fieldKey="beneficiary_city" // The way the field is named in DB
    currentFieldValue={selectedRecord.beneficiaryCity}
    fieldName = 'beneficiaryCity'
    title = 'Beneficiary City'
    id = {selectedRecord.id}
    options = {{queryKey:'banks',mutationUrl:'org-bank'}}
   />

  <EditableText
    fieldKey="beneficiary_postal_code" // The way the field is named in DB
    currentFieldValue={selectedRecord.beneficiaryPostalCode}
    fieldName = 'beneficiaryPostalCode'
    title = 'Beneficiary Postal Code'
    id = {selectedRecord.id}
    options = {{queryKey:'banks',mutationUrl:'org-bank'}}
   />

   <Title style={{marginTop:'1rem'}} level={3}>Account Info</Title>

  <EditableRadio
    fieldKey="account_type" // The way the field is named in DB
    currentFieldValue={selectedRecord.accountType}
    fieldName = 'accountType'
    title = 'Account Type'
    id = {selectedRecord.id}
    options = {{queryKey:'banks',mutationUrl:'org-bank'}}
   />

  <EditableText
    fieldKey="account_no" // The way the field is named in DB
    currentFieldValue={selectedRecord.accountNo}
    fieldName = 'accountNo'
    title = 'Account No'
    id = {selectedRecord.id}
    options = {{queryKey:'banks',mutationUrl:'org-bank'}}
   />

   <Title style={{marginTop:'1.5rem'}} level={3}>Bank Info</Title>

  <EditableText
    fieldKey="bank_name" // The way the field is named in DB
    currentFieldValue={selectedRecord.bankName}
    fieldName = 'bankName'
    title = 'Bank Name'
    id = {selectedRecord.id}
    options = {{queryKey:'banks',mutationUrl:'org-bank'}}
   />

  <EditableText
    fieldKey="bank_address" // The way the field is named in DB
    currentFieldValue={selectedRecord.bankAddress}
    fieldName = 'bankAddress'
    title = 'Bank Address'
    id = {selectedRecord.id}
    options = {{queryKey:'banks',mutationUrl:'org-bank'}}
   />

  <EditableText
    fieldKey="routing_number" // The way the field is named in DB
    currentFieldValue={selectedRecord.routingNumber}
    fieldName = 'routingNumber'
    title = 'Routing No'
    id = {selectedRecord.id}
    options = {{queryKey:'banks',mutationUrl:'org-bank'}}
   />



  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Title level={3}>Danger zone</Title>
    <Button danger onClick={toggleDeleteModal} style={{width:'30%'}} type="link">Deactivate Bank</Button>
  </div>

  <DeleteRecordModal  
  isDeletingItem={isDeletingItem} 
  onCloseModal={toggleDeleteModal} 
  onDeleteRecord={deleteService} 
  isOpen={isDeleteModalOpen} 
  selectedRecord={selectedRecord}
  />

</Drawer>
)
}


interface DeleteProp{
  selectedRecord: Bank
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
        {`This action will remove this venue’s listing from the marketplace and will deactivate any DATs that are attached to it. Venue can be reactivated in the future 
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
        label={`Please type "${selectedRecord.bankName}" to confirm`}
        rules={[{ required: true, message: 'Please type correct service item name!' }]}
      >
        <Input size="large" disabled={isDeletingItem} />
      </Form.Item>

      <Form.Item
        style={{marginBottom:'0'}}
        shouldUpdate
       >
          {() => (
          <Button
            style={{width:'100%'}}
            size='large'
            danger
            loading={isDeletingItem}
            htmlType="submit"
            disabled={
              // !form.isFieldTouched('name') &&
              form.getFieldValue('name') !== selectedRecord.bankName
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




const bankFilters = [
  {
      id: '1',
      name: 'Verified'
  },
  {
      id: '2',
      name: 'In Review'
  },
  {
      id: '0',
      name: 'Deactivated'
  },
  {
      id: '3',
      name: 'Rejected'
  },
]

const verifiedBankActions = [
    {
        key: 'viewDetails',
        label: 'View details'
    },

]
const adminUnVerifiedBankActions = [
  {
    key: 'viewDetails',
    label: 'View details'
},
]

const unVerifiedBankActions = [
    {
        key: 'accept',
        label: 'Accept',
        icon: <LikeOutlined/>
    },
    {
        key: 'reject',
        label: 'Reject',
        icon: <DislikeOutlined/>
    },
    {
        key: 'viewDetails',
        label: 'View details'
    },

]

const deActivatedBankActions = [
    {
        key: 'reActivate',
        label: 'Reactivate'
    },
    {
        key: 'viewDetails',
        label: 'View details'
    },

]
const rejectedBankActions = [
    {
        key: 'review',
        label: 'Review'
    },
    {
        key: 'viewDetails',
        label: 'View details'
    },

]


interface EmptyStateProps{
  children: ReactNode
}

function EmptyState({children}:EmptyStateProps){

  return(
    <div style={{border: '1px solid #d6d6d6', marginTop:'2rem', borderRadius:'4px', height:'50vh', display:'flex', justifyContent:'center', alignItems:'center', padding: '2rem'}}>
      <div style={{maxWidth:'350px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <Title level={3}>Get Started</Title> 
        <Text style={{textAlign:'center'}}>Seems like you are yet to add a bank</Text>
        <div style={{marginTop:'1rem', display:'flex',justifyContent:'center'}}>
            {children}
        </div>
      </div>
    </div>
  )
}
