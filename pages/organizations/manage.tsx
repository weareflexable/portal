import { Content } from 'antd/lib/layout/layout'
import { Typography, Row, Button, Col, Avatar, List, Tag } from 'antd'
const {Title,Text} = Typography
import {ArrowLeftOutlined} from '@ant-design/icons'
import React from 'react'
import {PlusCircleOutlined} from '@ant-design/icons'

import { useRouter } from 'next/router'
import BillingsLayout from '../../components/Layout/BillingsLayout'
import BillingsView from '../../components/BillingsPage'


const data = [
    {
      title: 'Mujahid',
      email: 'mujahid.bappai@yahoo.com',
      role: 'Owner'
    },
    {
      title: 'Peter Richards',
      email: 'peterrichards@gmail.com',
      role: 'Co-admin'
    },
    {
      title: 'Omololu Seum',
      email: 'omololu@gmail.com',
      role: 'Co-admin'
    },
    {
      title: 'Segun Adebayo',
      email: 'segunadebayo@yahoo.com',
      role: 'Co-admin'
    },
  ];

export default function Manage(){

    const router = useRouter()
    
    return(
    <div style={{background:'#f6f6f6', height:'100%', minHeight:'60vh'}}>
        <div style={{width:'60%'}}>
            <Title level={2}>Manage Access</Title>
            <Text>Any user that gets added here will assume the same role as you to continue to be a co-admin in your organization; meaning they also get permision to create, read, edit and delete all assets in your organization </Text>
        </div>
        
        <Button shape='round' icon={<PlusCircleOutlined rev={undefined}/>} style={{marginTop:'3rem'}}>Add new co-admin</Button>

        <List
            itemLayout="horizontal"
            dataSource={data}
            style={{marginTop:'3rem', width:'50%'}}
            renderItem={(item, index) => (
            <List.Item
               actions={[<Button shape='round' key="list-loadmore-edit">Edit</Button>, <Button shape='round' danger key="list-loadmore-more">Delete</Button>]}
            >
                <List.Item.Meta
                avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                title={<a href="https://ant.design">{item.title}</a>}
                description={
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Text>{item.email}</Text>
                        <Tag style={{width: 'fit-content', marginTop:'.3rem'}}>{item.role}</Tag> 
                    </div>
                }
                
                />
            </List.Item>
    )}
  />
    </div>
    )
}

Manage.PageLayout = BillingsLayout
