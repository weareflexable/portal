import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal} from 'antd'
import router, { useRouter } from 'next/router';
import StaffForm from './StaffForm/StaffForm';
import { v4 as uuidv4 } from 'uuid';

import StaffList from './StaffList/StaffList';
const {Text} = Typography;


interface StaffViewProps{

}
export default function StaffView({}:StaffViewProps){


    // TODO: fetch all stores from db
    const [staffs, setStaffs] = useState<Array<FormData>>([]);

    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleCreateStaff = (formData:FormData)=>{
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

    

    // if (storePath === 'launchNewStore'){ 
    //     return <StoreForm onCancelFormCreation={cancelFormCreation} onLaunchStore={handleLaunchStore}/>
    // }

    return(
        <div>
        { staffs.length > 0 ? 
            <StaffList openFormModal={()=>setIsModalOpen(true)} onDeleteStaff={deleteStaff} staffs={staffs}/>:
            <EmptyStore openFormModal={()=>setIsModalOpen(true)}/> 
        }
        <Modal title="Add new staff" open={isModalOpen} footer={null} onCancel={()=>setIsModalOpen(false)}>
            <StaffForm onCancelFormCreation={cancelFormCreation} onCreateStaff={handleCreateStaff}/>
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
