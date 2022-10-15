import React from 'react'
import {Card,List,Typography,Button,Avatar} from 'antd'
import { useRouter } from 'next/router'

const {Title,Text} = Typography

interface ServiceListProps{
    services: Array<any>,
    onCreateService: ()=>void
}
export default function ServiceListProps({services, onCreateService}:ServiceListProps){

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
            <List.Item>
                <List.Item.Meta
                key={index}
                // avatar={<Avatar src={window.URL.createObjectURL(item.storeLogo[0])} />}
                title={<Text>{item.serviceName}</Text>}
                description={item.description}
                />
            </List.Item>
             )}
             />           
        </Card>
    )
}