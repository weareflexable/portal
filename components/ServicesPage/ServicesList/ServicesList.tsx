import React from 'react'
import {Card,List,Typography,Button,Avatar, Descriptions} from 'antd'
import {PlusCircleOutlined} from '@ant-design/icons'
import { useRouter } from 'next/router'
import { Service } from '../../../types/Services'
import { useOrgContext } from '../../../context/OrgContext'
import Link from 'next/link'
import { useServicesContext } from '../../../context/ServicesContext'

const {Title,Text} = Typography


interface ServiceListProps{
    services: Array<any>,
    onCreateService: ()=>void,
    onSelectService: (service:Service)=>void,
    onDeleteService: (itemKey: string)=>void,
    isLoadingServices: boolean
}

export default function ServiceListProps({onDeleteService, onSelectService, isLoadingServices, services, onCreateService}:ServiceListProps){

    const {asPath,push} = useRouter()
    const {isAdmin} = useOrgContext()
    const {switchService}= useServicesContext()
 
 
    const navigateToBookings = (service:Service)=>{
        // set the current service in local storage
        switchService(service)
        push(`${asPath}/bookings`)
    }

    return(
        <div style={{display:'flex',flexDirection:'column',   background:'#ffffff', width:'70%',padding:'1em'}}>
            <Button type='link' disabled={isLoadingServices} icon={<PlusCircleOutlined />} shape='round' style={{alignSelf:'flex-start',marginBottom:'1em', display:'flex',alignItems:'center'}} onClick={onCreateService}>Launch new service</Button>
            <List
            loading={isLoadingServices || !services}
            itemLayout="horizontal"
            dataSource={services}
            bordered={false}
            renderItem={(item:Service) => (
            <List.Item 
                // extra={<Button>Goto service</Button>}
                style={{border:'none', background:'#f9f9f9',marginBottom:'.5em',padding:'1em', borderRadius:'4px'}}
                actions={[
                <Button 
                    danger 
                    size='small' 
                    disabled={!isAdmin} 
                    type='text' onClick={()=>onDeleteService(item.id)} 
                    key={item.id}>Delete</Button> , <Button size='small' type='link'   onClick={()=>onSelectService(item)} key={item.id}>Edit</Button>  
                 ]}
            >
                <List.Item.Meta
                key={item.id}
                title={<Text style={{marginBottom:'0', cursor:'pointer'}} onClick={()=>navigateToBookings(item)}> {item.name} </Text>}
                description={
                    <div style={{display:'flex', width:'100%', flexDirection:'column'}}>
                        <div style={{display:'flex'}}>
                            <Text>{item.city},{item.state} · {item.country} </Text>
                        </div>  
                        <div style={{display:'flex'}}>
                            <Text type='secondary' style={{marginRight:'.3em'}}>Service type:</Text>
                            <Text>{item.name}</Text>
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