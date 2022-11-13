import { SearchOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useRef, useState } from 'react'
import {Typography,Button,Avatar, Tag, InputRef, Input, Space} from 'antd'
import { useRouter } from 'next/router'
import Table, { ColumnsType, ColumnType } from 'antd/lib/table';
import Highlighter from 'react-highlight-words'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FilterDropdownProps } from 'antd/lib/table/interface';



const {Title,Text} = Typography


interface DataType {
    id: string;
    userId: string,
    name: string;
    ticketDate: string;
    quantity: number,
    orderStatus: string,
    price:number,
    total: number,
    uniqueCode: string,
    paymentIntentStatus: string,
    orgServiceItemId: string,
  }

  type DataIndex = keyof DataType;

const bookings: DataType[] = [
    {
      id: '1',
      userId:'mbappai',
      ticketDate:'Jan 22, 2022',
      name: 'Avery pro line skip',
      quantity: 4,
      orderStatus: 'Redeemed',
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
      orderStatus: 'Expired',
      price: 2500,
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
      orderStatus: 'Valid',
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

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
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


  const columns: ColumnsType<any> = [
    {
      title: 'UserId',
      dataIndex: 'userId',
      key: 'userId',
    //   render: (text,record) => <Link href={`/stores/${record.key}`}><a>{text}</a></Link>,
    },
    {
      title: 'Unique Code',
      dataIndex: 'uniqueCode',
      key: 'uniqueCode',
      ...getColumnSearchProps('uniqueCode'),
    },
    {
      title: 'Service',
      dataIndex: 'name',
      key: 'name',
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
      title: 'Order Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: orderStatus=>{
        let color = 'blue'
        if(orderStatus==='Redeemed') color='green'
        if(orderStatus==='Expired') color='red'
        return(
          <Tag color={color}>{orderStatus}</Tag>
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
        <Table style={{width:'100%'}} columns={columns} dataSource={bookings} />
      </div>
    )
}


