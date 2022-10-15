import React from 'react'
import {Card,List,Typography,Button,Avatar} from 'antd'
import { useRouter } from 'next/router'

const {Title,Text} = Typography

interface StaffListProps{
    staffs: Array<any>,
    openFormModal: ()=>void
}
export default function StoreList({staffs, openFormModal}:StaffListProps){

    const router = useRouter()

    const titleNode = (
        <div style={{display:'flex',justifyContent:'space-between'}} >
            <Title level={5}>Staffs</Title>
            <Button onClick={openFormModal}>Register new staff</Button>
        </div>
    )

    const navigateToStorePage = (index:string)=>{
        router.push(`/dashboard/${index}`)
    }

    return(
        <Card title={titleNode}>
            <List
            itemLayout="horizontal"
            dataSource={staffs}
            renderItem={(item, index) => (
            <List.Item>
                <List.Item.Meta
                title={<Text onClick={()=>navigateToStorePage(String(index))} >{item.email}</Text>}
                />
            </List.Item>
             )}
             />           
        </Card>
    )
}