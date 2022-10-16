import React from 'react'
import {Card,List,Typography,Button,Avatar, Tag} from 'antd'
import { useRouter } from 'next/router'
import {Staff} from '../StaffView/StaffView'

const {Title,Text} = Typography

interface StaffListProps{
    staffs: Array<any>,
    openFormModal: ()=>void,
    onDeleteStaff: (id:string)=>void,
    onSelectStaffToEdit: (staff: Staff)=>void
}
export default function StoreList({onSelectStaffToEdit, staffs, openFormModal,onDeleteStaff}:StaffListProps){

    const router = useRouter()

    const titleNode = (
        <div style={{display:'flex',justifyContent:'space-between'}} >
            <Title level={5}>Staffs</Title>
            <Button onClick={openFormModal}>Register new staff</Button>
        </div>
    )

    return(
        <Card title={titleNode}>
            <List
            itemLayout="horizontal"
            dataSource={staffs}
            renderItem={(item, index) => (
            <List.Item
                actions={[<Button key={item.key} onClick={()=>onSelectStaffToEdit(item)}>Change role</Button>,<Button key={item.key} onClick={()=>onDeleteStaff(item.id)}>Delete </Button>]}
            >
             <List.Item.Meta
                title={<Text >{item.email} {<Tag color={item.role==='admin'?'green':'blue'}>{item.role}</Tag>
            }</Text>}
                />
            </List.Item>
             )}
             />           
        </Card>
    )
}