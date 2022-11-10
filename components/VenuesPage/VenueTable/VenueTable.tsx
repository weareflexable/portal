import React from 'react'
import {Card,List,Typography,Button,Avatar, Tag, Space} from 'antd'
import { useRouter } from 'next/router'
import Table, { ColumnsType } from 'antd/lib/table';
import Link from 'next/link';
import {Store} from '../VenueView/VenueView'
import { Venue } from '../../../types/Venue';

const {Title,Text} = Typography


interface DataType {
    id: string;
    name: string;
    address: string;
    type: string;
  }

const data: DataType[] = [
    {
      id: '1',
      name: 'Calucer Juice Bar',
      address: 'New York No. 1 Lake Park',
      type: 'restaurant',
    },
    {
      id: '2',
      name: 'Jim Green Bar',
      address: 'London No. 1 Lake Park',
      type: 'Bar',
    },
    {
      id: '3',
      name: 'Joe Black Gym',
      address: 'Sidney No. 1 Lake Park',
      type: 'Gym',
    },
  ];


interface VenueTableProps{
    venues: Venue[],
    showCreateForm: ()=>void,
    onDeleteStore: (storeId:string)=>void,
    onSelectStoreToEdit: (store: Venue)=>void
}
export default function VenueTable({onSelectStoreToEdit, onDeleteStore, venues, showCreateForm}:VenueTableProps){

  const router = useRouter()


  const columns: ColumnsType<Venue> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text,record) => <Link href={`/stores/${record.id}`}><a>{text}</a></Link>,
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
              <Tag color={record.type==='admin'?'blue':'green'} key={record.id}>
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
          <Button onClick={()=>onDeleteStore(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];


    return(
      <div>
        <Button style={{marginBottom:'1em'}} onClick={showCreateForm}>Create new store</Button>
        <Table columns={columns} dataSource={venues} />
      </div>
    )
}


