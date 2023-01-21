import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NewOrg } from "../../../../types/OrganisationTypes";
import useOrgs from "../../../../hooks/useOrgs";
const {Text} = Typography
import { SearchOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Tag, Image, Table, InputRef, Input, Space, DatePicker, Radio, Dropdown, MenuProps} from 'antd'
import { useRouter } from 'next/router'
import Highlighter from 'react-highlight-words'
import axios from 'axios';
import {MoreOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';
import {ReloadOutlined} from '@ant-design/icons'
import { useAuthContext } from '../../../../context/AuthContext';
import { useServicesContext } from '../../../../context/ServicesContext';
import { DatePickRef } from 'antd/lib/date-picker/generatePicker/interface';
import dayjs from 'dayjs'
import  { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';


export default function ApprovedOrgs(){

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
  
  
    // const isFilterEmpty = Object.keys(filteredInfo).length === 0;

    type DataIndex = keyof NewOrg;

    const [selectedOrg, setSelelectedOrg] = useState(null)
    const [currentStatus, setCurrentStatus] = useState({id:'1',name: 'In Review'})

    async function fetchApprovedOrgs(){
    const res = await axios({
            method:'get',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/orgs?key=status&value=${currentStatus.id}&pageNumber=0&pageSize=10`,
            headers:{
                "Authorization": paseto
            }
        })

        return res.data;
   
    }

    async function deActivateOrg(orgId: string){
        const res = await axios({
            method:'patch',
            url:`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/org`,
            data:{
                key:'status',
                value: '0', // 0 means de-activated in db
                org_id: orgId
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

    
    const deActivateOrgMutation = useMutation(['deActivateOrgMutation'],{
        mutationFn: deActivateOrg,
        onSuccess:(data:any)=>{
            queryClient.invalidateQueries({queryKey:['approvedOrgs']})
        },
        onError:()=>{
            console.log('Error changing status')
        }
    })



    function deActivateOrgHandler(org:any){
        setSelelectedOrg(org.org_id)
        deActivateOrgMutation.mutate(org.org_id)
    }

    const orgQuery = useQuery({queryKey:['approvedOrgs', currentStatus], queryFn:fetchApprovedOrgs, enabled:paseto !== ''})
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

    const items = [
        {
          key: '1',
          label: 'Reject',
        },
        {
          key: '2',
          label: 'Accept',
        },
        {
          key: '3',
          label: 'Org Details',
        },
      ];

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
            id: '3',
            name: 'Rejected'
        },
        {
            id: '4',
            name: 'De-activated'
        },
    ]

      const onMenuClick: MenuProps['onClick'] = (e) => {
        console.log('click', e);
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
    //   title: 'Phone',
      dataIndex: 'actions',
      key: 'actions',
      render:()=>(
        // <Button type="text" icon={<MoreOutlined />} size={'small'} />
        <Dropdown.Button menu={{ items, onClick: onMenuClick }}>Actions</Dropdown.Button>
      )
    },
    ];
  
    

        return (

            // <Card style={{ width: '100%', marginTop: '1em' }}>
            //  <List
            //     size="small"
            //     bordered={false}
            //     loading={orgQuery.isLoading}
            //     dataSource={approvedOrgs}
            //     renderItem={(item:any )=> 
            //     <List.Item
            //         actions={[<Button key={item.id} shape='round' loading={selectedOrg === item.orgId && deActivateOrgMutation.isLoading} onClick={()=>deActivateOrgHandler(item)} type='primary' >De-activate</Button>]}
            //         style={{ border: 'none', backgroundColor: '#f9f9f9', marginBottom: '.5em', padding: '1em', borderRadius: '4px' }}
            //         key={item.id}
            //     >
            //         <List.Item.Meta
            //             avatar={<Avatar src={`https://nftstorage.link/ipfs/${item.imageHash}`} />}
            //             title={<div style={{ display: 'flex' }}>
            //                 <Text onClick={()=>gotoServices(item)} style={{ cursor:'pointer', color:'#1890ff', marginRight: '1em' }}>{item.name}</Text>
            //                 {/* <Tag>{item.role === 'STAFF' ? 'Employee' : item.role}</Tag> */}
            //             </div>} />

            //     </List.Item>} />
            // </Card>
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
            </div>
    )
}