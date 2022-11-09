import React from 'react'
import {Card,List,Typography,Button,Avatar, Tag, Space} from 'antd'
import { useRouter } from 'next/router'
import Table, { ColumnsType } from 'antd/lib/table';
import Link from 'next/link';
import {Store} from '../VenueView/VenueView'

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
    stores: Store[],
    onRegisterNewStore: ()=>void,
    onDeleteStore: (storeId:string)=>void,
    onSelectStoreToEdit: (store: Store)=>void
}
export default function StoreList({onSelectStoreToEdit, onDeleteStore, stores, onRegisterNewStore}:StoreListProps){

  const router = useRouter()


  const columns: ColumnsType<Store> = [
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
          <Button type='link' onClick={()=>onSelectStoreToEdit(record)}>Edit</Button>
          <Button onClick={()=>onDeleteStore(record.key)}>Delete</Button>
        </Space>
      ),
    },
  ];


    return(
      <div>
        <Button style={{marginBottom:'1em'}} onClick={onRegisterNewStore}>Create new store</Button>
        <Table columns={columns} dataSource={stores} />
      </div>
    )
}


