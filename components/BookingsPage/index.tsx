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
import { Order } from '../../types/Booking';
import moment from 'moment';
import {ReloadOutlined} from '@ant-design/icons'
import { useAuthContext } from '../../context/AuthContext';
import { useServicesContext } from '../../context/ServicesContext';
import { DatePickRef } from 'antd/lib/date-picker/generatePicker/interface';
import { Moment } from 'moment-timezone';



const {Title,Text} = Typography


  type DataIndex = keyof Order;

// const bookings: Order[] = [
//     {
//       id: '1',
//       currency: 'USD',
//       serviceName:'Benhamins',
//       endTime: 'dfadfad',
//       userId:'mbappai',
//       ticketDate:'Jan 22, 2022',
//       name: 'Avery pro line skip',
//       quantity: 4,
//       ticketStatus: 'Redeemed',
//       orderStatus: 'Paid',
//       userTicketId:'dfadre364ikji',
//       unitPrice: 2500,
//       uniqueCode: '34u12y',
//       paymentStatus: 'PAYMENT_PAID',
//       paymentIntentId: 'fakdfa93343',
//       orgServiceItemId:'bc6aaa35-e50e-40d5-a0ff-5e7fd20fe4b5',
//       hash: ''
//     },
    
//   ];



export default function Bookings(){

  const router = useRouter()
  const {paseto} =  useAuthContext()
  const {currentService} = useServicesContext()

  const fetchServiceBookings = async()=>{
    const serviceId = currentService.id
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/orgservmanager/get-serv-orders?orgServiceId=${serviceId}`,
      {
        //@ts-ignore
        headers:{"Authorization":paseto} }
    );
    return data;
  }

  const { isLoading, data, isError, dataUpdatedAt, refetch } = useQuery(
    ['bookings',currentService.id], fetchServiceBookings,{refetchInterval: 5000}
  ); 

  const serviceBookings = data && data.payload
  const lastUpdate = moment(dataUpdatedAt).format('HH:mm:ss')




  const [searchText, setSearchText] = useState('');
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [searchedDate, setSearchedDate] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const ticketSearchRef = useRef(null)

  console.log(searchedColumn)

  const isFilterEmpty = Object.keys(filteredInfo).length === 0;

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

  const handleChange: TableProps<Order>['onChange'] = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Order> => ({
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

  const getTicketDateColumnSearchProps = (dataIndex: DataIndex): ColumnType<Order> =>({
    filterDropdown:({ setSelectedKeys, selectedKeys, confirm, clearFilters})=>(
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <DatePicker 
          value={moment(selectedKeys[0])}
          onChange={e => setSelectedKeys([moment(e).format('MMM DD, YYYY')] )}  
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
          textToHighlight={date ? moment(date).format('MMM DD, YYYY') : ''}
        />
      ) : (
        moment(date).format('MMM DD, YYYY')
      )
  }
  })

  const columns: ColumnsType<Order> = [
    {
      title: 'Service',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'UserId',
      dataIndex: 'userId',
      key: 'userId',
      ...getColumnSearchProps('userId'),
    },
    
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: paymentStatus=>{
        let color = 'blue'
        if(paymentStatus==='PAYMENT_PAID') color='green'
        if(paymentStatus==='PAYMENT_INITIATED') color='blue'
        return(
          <Tag color={color}>{paymentStatus}</Tag>
        )
      },
      filters: [
        { text: 'Paid', value: 'PAYMENT_PAID' },
        { text: 'Initiated', value: 'PAYMENT_INITIATED' },
      ], 
      filteredValue: filteredInfo.paymentStatus || null,
      //@ts-ignore
      onFilter: (value: string, record) => record.paymentStatus.includes(value),
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (unitPrice)=>{
        return(
          <Text>${unitPrice/100}</Text>
        )
    }
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (_,record)=>{
        const total = record.quantity * (record.unitPrice/100)
        return(
          <Text>${total}</Text>
        )
    }
    },
    {
      title: 'TicketDate',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (_,record)=>{
        const date = moment(record.startTime).format('MMM DD, YYYY')
        return(
          <Text>{date}</Text>
        )
    },
    ...getTicketDateColumnSearchProps('startTime')
  }
  ];



    return(
      <div>
        <div style={{marginBottom:'.5em', display:'flex', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <Text type='secondary'>Updated {lastUpdate} </Text>
          </div>
          <Button style={{display:'flex', alignItems:'center'}} icon={<ReloadOutlined/>} type='link' onClick={()=>refetch()}>Refresh</Button>
        </div>
        {!isFilterEmpty? <Button type='link' icon={<ClearOutlined />} style={{marginBottom:'.5em', display:'flex',alignItems:'center'}} onClick={clearFilters}>Clear filters</Button>:null}
        <Table style={{width:'100%'}} loading={isLoading} columns={columns} onChange={handleChange} dataSource={serviceBookings} />
      </div>
    )
}


