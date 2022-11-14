import { SearchOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Tag, InputRef, Input, Space} from 'antd'
import { useRouter } from 'next/router'
import Table, { ColumnsType, ColumnType, TableProps } from 'antd/lib/table';
import Highlighter from 'react-highlight-words'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FilterDropdownProps, FilterValue, SorterResult } from 'antd/lib/table/interface';



const {Title,Text} = Typography


interface Order {
    id: string;
    userId: string,
    name: string;
    ticketDate: string;
    quantity: number,
    orderStatus: string,
    ticketStatus: string,
    price:number,
    total: number,
    uniqueCode: string,
    userTicketId: string,
    paymentIntentStatus: string,
    orgServiceItemId: string,
  }

  type DataIndex = keyof Order;

const bookings: Order[] = [
    {
      id: '1',
      userId:'mbappai',
      ticketDate:'Jan 22, 2022',
      name: 'Avery pro line skip',
      quantity: 4,
      ticketStatus: 'Redeemed',
      orderStatus: 'Paid',
      userTicketId:'dfadre364ikji',
      price: 2500,
      total:230,
      uniqueCode: '34u12y',
      paymentIntentStatus: 'PAYMENT_PAID',
      orgServiceItemId:'bc6aaa35-e50e-40d5-a0ff-5e7fd20fe4b5',
    },
    {
      id: '2',
      name: 'Jim Green Bar',
      userId:'ommore',
      ticketDate:'Jan 12, 2022',
      quantity: 1,
      ticketStatus: 'Expired',
      orderStatus: 'Initiated',
      price: 2500,
      userTicketId:'dfadre364ikji',
      total:438,
      uniqueCode: '34u12y',
      paymentIntentStatus: 'PAYMENT_PAID',
      orgServiceItemId:'bc6aaa35-e50e-40d5-a0ff-5e7fd20fe4b5'
    },
    {
      id: '3',
      name: 'Joe Black Gym line skip',
      userId:'schachindra',
      ticketDate:'Apr 22, 2022',
      quantity: 2,
      ticketStatus: 'Valid',
      orderStatus: 'Paid',
      userTicketId:'dfadre364ikji',
      price: 2500,
      total:438,
      uniqueCode: '34u12y',
      paymentIntentStatus: 'PAYMENT_PAID',
      orgServiceItemId:'bc6aaa35-e50e-40d5-a0ff-5e7fd20fe4b5'
    },
  ];



export default function Bookings(){

  const router = useRouter()

  // const { isLoading, data } = useQuery(
  //   ['bookings'],
  //   async () => {
  //     const { data } = await axios.get(
  //       'https://random-data-api.com/api/vehicle/random_vehicle'
  //     );
  //     return data;
  //   },
  //   {
  //     refetchInterval: 1000,
  //   }
  // );

  const [searchText, setSearchText] = useState('');
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
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
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
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
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });


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
      ...getColumnSearchProps('name'),
    },
    
    {
      title: 'Order Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: orderStatus=>{
        let color = 'blue'
        if(orderStatus==='Paid') color='green'
        if(orderStatus==='Initiated') color='blue'
        return(
          <Tag color={color}>{orderStatus}</Tag>
        )
      },
      filters: [
        { text: 'Paid', value: 'Paid' },
        { text: 'Initiated', value: 'Initiated' },
      ], 
      filteredValue: filteredInfo.orderStatus || null,
      //@ts-ignore
      onFilter: (value: string, record) => record.orderStatus.includes(value),
    },
    {
      title: 'Unit Price',
      dataIndex: 'price',
      key: 'price',
      render: (price)=>{
        return(
          <Text>${price/100}</Text>
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
        const total = record.quantity * (record.price/100)
        return(
          <Text>${total}</Text>
        )
    }
    },
    {
      title: 'TicketDate',
      dataIndex: 'ticketDate',
      key: 'ticketDate',
    },
  ];


    return(
      <div>
        <Button type='link' style={{marginBottom:'.5em'}} onClick={clearFilters}>Clear filters</Button>
        <Table style={{width:'100%'}} columns={columns} onChange={handleChange} dataSource={bookings} />
      </div>
    )
}


