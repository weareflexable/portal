import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NewOrg } from "../../../../types/OrganisationTypes";
import useOrgs from "../../../../hooks/useOrgs";
const {Text} = Typography
import { SearchOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Tag, Image, Descriptions, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps, Drawer, Row, Col, Divider, Form} from 'antd'
import { useRouter } from 'next/router'
import Highlighter from 'react-highlight-words'
import axios from 'axios';
import {MoreOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';

import { useAuthContext } from '../../../../context/AuthContext';
import { useServicesContext } from '../../../../context/ServicesContext';
import { DatePickRef } from 'antd/lib/date-picker/generatePicker/interface';
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import EditOrganizationForm from "../EditOrganizationForm/EditOrganizationForm";
import { useOrgContext } from "../../../../context/OrgContext";


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

    function gotoServices(org:NewOrg){
        console.log(org)
        // switch org
        switchOrg(org)
        // navigate user to services page
        router.push('/organizations/services/')
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
        changeStatusMutation.mutate({orgId:org.orgId, statusNumber:'0'})
    }

    function reviewHandler(org:NewOrg){
        // setSelelectedOrg(org.orgId)
        changeStatusMutation.mutate({orgId:org.orgId, statusNumber:'2'})
    }

    function rejectOrgHandler(org:NewOrg){
        changeStatusMutation.mutate({orgId:org.orgId, statusNumber:'4'})
    }

    function acceptOrgHandler(org:NewOrg){
        // setSelelectedOrg(org.orgId)
        changeStatusMutation.mutate({orgId:org.orgId, statusNumber:'1'})
    }

    const orgQuery = useQuery({queryKey:['organizations', currentStatus], queryFn:fetchOrgs, enabled:paseto !== ''})
    const approvedOrgs = orgQuery.data && orgQuery.data.data


    
  
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
                    <Image style={{width:'30px', height: '30px', marginRight:'.8rem', borderRadius:'50px'}} alt='Organization logo' src={'/favicon.ico'}/>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text>{record.name}</Text>  
                        <Text type="secondary">{record.email}</Text>
                    </div>
                </div>
            )
        },
        // ...getColumnSearchProps('name'),
      },
      {
        title: 'Country',
        dataIndex: 'country',
        key: 'country',
      },
      
      {
        title: 'City',
        dataIndex: 'city',
        key: 'city'
      },
      // {
      //   title: 'State',
      //   dataIndex: 'state',
      //   key: 'state'
      // },
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
    {
      dataIndex: 'actions', 
      key: 'actions',
      render:(_,record)=>{
        const items = getCurrentStatusActionItems()
        return (<Dropdown.Button menu={{ items , onClick: (e)=>onMenuClick(e,record) }}>Actions</Dropdown.Button>)
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

                </div>
                <Table style={{width:'100%'}} key='dfadfe' loading={orgQuery.isLoading} columns={columns} onChange={handleChange} dataSource={approvedOrgs} />
                {
                  isDrawerOpen
                  ?<DetailDrawer  selectedOrg={selectedOrg} />
                :null
                }
            </div>
    )


    interface DrawerProps{
      selectedOrg: NewOrg
    }
  function DetailDrawer({selectedOrg}:DrawerProps){


    return( 
    <Drawer title="Organization Details" width={640} placement="right" closable={true} onClose={() => setIsDrawerOpen(false)} open={isDrawerOpen}>
      
      <EditableName selectedOrg={selectedOrg}/>

    </Drawer>
    )
  }
}


interface EditableProp{
  selectedOrg: NewOrg
}
function EditableName({selectedOrg}:EditableProp){

  const [isEditMode, setIsEditMode] = useState(false)

  const {paseto} = useAuthContext()

  function toggleEdit(){
    setIsEditMode(!isEditMode)
  }

  const readOnly = (
      <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <Text>{selectedOrg.name}</Text>
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
      orgId: selectedOrg.orgId
    }
    console.log(payload)
    nameMutation.mutate(payload)
  }

  const {isLoading:isEditing} = nameMutation 

  const editable = (
    <Form
     style={{ marginTop:'.5rem' }}
     name="editableName"
     initialValues={selectedOrg}
     onFinish={onFinish}
     >
      <Row>
        <Col span={16}>
          <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input a valid service name' }]}
          >
              <Input disabled={isEditing} placeholder="Flexable org" />
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


interface ReadOnlyProps{
  selectedOrg: NewOrg,
  onToggleEdit: ()=>void
}

  function ReadOnly({selectedOrg, onToggleEdit}:ReadOnlyProps){
    return(
      <div style={{width:'100%'}}>
        <div>
        <Text type="secondary" style={{ marginRight: '2rem' }}>Name</Text>
        <Text>{selectedOrg.name}</Text>
      </div>
      <div>
        <Text type="secondary" style={{ marginRight: '2rem' }}>Country</Text>
        <Text>{selectedOrg.country}</Text>
      </div>
      <div>
        <Text type="secondary" style={{ marginRight: '2rem' }}>City</Text>
        <Text>{selectedOrg.city}</Text>
      </div>
      <div>
        <Text type="secondary" style={{ marginRight: '2rem' }}>Zip Code</Text>
        <Text>{selectedOrg.zipCode}</Text>
      </div>
      <div>
        <Text type="secondary" style={{ marginRight: '2rem' }}>Phone</Text>
        <Text>{selectedOrg.phone}</Text>
      </div>

      <Button onClick={onToggleEdit}>Edit </Button>
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
        key: 'deActivate',
        label: 'De-activate'
    },
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