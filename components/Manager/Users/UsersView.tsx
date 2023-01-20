import { SearchOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Tag, InputRef, Input, Space, DatePicker} from 'antd'
import { useRouter } from 'next/router'
import Table, { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import Highlighter from 'react-highlight-words'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {ClearOutlined} from '@ant-design/icons'
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';
import moment from 'moment';
import {ReloadOutlined} from '@ant-design/icons'
import { DatePickRef } from 'antd/lib/date-picker/generatePicker/interface';
import dayjs from 'dayjs'
import {User} from './Users.types'
import { useAuthContext } from '../../../context/AuthContext';

 
const {Title,Text} = Typography


  type DataIndex = keyof User;


export default function UsersView(){

  const router = useRouter()
  const {paseto} = useAuthContext()


  const [searchText, setSearchText] = useState('');
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [searchedDate, setSearchedDate] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const ticketSearchRef = useRef(null)

  const isFilterEmpty = Object.keys(filteredInfo).length === 0;

  async function fetchUsers(){
    const res = await axios({
      method:'get',
      url: `${process.env.NEXT_PUBLIC_NEW_API_URL}/super-admin/users-list`,
      headers:{
        "Authorization": paseto
      }
    })
    return res.data.data 
  }

  const usersQuery = useQuery({queryKey:['uses'],queryFn:fetchUsers})

  console.log(usersQuery.data)

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

  const handleChange: TableProps<User>['onChange'] = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<User> => ({
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

  const getTicketDateColumnSearchProps = (dataIndex: DataIndex): ColumnType<User> =>({
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
        moment(date).format('MMM DD, YYYY')
      )
  }
  })

  const columns: ColumnsType<User> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render:(email)=>{
        return(<Text ellipsis>{email}</Text>)
      },
      ...getColumnSearchProps('email'),
    },
    
    // {
    //   title: 'Payment Status',
    //   dataIndex: 'paymentStatus',
    //   key: 'paymentStatus',
    //   render: paymentIntentStatus=>{
    //     let color = 'blue'
    //     if(paymentIntentStatus==='PAID') color='green'
    //     if(paymentIntentStatus==='PAYMENT_INITIATED') color='blue'
    //     return(
    //       <Tag color={color}>{paymentIntentStatus}</Tag>
    //     )
    //   },
    //   filters: [
    //     { text: 'Paid', value: 'PAID' },
    //     { text: 'Initiated', value: 'PAYMENT_INITIATED' },
    //   ], 
    //   filteredValue: filteredInfo.paymentIntentStatus || null,
    //   //@ts-ignore
    //   onFilter: (value: string, record) => record.paymentIntentStatus.includes(value),
    // },
    {
      title: 'Role',
      dataIndex: 'userRoleName',
      key: 'userRoleName',
      render: (role)=>{
        return(
          <Tag>{role}</Tag>
        )
    }
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
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
    ...getTicketDateColumnSearchProps('createdAt')
  }
  ];



    return(
    <div style={{marginBottom:'.5em', display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
        {!isFilterEmpty? <Button type='link' icon={<ClearOutlined />} style={{marginBottom:'.5em', display:'flex',alignItems:'center'}} onClick={clearFilters}>Clear filters</Button>:null}
        <Table style={{width:'100%'}} key='fdva' columns={columns} onChange={handleChange} dataSource={usersQuery.data} />
      </div>
    )
}




// const users:User[] = [
//     {
//         id: '34343',
//         name: 'Mujahid Bappai',
//         email: 'mujahid.bappai@yahoo.com',
//         mobileNumber: '08043437583',
//         gender: 'male',
//         createdAt: "2023-01-07T10:45:24.002929Z",
//         city: 'Kano',
//         country: 'Nigeria',
//         userRoleName: 'User',
//         profilePic: 'bafkreic3hz2mfy7rpyffzwbf2jfklehmuxnvvy3ardoc5vhtkq3cjd7of4'  
//     },
   
// ]