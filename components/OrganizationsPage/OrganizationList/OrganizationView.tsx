import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NewOrg } from "../../../types/OrganisationTypes";
import useOrgs from "../../../hooks/useOrgs";
const {Text} = Typography
import { SearchOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Upload, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form} from 'antd'
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


var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime) 


export default function AdminOrgsView(){

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
        // dataIndex: 'address',
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
        ...getTableActions()
    }
    ];

    function getTableActions(){
        if(currentStatus.name === 'Approved'){
            return {
                dataIndex: 'actions', 
                key: 'actions',
                //@ts-ignore
                render:(_,record:NewOrg)=>{
                  const items = getCurrentStatusActionItems()
                  return (<Button type='text' onClick={()=>viewOrgDetails(record)} icon={<MoreOutlined/>}/>)
                }
              }
        }
        return {}
    }

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
                <Table style={{width:'100%'}} key='dfadfe' loading={orgQuery.isLoading||orgQuery.isRefetching} columns={columns} onChange={handleChange} dataSource={orgs} />
                {
                  isDrawerOpen && currentStatus.name === 'Approved'
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
  <EditableZipCode selectedOrg={selectedOrg}/>
  <EditableLogoImage selectedOrg={selectedOrg}/>
  <EditableCoverImage selectedOrg={selectedOrg}/>

  <div style={{display:'flex', marginTop:'5rem', flexDirection:'column', justifyContent:'center'}}>
    <Divider/>
    <Button danger type="link">De-activate organization</Button>
    <Divider/>
  </div>

</Drawer>
)
}


interface EditableProp{
  selectedOrg: NewOrg
}
function EditableName({selectedOrg}:EditableProp){

  const [state, setState] = useState(selectedOrg)

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  const queryClient = useQueryClient()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

 

  const nameMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,updatedItem,{
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
      //@ts-ignore
      orgId: selectedOrg.orgId
    }
    const updatedOrg = {
      ...selectedOrg,
      name: updatedItem.name
    }
    setState(updatedOrg)
    nameMutation.mutate(payload)
  }

  const {isLoading:isEditing} = nameMutation ;

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{state.name}</Text>
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableName"
     initialValues={selectedOrg}
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
function EditableAddress({selectedOrg}:EditableProp){

  const [state, setState] = useState(selectedOrg)

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
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,updatedItem,{
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
      orgId: selectedOrg.id
    }
    const updatedOrg = {
      ...selectedOrg,
      name: updatedItem.country
    }
    setState(updatedOrg)
    nameMutation.mutate(payload)
  }

  const {isLoading:isEditing} = nameMutation 

  const readOnly = (
    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Text>{`${state.street}, ${state.country}, ${state.city}`}</Text>
      <Button type="link" onClick={toggleEdit}>Edit</Button>
    </div>
)

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableAddress"
     initialValues={selectedOrg}
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
function EditablePhone({selectedOrg}:EditableProp){

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  const queryClient = useQueryClient()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{selectedOrg.phone}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )

  const nameMutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,updatedItem,{
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
      queryClient.invalidateQueries(['organizations'])
    }
  })

  function onFinish(field:any){
    const payload = {
      key:'phone',
      value: field.phone,
      orgId: selectedOrg.id
    }
    console.log(payload)
    nameMutation.mutate(payload)
  }

  const {isLoading:isEditing} = nameMutation 

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editablePhone"
     initialValues={selectedOrg}
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
function EditableZipCode({selectedOrg}:EditableProp){

  const [isEditMode, setIsEditMode] = useState(false)

  const queryClient = useQueryClient()

  const {paseto} = useAuthContext()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{selectedOrg.zipCode}</Text>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )

  const mutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,updatedItem,{
      headers:{
          //@ts-ignore
          "Authorization": paseto
      }
    })
      return data;
  }
  const mutation = useMutation({
    mutationKey:['zipCode'],
    mutationFn: mutationHandler,
    onSuccess:()=>{
      toggleEdit()
      queryClient.invalidateQueries(['organizations'])
    }
  })

  function onFinish(field:any){
    const payload = {
      key:'zip_code',
      value: field.zipCode,
      orgId: selectedOrg.id
    }
    mutation.mutate(payload)
  }

  const {isLoading:isEditing} = mutation

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableZipCode"
     initialValues={selectedOrg}
     onFinish={onFinish}
     >
      <Row>
        <Col span={10}>
          <Form.Item
              name="zipCode"
              rules={[{ required: true, message: 'Please input a valid zip code' }]}
          >
              <Input disabled={isEditing} placeholder="937462" />
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
      <Text type="secondary" style={{ marginRight: '2rem',}}>Zip Code</Text>
      {isEditMode?editable:readOnly}
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

  const readOnly = (
      <div style={{width:'100%', marginTop:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Image style={{width:'170px', height:'170px', border:'1px solid #f2f2f2', borderRadius:'50%'}} alt='Logo image for organization' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${updatedLogoImageHash}`}/>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )

  const mutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,updatedItem,{
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
      orgId: selectedOrg.orgId
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
              
              <Upload name="logoImageHash" listType="picture" multiple={false}>
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
function EditableCoverImage({selectedOrg}:EditableProp){

  const [isEditMode, setIsEditMode] = useState(false)
  const [isHashingImage, setIsHashingImage] = useState(false)
  const [updatedCoverImageHash, setUpdatedCoverImageHash] = useState(selectedOrg.logoImageHash)

  const queryClient = useQueryClient()

  const {paseto} = useAuthContext()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const readOnly = (
      <div style={{width:'100%', marginTop:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Image style={{width:'500px', height:'200px', objectFit:'cover', border:'1px solid #f2f2f2'}} alt='cover image for organization' src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${updatedCoverImageHash}`}/>
        <Button type="link" onClick={toggleEdit}>Edit</Button>
      </div>
  )

  const mutationHandler = async(updatedItem:any)=>{
    const {data} = await axios.patch(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,updatedItem,{
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
    const coverImageRes = await field.coverImage

    setIsHashingImage(true)
    const coverImageHash = await asyncStore(coverImageRes[0].originFileObj)
    setIsHashingImage(false)

    console.log(coverImageHash)

    const payload = {
      key:'cover_image_hash',
      value: coverImageHash,
      orgId: selectedOrg.id
    }
    setUpdatedCoverImageHash(coverImageHash)
    mutation.mutate(payload)
  }

  const {isLoading:isEditing} = mutation

  const extractCoverImage = async(e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
    return e;
    }

   return e?.fileList;
};


  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableCoverImage"
     initialValues={selectedOrg}
     onFinish={onFinish}
     >
      <Row>
        <Col span={10}>
          <Form.Item
              name="coverImage"
              valuePropName="coverImage"
              getValueFromEvent={extractCoverImage}
              rules={[{ required: true, message: 'Please input a valid zip code' }]}
          >
              
              <Upload name="coverImageHash" listType="picture" multiple={false}>
                   <Button size='small' disabled={isHashingImage} type='link'>Upload cover image</Button>
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
      <Text type="secondary" style={{ marginRight: '2rem',}}>Cover Image</Text>
      {isEditMode?editable:readOnly}
    </div>
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
        key: 'viewDetails',
        label: 'View details'
    },

]
const inReviewOrgsActions = [
    {
        key: 'viewDetails',
        label: 'View details'
    },

]
const rejectedOrgsActions = [
    {
        key: 'viewDetails',
        label: 'View details'
    },

]