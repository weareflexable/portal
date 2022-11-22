import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal} from 'antd'
import {PlusCircleOutlined} from '@ant-design/icons'
import StaffList from './StaffList/StaffList';
import useCrud from '../../hooks/useCrud';
import { Staff } from '../../types/Staff';
import CreateStaffForm from './CreateStaffForm/CreateStaffForm';
import EditStaffForm from './EditStaffForm/EditStaffForm';
import { useOrgContext } from '../../context/OrgContext';
import useCrudDB from '../../hooks/useCrudDB';
import { useServicesContext } from '../../context/ServicesContext';
const {Text} = Typography;



interface StaffViewProps{

}
export default function StaffView({}:StaffViewProps){

    const {currentService} = useServicesContext()
    const serviceId = currentService.id

    const hookConfig ={
        fetchUrl:`services/user/get-members?orgServiceId=${serviceId}`,
        mutateUrl:'org/orgadmin/add-staff'
    }

    const {
        state,
        createItem,
        editItem,
        isLoading:isFetchingStaff,
        deleteItem,
        isCreatingData:isCreatingStaff,
        showCreateForm,
        showEditForm,
        openCreateForm,
        closeCreateForm,
        openEditForm,
        closeEditForm,
        itemToEdit,
        selectItemToEdit
    } = useCrudDB<Staff>(hookConfig,'staff')

    const {isAdmin} = useOrgContext()

    return(
        <div>
           
        {/* { state.length > 0 ?  */}
            <StaffList 
                showCreateForm={openCreateForm}
                onSelectStaffToEdit={selectItemToEdit} 
                onDeleteStaff={deleteItem} 
                staff={state}
                isFetchingStaff = {isFetchingStaff}
            />
            {/* // : <EmptyStore isAdmin={isAdmin} openFormModal={openCreateForm}/> */}
            
        {/* } */}
        <Modal title="Add new employee" open={showCreateForm} footer={null} onCancel={closeCreateForm}>
            <CreateStaffForm 
                isCreatingStaff={isCreatingStaff}
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
