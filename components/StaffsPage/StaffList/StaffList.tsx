import React from 'react'
import {Card,List,Typography,Button,Avatar, Tag} from 'antd'
import { useRouter } from 'next/router'
import {Staff} from '../../../types/Staff'
import { useOrgContext } from '../../../context/OrgContext'

const {Title,Text} = Typography

interface StaffListProps{
    staff: Staff[],
    onDeleteStaff: (id:string)=>void,
    onSelectStaffToEdit: (staff: Staff)=>void,
    showCreateForm: ()=>void
}
export default function StaffLis({onSelectStaffToEdit, staff, showCreateForm,onDeleteStaff}:StaffListProps){
    
    const {isAdmin} = useOrgContext()

    return(
        <div style={{display:'flex', padding:'1em',flexDirection:'column'}}>
             <Button type='primary' disabled={!isAdmin} shape='round' style={{marginBottom:'1em', alignSelf:'flex-end'}} onClick={showCreateForm}>Add new staff</Button>
            <List
            itemLayout="horizontal"
            dataSource={staff}
            renderItem={(item, index) => (
            <List.Item
                actions={[<Button danger type='text' disabled={!isAdmin} key={item.id} onClick={()=>onDeleteStaff(item.id)}>Delete</Button>,<Button type='link' size='small' key={item.id} onClick={()=>onSelectStaffToEdit(item)}>Change role</Button>]}
            >
             <List.Item.Meta
                title={<Text >{item.email} {<Tag color={item.role==='admin'?'green':'blue'}>{item.role}</Tag>
            }</Text>}
                />
            </List.Item>
             )}
             />           
        </div>
    )
}