import React from 'react'
import {Card,List,Typography,Button,Avatar} from 'antd'
import { useRouter } from 'next/router'
import { ServiceItem } from '../../../types/Services'

const {Title,Text} = Typography


interface ServiceListProps{
    services: Array<any>,
    onCreateService: ()=>void,
    onSelectService: (service:ServiceItem)=>void,
    onDeleteService: (itemKey: string)=>void
}

export default function ServiceListProps({onDeleteService, onSelectService, services, onCreateService}:ServiceListProps){

    const router = useRouter()

    const titleNode = (
        <div style={{display:'flex',justifyContent:'space-between'}} >
            <Title level={5}>Service Items</Title>
            <Button type='primary' shape='round' onClick={onCreateService}>Add new service</Button>
        </div>
    )

    return(
        <Card title={titleNode}>
            <List
            itemLayout="horizontal"
            dataSource={services}
            renderItem={(item, index) => (
            <List.Item
                actions={[<Button danger size='small'  type='text' onClick={()=>onDeleteService(item.key)} key={index}>Delete</Button> , <Button size='small' type='link'  onClick={()=>onSelectService(item)} key={index}>Edit</Button>   ]}
            >
                <List.Item.Meta
                key={index}
                title={<> <Text>{item.name}</Text> <Text type='secondary'>— ${item.price}</Text></>}
                description={ item.description }
                />  
            </List.Item>
             )}
             />           
        </Card>
    )
}