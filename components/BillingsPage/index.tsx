
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const {Text,Title} = Typography
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import React, { ReactNode, useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form} from 'antd'
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
const {TextArea} = Input


export default function BillingsView(){

    const {paseto} = useAuthContext()
    const queryClient = useQueryClient()
    const {currentOrg} = useOrgContext()

    const router = useRouter()

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)


    type DataIndex = keyof Bank;

    const [selectedBank, setSelelectedOrg] = useState<any|Bank>({})
    const [currentFilter, setCurrentStatus] = useState({id:'1',name: 'Verified'})

    async function fetchAllBanks(){
        const res = await axios({
            method:'get',
            //@ts-ignore
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org-bank?pageNumber=0&pageSize=10`,
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
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org-bank?key=org_id&value=${currentOrg.orgId}&pageNumber=0&pageSize=10&key2=status&value2=${currentFilter.id}`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
    }

    const urlPrefix = useUrlPrefix()

    async function changeStatus({bankId, statusNumber}:{bankId:string, statusNumber: string}){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org-bank`,
            data:{
                key:'status',
                value: statusNumber, // 0 means de-activated in db
                id: bankId 
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
        changeStatusMutation.mutate({bankId: bank.id, statusNumber:'0'})
    }

    function verifyBankHandler(bank:Bank){
        // setSelelectedOrg(org.orgId)
        changeStatusMutation.mutate({bankId:bank.id, statusNumber:'1'})
    }

    function reActivateBankHandler(bank:Bank){
        changeStatusMutation.mutate({bankId:bank.id, statusNumber:'4'})
    }

    
      const allBanksQuery = useQuery({queryKey:['all-banks'], queryFn:fetchAllBanks, enabled:paseto !== '', staleTime:Infinity})
      const allBanksLength = allBanksQuery.data && allBanksQuery.data.data.length

      console.log(allBanksLength)

    const banksQuery = useQuery({queryKey:['banks', currentFilter], queryFn:fetchBanks, enabled:paseto !== '' && allBanksQuery.isFetched})
    const data = banksQuery.data && banksQuery.data.data

  
  

    function getCurrentFilterActions(){
        switch(currentFilter.id){
            // 1 = verified
            case '1': return verifiedBankActions 
            // 2 = unVerified
            case '2': return unVerifiedBankActions  
            // 0 = deActivated
            case '0': return deActivatedBankActions 
        }
    }

    function viewOrgDetails(org:Bank){
      // set state
      setSelelectedOrg(org)
      // opne drawer
      setIsDrawerOpen(true)

    }
  
    
      const onMenuClick=(e:any, record:Bank) => {
        const event = e.key
        switch(event){
          case 'deActivate': deActivateBankHandler(record);
          break;
          case 'verify': verifyBankHandler(record)
          break;
          case 'unVerify': reActivateBankHandler(record)
          break;
          case 'viewDetails': viewOrgDetails(record)
        }
      };
      
  
    const columns: ColumnsType<Bank> = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render:(_,record)=>{
            return(
                <div style={{display:'flex',alignItems:'center'}}>
                    {/* <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={'/favicon.ico'}/> */}
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text>{record.bankName}</Text>  
                        <Text style={{textTransform:'capitalize'}} type="secondary">{record.accountType}</Text>
                    </div>
                </div>
            )
        },
      },
      {
        title: 'Account No',
        dataIndex: 'accountNo',
        key: 'accountNo',
      },
      
      {
        title: 'Account Name',
        dataIndex: 'beneficiaryName',
        key: 'beneficiaryName'
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
          render: (_,record)=>{
              const date = dayjs(record.createdAt).format('MMM DD, YYYY')
              return(
            <Text>{date}</Text>
            )
        },
    },
    {
      dataIndex: 'actions', 
      key: 'actions',
      render:(_,record)=>{
        const items = getCurrentFilterActions()
        return (
        <Dropdown menu={{ items , onClick: (e)=>onMenuClick(e,record) }}>
            <MoreOutlined />
            </Dropdown>)
      } 
    }
    ];

        return (
            <div>
               {  allBanksQuery.data && allBanksLength == 0? null : <div style={{marginBottom:'1.5em', display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                  <Radio.Group defaultValue={currentFilter.id} buttonStyle="solid">
                      {bankFilters.map(bankFilter=>(
                          <Radio.Button key={bankFilter.id} onClick={()=>setCurrentStatus(bankFilter)} value={bankFilter.id}>{bankFilter.name}</Radio.Button>
                      )
                      )}
                  </Radio.Group>
                  <div style={{width: "20%",display:'flex', marginTop:'2rem', justifyContent:'space-between', alignItems:'center'}}>
                    <Button type='link' loading={banksQuery.isRefetching} onClick={()=>banksQuery.refetch()} icon={<ReloadOutlined />}>Refresh</Button>
                    <Button shape='round' type='primary' icon={<PlusOutlined/>} onClick={()=>router.push('/organizations/services/billings/new')}>New Bank</Button>
                  </div>
                </div>}
                {
                  allBanksQuery.data && allBanksLength == 0
                  ?<EmptyState>
                    <Button shape='round' type='primary' icon={<PlusOutlined/>} onClick={()=>router.push('/organizations/services/billings/new')}>New Bank</Button>
                  </EmptyState>
                  : <Table 
                  style={{width:'100%'}} 
                  key='dfadfe' 
                  loading={banksQuery.isLoading||banksQuery.isRefetching} 
                  columns={columns} 
                  dataSource={data} 
                  />
                }
                
                {
                  isDrawerOpen
                  ?<DetailDrawer isDrawerOpen={isDrawerOpen} closeDrawer={setIsDrawerOpen} selectedBank={selectedBank}/>
                  :null
                }
            </div>
    )



}

interface DrawerProps{
  selectedBank: Bank,
  isDrawerOpen: boolean,
  closeDrawer: (value:boolean)=>void
}
function DetailDrawer({selectedBank,isDrawerOpen,closeDrawer}:DrawerProps){

const queryClient = useQueryClient()

function closeDrawerHandler(){
  queryClient.invalidateQueries(['banks'])
  closeDrawer(!isDrawerOpen)
}

return( 
<Drawer title="Organization Details" width={640} placement="right" closable={true} onClose={closeDrawerHandler} open={isDrawerOpen}>
  
  <EditableName selectedBank={selectedBank}/>
  <EditableAddress selectedBank={selectedBank}/>
  <EditablePhone selectedBank={selectedBank}/>

  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Divider/>
    <Button danger type="link">De-activate Bank</Button>
    <Divider/>
  </div>

</Drawer>
)
}


interface EditableProp{
  selectedBank: Bank
}
function EditableName({selectedBank}:EditableProp){

  const [state, setState] = useState(selectedBank)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  const queryClient = useQueryClient()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const urlPrefix = useUrlPrefix()

 

  const nameMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org-bank`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const nameMutation = useMutation({
    mutationKey:['name'],
    mutationFn: nameMutationHandler,
    onSuccess:()=>{
      toggleEdit()
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      key:'name',
      value: updatedItem.name,
      orgId: selectedBank.id
    }
    const updatedOrg = {
      ...selectedBank,
      name: updatedItem.name
    }
    setState(updatedOrg)
    nameMutation.mutate(payload)
  }

  const {isLoading:isEditing} = nameMutation ;

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{state.bankName}</Text>
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableName"
     initialValues={selectedBank}
     onFinish={onFinish}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
          <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input a valid service name' }]}
          >
              <Input  disabled={isEditing} placeholder="Flexable org" />
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
    <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
      <Text type="secondary" style={{ marginRight: '2rem',}}>Name</Text>
    {isEditMode?editable:readOnly}
    </div>
  )
}
function EditableAddress({selectedBank}:EditableProp){

  const [state, setState] = useState(selectedBank)

  const urlPrefix = useUrlPrefix()

  const [isEditMode, setIsEditMode] = useState(false)
  const antInputRef = useRef();
  const [fullAddress, setFullAddress] = useState({
    latitude:0,
    longitude:0,
    state: '',
    country:'',
    city:''
})

  const {paseto} = useAuthContext()


  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const [form]  = Form.useForm()

  const extractFullAddress = (place:any)=>{
    const addressComponents = place.address_components 
        let addressObj = {
            state:'',
            country:'',
            city:'',
            latitude:place.geometry.location.lat(),
            longitude:place.geometry.location.lng()
        };
        addressComponents.forEach((address:any)=>{
            const type = address.types[0]
            if(type==='country') addressObj.country = address.long_name
            if(type === 'locality') addressObj.state = address.short_name
            if(type === 'administrative_area_level_1') addressObj.city = address.short_name
        })

        return addressObj
}

  const { ref: antRef } = usePlacesWidget({
    apiKey: `${process.env.NEXT_PUBLIC_MAPS_AUTOCOMPLETE_API}`, // move this key to env
    // apiKey: `AIzaSyB7ZUkMcIXpOKYU4r4iBMM9BFjCL5OpeeE`, // move this key to env
    onPlaceSelected: (place) => {
        // console.log(antInputRef.current.input)
        form.setFieldValue('address',place?.formatted_address)
        
        const fullAddress = extractFullAddress(place)
        setFullAddress(fullAddress)

        //@ts-ignore
      antInputRef.current.input.value = place?.formatted_address

    },
  });


  const nameMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org-bank`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const nameMutation = useMutation({
    mutationKey:['address'],
    mutationFn: nameMutationHandler,
    onSuccess:()=>{
      toggleEdit()
    }
  })

  function onFinish(updatedItem:any){
    const payload = {
      key:'country',
      value: updatedItem.country,
      orgId: selectedBank.id
    }
    const updatedOrg = {
      ...selectedBank,
      name: updatedItem.country
    }
    setState(updatedOrg)
    nameMutation.mutate(payload)
  }

  const {isLoading:isEditing} = nameMutation 

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{state.bankAddress}</Text>
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableAddress"
     initialValues={selectedBank}
     onFinish={onFinish}
     form={form}
     >
      <Row>
        <Col span={16} style={{height:'100%'}}>
        <Form.Item 
            name="address"
            rules={[{ required: true, message: 'Please input a valid address!' }]}
        >
            {/* <TextArea rows={3} placeholder='Apt. 235 30B NorthPointsettia Street, Syracuse'/> */}
            <Input ref={(c) => {
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
  return(
    <div style={{width:'100%', display:'flex', marginTop:'1rem', flexDirection:'column'}}>
      <Text type="secondary" style={{ marginRight: '2rem',}}>Address</Text>
    {isEditMode?editable:readOnly}
    </div>
  )
}
function EditablePhone({selectedBank}:EditableProp){

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()
  const urlPrefix = useUrlPrefix()

  const queryClient = useQueryClient()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{selectedBank.beneficiaryPhoneNumber}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )


  const nameMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/org-bank`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const nameMutation = useMutation({
    mutationKey:['phone'],
    mutationFn: nameMutationHandler,
    onSuccess:()=>{
      toggleEdit()
      queryClient.invalidateQueries(['banks'])
    }
  })

  function onFinish(field:any){
    const payload = {
      key:'phone',
      value: field.phone,
      orgId: selectedBank.id
    }
    console.log(payload)
    nameMutation.mutate(payload)
  }

  const {isLoading:isEditing} = nameMutation 

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editablePhone"
     initialValues={selectedBank}
     onFinish={onFinish}
     >
      <Row>
        <Col span={16}>
          <Form.Item
              name="phone"
              rules={[{ required: true, message: 'Please input a valid phone number' }]}
          >
              <Input disabled={isEditing} placeholder="09023234857" />
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
      <Text type="secondary" style={{ marginRight: '2rem',}}>Phone</Text>
      {isEditMode?editable:readOnly}
    </div>
  )
}




const bankFilters = [
  {
      id: '1',
      name: 'Verified'
  },
  {
      id: '2',
      name: 'Unverified'
  },
  {
      id: '0',
      name: 'Deactivated'
  },
]

const verifiedBankActions = [
    {
        key: 'deActivate',
        label: 'Deactivate'
    },
    {
        key: 'viewDetails',
        label: 'View details'
    },

]
const unVerifiedBankActions = [
    {
        key: 'verify',
        label: 'Verify'
    },
    {
        key: 'viewDetails',
        label: 'View details'
    },

]
const deActivatedBankActions = [
    {
        key: 'reActivate',
        label: 'Re-activate'
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
        <Text style={{textAlign:'center'}}>Seems like you are yet to add a billing address</Text>
        <div style={{marginTop:'1rem', display:'flex',justifyContent:'center'}}>
            {children}
        </div>
      </div>
    </div>
  )
}
