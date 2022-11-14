import React from 'react'
import {Card,List,Typography,Button,Avatar, Descriptions} from 'antd'
import { useRouter } from 'next/router'
import { ServiceItem } from '../../../types/Services'
import { useOrgContext } from '../../../context/OrgContext'
import moment from 'moment'

const {Title,Text} = Typography


interface ServiceListProps{
    services: Array<any>,
    onCreateService: ()=>void,
    onSelectService: (service:ServiceItem)=>void,
    onDeleteService: (itemKey: string)=>void
}

export default function ServiceListProps({onDeleteService, onSelectService, services, onCreateService}:ServiceListProps){

    const router = useRouter()
    const {isAdmin} = useOrgContext()

    const titleNode = (
        <div style={{display:'flex',justifyContent:'space-between'}} >
            <Title level={5}>Service Items</Title>
            <Button type='primary' shape='round' onClick={onCreateService}>Add new service item</Button>
        </div>
    )

    return(
        <Card title={titleNode}>
            <List
            itemLayout="horizontal"
            dataSource={services}
            renderItem={(item:ServiceItem) => (
            <List.Item 
                actions={[<Button danger size='small' disabled={!isAdmin}  type='text' onClick={()=>onDeleteService(item.id)} key={item.id}>Delete</Button> , <Button size='small' type='link'  onClick={()=>onSelectService(item)} key={item.id}>Edit</Button>   ]}
            >
                <List.Item.Meta
                key={item.id}
                title={<Title level={5}>{item.name}</Title>}
                description={
                    <div style={{display:'flex', width:'100%', flexDirection:'column'}}>
                        <div style={{display:'flex'}}>
                            <Text type='secondary' style={{marginRight:'.3em'}}>Price:</Text>
                            <Text>${item.price/100}</Text>
                        </div>
                        <div style={{display:'flex'}}>
                            <Text type='secondary' style={{marginRight:'.3em'}}>Tickets per day:</Text>
                            <Text>{item.ticketsPerDay} tickets</Text>
                        </div>
                        <div style={{display:'flex'}}>
                            <Text type='secondary' style={{marginRight:'.3em'}}>Description:</Text>
                            <Text>{item.description}</Text>
                        </div>
                        <div style={{display:'flex'}}>
                            <Text type='secondary' style={{marginRight:'.3em'}}>Start date:</Text>
                            <Text>{moment(item.startDate).format('MMM DD, YYYY')}</Text>
                        </div>
                        <div style={{display:'flex'}}>
                            <Text type='secondary' style={{marginRight:'.3em'}}>End date:</Text>
                            <Text>{moment(item.endDate).format('MMM DD, YYYY')}</Text>
                        </div>
                    </div> 
                 }
                /> 
            </List.Item>
             )}
             />           
        </Card>
    )
}