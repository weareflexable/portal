import React from 'react'
import {Card,List,Typography,Button,Avatar} from 'antd'
import { useRouter } from 'next/router'

const {Title,Text} = Typography

type Service = {
    key:string,
    name: string,
    price: number,
    description: string,
    serviceDuration: string
}

interface ServiceListProps{
    services: Array<any>,
    onCreateService: ()=>void,
    onSelectService: (service:Service)=>void,
    onDeleteService: (itemKey: string)=>void
}

export default function ServiceListProps({onDeleteService, onSelectService, services, onCreateService}:ServiceListProps){

    const router = useRouter()

    const titleNode = (
        <div style={{display:'flex',justifyContent:'space-between'}} >
            <Title level={5}>Services</Title>
            <Button onClick={onCreateService}>Add new service</Button>
        </div>
    )

    return(
        <Card title={titleNode}>
            <List
            itemLayout="horizontal"
            dataSource={services}
            renderItem={(item, index) => (
            <List.Item
                actions={[<Button onClick={()=>onSelectService(item)} key={index}>Edit</Button>, <Button onClick={()=>onDeleteService(item.key)} key={index}>Delete</Button>    ]}
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