import React from 'react'
import {Card,List,Typography,Button,Avatar, Tag, Space} from 'antd'
import { useRouter } from 'next/router'
import Table, { ColumnsType } from 'antd/lib/table';
import Link from 'next/link';

const {Title,Text} = Typography


interface DataType {
    key: string;
    name: string;
    address: string;
    type: string;
  }

const data: DataType[] = [
    {
      key: '1',
      name: 'Calucer Juice Bar',
      address: 'New York No. 1 Lake Park',
      type: 'restaurant',
    },
    {
      key: '2',
      name: 'Jim Green Bar',
      address: 'London No. 1 Lake Park',
      type: 'Bar',
    },
    {
      key: '3',
      name: 'Joe Black Gym',
      address: 'Sidney No. 1 Lake Park',
      type: 'Gym',
    },
  ];


interface StoreListProps{
    stores: Array<DataType>,
    onRegisterNewStore: ()=>void
}
export default function StoreList({stores=data, onRegisterNewStore}:StoreListProps){

    const router = useRouter()

    const titleNode = (
        <div style={{display:'flex',justifyContent:'space-between'}} >
            <Title level={5}>Stores</Title>
            <Button onClick={onRegisterNewStore}>Launch new store</Button>
        </div>
    )

    const navigateToStorePage = (index:string)=>{
        router.push(`/stores/${index}`)
    }

    return(
      <div>
        <Button onClick={onRegisterNewStore}>Create new store</Button>
        <Table columns={columns} dataSource={stores} />
      </div>
    )
}


const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text,record) => <Link href={`/stores/${record.key}`}><a>{text}</a></Link>,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_,record) =>  (
              <Tag color={record.type==='admin'?'blue':'green'} key={record.key}>
                {record.type.toUpperCase()}
              </Tag>
            )
      },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];