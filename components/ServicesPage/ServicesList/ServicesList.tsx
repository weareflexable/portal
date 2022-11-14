import React from 'react'
import {Card,List,Typography,Button,Avatar, Descriptions} from 'antd'
import {PlusCircleOutlined} from '@ant-design/icons'
import { useRouter } from 'next/router'
import { Service } from '../../../types/Services'
import { useOrgContext } from '../../../context/OrgContext'
import moment from 'moment'

const {Title,Text} = Typography


interface ServiceListProps{
    services: Array<any>,
    onCreateService: ()=>void,
    onSelectService: (service:Service)=>void,
    onDeleteService: (itemKey: string)=>void
}

export default function ServiceListProps({onDeleteService, onSelectService, services, onCreateService}:ServiceListProps){

    const router = useRouter()
    const {isAdmin} = useOrgContext()
 

    return(
        <div style={{display:'flex',flexDirection:'column', height:'100%',  background:'#ffffff', width:'70%',padding:'1em'}}>
            <Button type='link' icon={<PlusCircleOutlined />} shape='round' style={{alignSelf:'flex-start',marginBottom:'1em', display:'flex',alignItems:'center'}} onClick={onCreateService}>Add new service</Button>
            <List
            itemLayout="horizontal"
            dataSource={services}
            bordered={false}
            renderItem={(item:Service) => (
            <List.Item 
                style={{border:'none', background:'#f9f9f9',marginBottom:'.5em',padding:'1em', borderRadius:'4px'}}
                actions={[
                <Button 
                    danger 
                    size='small' 
                    disabled={!isAdmin} 
                    type='text' onClick={()=>onDeleteService(item.id)} 
                    key={item.id}>Delete</Button> , <Button size='small' type='link'  onClick={()=>onSelectService(item)} key={item.id}>Edit</Button>  
                 ]}
            >
                <List.Item.Meta
                key={item.id}
                title={<Title level={5}>{item.name}</Title>}
                description={
                    <div style={{display:'flex', width:'100%', flexDirection:'column'}}>
                        <div style={{display:'flex'}}>
                            <Text>{item.address}</Text>
                        </div>  
                        <div style={{display:'flex'}}>
                            <Text type='secondary' style={{marginRight:'.3em'}}>Service type:</Text>
                            <Text>{item.type}</Text>
                        </div>
                    </div> 
                 }
                /> 
            </List.Item>
             )}
             />           
        </div>
    )
}