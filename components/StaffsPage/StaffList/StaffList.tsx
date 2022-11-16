import React from 'react'
import {Card,List,Typography,Button,Avatar, Tag} from 'antd'
import { useRouter } from 'next/router'
import {Staff} from '../../../types/Staff'
import { useOrgContext } from '../../../context/OrgContext'
import {PlusCircleOutlined} from '@ant-design/icons'

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
            <Button type='link' disabled={!isAdmin} icon={<PlusCircleOutlined />}  style={{alignSelf:'flex-start',marginBottom:'1em', display:'flex',alignItems:'center'}} onClick={showCreateForm}>Add new staff</Button>
            <List
            itemLayout="horizontal"
            dataSource={staff}
            renderItem={(item, index) => (
            <List.Item
            style={{border:'none', background:'#f9f9f9',marginBottom:'.5em',padding:'1em', borderRadius:'4px'}}
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