import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal} from 'antd'
import {PlusCircleOutlined} from '@ant-design/icons'
import StaffList from './StaffList/StaffList';
import useCrud from '../../hooks/useCrud';
import { Staff } from '../../types/Staff';
import CreateStaffForm from './CreateStaffForm/CreateStaffForm';
import EditStaffForm from './EditStaffForm/EditStaffForm';
import { useOrgContext } from '../../context/OrgContext';
const {Text} = Typography;



interface StaffViewProps{

}
export default function StaffView({}:StaffViewProps){

    const {
        state,
        createItem,
        editItem,
        deleteItem,
        showCreateForm,
        showEditForm,
        openCreateForm,
        closeCreateForm,
        openEditForm,
        closeEditForm,
        itemToEdit,
        selectItemToEdit
    } = useCrud<Staff>()

    const {isAdmin} = useOrgContext()

    return(
        <div>
           
        { state.length > 0 ? 
            <StaffList 
                showCreateForm={openCreateForm}
                onSelectStaffToEdit={selectItemToEdit} 
                onDeleteStaff={deleteItem} 
                staff={state}
            />: <EmptyStore isAdmin={isAdmin} openFormModal={openCreateForm}/>
            
        }
        <Modal title="Add new staff" open={showCreateForm} footer={null} onCancel={closeCreateForm}>
            <CreateStaffForm 
                onCloseForm={closeCreateForm} 
                onCreateStaff={createItem}
            />
        </Modal>

        <Modal 
            title="Edit staff role" 
            open={showEditForm} 
            footer={null} 
            onCancel={closeEditForm}
        >
            <EditStaffForm 
                initValues ={itemToEdit}
                onCloseForm={closeEditForm} 
                onChangeStaffRole={editItem}
            />
        </Modal>
        </div>
    )
}







interface EmptyStaffProps{
    openFormModal: ()=>void,
    isAdmin: boolean
}
const EmptyStore = ({isAdmin,openFormModal}:EmptyStaffProps)=>{
    return(
            <Button type='link' disabled={!isAdmin} style={{display:'flex', alignItems:'center'}} icon={<PlusCircleOutlined />}  onClick={openFormModal}>Create new staff</Button>
    )
}
