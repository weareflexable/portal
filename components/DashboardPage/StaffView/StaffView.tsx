import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal} from 'antd'
import router, { useRouter } from 'next/router';
import StaffForm from './StaffForm/StaffForm';

import StaffList from './StaffList/StaffList';
const {Text} = Typography;


interface StaffViewProps{

}
export default function StaffView({}:StaffViewProps){


    // TODO: fetch all stores from db
    const [staffs, setStaffs] = useState<Array<FormData>>([]);

    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleCreateStaff = (storeData:FormData)=>{
        console.log(storeData)
        const clonedStaffs =  staffs.slice()
        clonedStaffs.push(storeData)
        setStaffs(clonedStaffs);
        setIsModalOpen(false);
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
            <StaffList openFormModal={()=>setIsModalOpen(true)} staffs={staffs}/>:
            <EmptyStore openFormModal={()=>setIsModalOpen(true)}/> 
        }
        <Modal title="Launch new store" open={isModalOpen} footer={null} onCancel={()=>setIsModalOpen(false)}>
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
