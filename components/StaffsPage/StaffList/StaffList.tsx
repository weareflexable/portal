import React from 'react'
import {Card,List,Typography,Button,Avatar, Tag} from 'antd'
import { useRouter } from 'next/router'

const {Title,Text} = Typography

interface StaffListProps{
    staffs: Array<any>,
    openFormModal: ()=>void,
    onDeleteStaff: (id:string)=>void,
    onAssignRole: (staffId: string)=>void
}
export default function StoreList({onAssignRole, staffs, openFormModal,onDeleteStaff}:StaffListProps){

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
            <List.Item
                actions={[<Button key={item.key} onClick={()=>onAssignRole(item.id)}>Change role </Button>,<Button key={item.key} onClick={()=>onDeleteStaff(item.id)}>Delete </Button>]}
            >
             <List.Item.Meta
                title={<Text onClick={()=>navigateToStorePage(String(index))} >{item.email} {<Tag color={item.role==='admin'?'green':'blue'}>{item.role}</Tag>
            }</Text>}
                />
            </List.Item>
             )}
             />           
        </Card>
    )
}