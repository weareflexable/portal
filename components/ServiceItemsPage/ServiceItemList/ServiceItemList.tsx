import React from 'react'
import {Card,List,Typography,Button,Avatar, Descriptions} from 'antd'
import {PlusCircleOutlined} from '@ant-design/icons'
import { useRouter } from 'next/router'
import { ServiceItem } from '../../../types/Services'
import { useOrgContext } from '../../../context/OrgContext'
import moment from 'moment'

const {Title,Text} = Typography


interface ServiceListProps{
    services: Array<any>,
    onCreateService: ()=>void,
    onSelectService: (service:ServiceItem)=>void,
    onDeleteService: (itemKey: string)=>void,
    serviceItemsIsLoading: boolean
}

export default function ServiceListProps({onDeleteService,serviceItemsIsLoading, onSelectService, services, onCreateService}:ServiceListProps){

    const router = useRouter()
    const {isAdmin} = useOrgContext()
 

    return(
        <div style={{display:'flex',flexDirection:'column', width:'100%',padding:'1em'}}>
            <Button type='link' icon={<PlusCircleOutlined />} shape='round' style={{alignSelf:'flex-start',marginBottom:'1em', display:'flex',alignItems:'center'}} onClick={onCreateService}>Add new service item</Button>
            <List
            itemLayout="horizontal"
            loading={serviceItemsIsLoading}
            dataSource={services}
            bordered={false}
            renderItem={(item:ServiceItem) => (
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
                title={item.name} 
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

                        <div style={{display:'flex',alignItems:'center'}}>
                            <div style={{display:'flex'}}>
                                <Text type='secondary' style={{marginRight:'.3em'}}>Start date:</Text>
                                <Text>{moment(item.startDate).format('MMM DD, YYYY')}  </Text>
                            </div>
                            ----
                            <div style={{display:'flex'}}>
                                <Text type='secondary' style={{marginRight:'.3em'}}>End date:</Text>
                                <Text>{moment(item.endDate).format('MMM DD, YYYY')}</Text>
                            </div>
                        </div>

                        <div style={{display:'flex',alignItems:'center'}}>
                            <div style={{display:'flex'}}>
                                <Text type='secondary' style={{marginRight:'.3em'}}>Start time:</Text>
                                <Text>{moment(item.startTime).format('MMM DD, YYYY')}  </Text>
                            </div>
                            ----
                            <div style={{display:'flex'}}>
                                <Text type='secondary' style={{marginRight:'.3em'}}>Range time:</Text>
                                <Text>{moment(item.endDate).format('MMM DD, YYYY')}</Text>
                            </div>
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