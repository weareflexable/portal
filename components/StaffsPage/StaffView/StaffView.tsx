import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal} from 'antd'
import StaffForm from '../StaffForm/StaffForm';
import StaffEditForm from '../StaffEditForm/StaffEditForm'
import { v4 as uuidv4 } from 'uuid';

import StaffList from '../StaffList/StaffList';
const {Text} = Typography;


export type Staff = {
    email: string,
    role: string,
    id: string
}
interface StaffViewProps{

}
export default function StaffView({}:StaffViewProps){


    // TODO: fetch all stores from db
    const [staffs, setStaffs] = useState<Staff[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [staffToEdit, setStaffToEdit] = useState<Staff>()

    const handleCreateStaff = (formData:Staff)=>{
        console.log(formData)
        const formObject = {
            ...formData,
            id: uuidv4()
        }
        const clonedStaffs =  staffs.slice()
        clonedStaffs.push(formObject)
        setStaffs(clonedStaffs);
        setIsModalOpen(false);
    }

    const deleteStaff = (staffId:string)=>{
        const clonedStaffs = staffs.slice();
        const updatedStaff = clonedStaffs.filter(staff=>staff.id !== staffId)
        setStaffs(updatedStaff)
        
    }

    const cancelFormCreation = ()=>{
        // push('/dashboard#store')
    }
    const selectStaffToEdit=(staff:Staff)=>{
        setStaffToEdit(staff)
        setIsEditModalOpen(true)
    }

    const changeStaffRole = (updatedStaff:Staff)=>{
        const clonedStaffs = staffs.slice();
        const staffIndex = clonedStaffs.findIndex(staff=>staff.id === staff.id)
        clonedStaffs[staffIndex] = updatedStaff 
        setStaffs(clonedStaffs)
        setIsEditModalOpen(false)
    }

    

    return(
        <div>
        { staffs.length > 0 ? 
            <StaffList 
                onSelectStaffToEdit={selectStaffToEdit} 
                openFormModal={()=>setIsModalOpen(true)} 
                onDeleteStaff={deleteStaff} 
                staffs={staffs}
            />:
            <EmptyStore openFormModal={()=>setIsModalOpen(true)}/> 
        }
        <Modal title="Add new staff" open={isModalOpen} footer={null} onCancel={()=>setIsModalOpen(false)}>
            <StaffForm 
                onCancelFormCreation={()=>setIsModalOpen(false)} 
                onCreateStaff={handleCreateStaff}
            />
        </Modal>

        <Modal 
            title="Edit staff role" 
            open={isEditModalOpen} 
            footer={null} 
            onCancel={()=>setIsEditModalOpen(false)}
        >
            <StaffEditForm 
                initValues ={staffToEdit}
                onCancelFormCreation={cancelFormCreation} 
                onChangeStaffRole={changeStaffRole}
            />
        </Modal>
        </div>
    )
}







interface EmptyStaffProps{
    openFormModal: ()=>void
}
const EmptyStore = ({openFormModal}:EmptyStaffProps)=>{
    return(
        <Card className='flex-col flex justify-center items-center'>
            <Text type='secondary'>No staff in your organisation detected yet</Text>
            <Button onClick={openFormModal} >Create new staff</Button>
        </Card>
    )
}
