import React from 'react'
import {Card,List,Typography,Button,Avatar, Tag} from 'antd'
import { useRouter } from 'next/router'
import {Staff} from '../../../types/Staff'

const {Title,Text} = Typography

interface StaffListProps{
    staff: Staff[],
    onDeleteStaff: (id:string)=>void,
    onSelectStaffToEdit: (staff: Staff)=>void
}
export default function StaffLis({onSelectStaffToEdit, staff, onDeleteStaff}:StaffListProps){
    

    return(
        <Card>
            <List
            itemLayout="horizontal"
            dataSource={staff}
            renderItem={(item, index) => (
            <List.Item
                actions={[<Button key={item.id} onClick={()=>onSelectStaffToEdit(item)}>Change role</Button>,<Button key={item.id} onClick={()=>onDeleteStaff(item.id)}>Delete </Button>]}
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