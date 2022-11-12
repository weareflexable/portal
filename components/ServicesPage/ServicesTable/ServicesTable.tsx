import React from 'react'
import {Card,List,Typography,Button,Avatar, Tag, Space} from 'antd'
import { useRouter } from 'next/router'
import Table, { ColumnsType } from 'antd/lib/table';
import Link from 'next/link';
// import {Store} from '../ServicesView/ServicesView'
import { Service } from '../../../types/Services';
import { useOrgContext } from '../../../context/OrgContext';

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


interface ServiceTableProps{
    services: Service[],
    showCreateForm: ()=>void,
    onDeleteStore: (storeId:string)=>void,
    onSelectStoreToEdit: (store: Service)=>void
}
export default function ServiceTable({onSelectStoreToEdit, onDeleteStore, services, showCreateForm}:ServiceTableProps){

  const {asPath} = useRouter()
  const {isAdmin} = useOrgContext()

  const columns: ColumnsType<Service> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text,record) => <Link href={`${asPath}/${record.id}`}><a>{text}</a></Link>,
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
          <Button size='small' disabled={!isAdmin} type='text' danger onClick={()=>onDeleteStore(record.id)}>Delete</Button>
          <Button type='link' onClick={()=>onSelectStoreToEdit(record)}>Edit</Button>
        </Space>
      ),
    },
  ];


    return(
      <div style={{display:'flex',flexDirection:'column'}}> 
        <Button type='primary' disabled={!isAdmin} shape='round' style={{marginBottom:'1em', alignSelf:'flex-end'}} onClick={showCreateForm}>Create new store</Button>
        <Table columns={columns} dataSource={services} />
      </div>
    )
}


