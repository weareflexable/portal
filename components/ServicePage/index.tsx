import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal, PageHeader} from 'antd'
import router, { useRouter } from 'next/router';
import ServiceItemForm from './CreateServiceForm/CreateServiceForm';

// import ServiceItemTable from '../ServicesPage/ServicesTable/ServicesTable';
import ServiceList from './ServiceItemList/ServiceItemList';
import EditForm from './EditServiceForm/EditServiceForm';
import useCrud from '../../hooks/useCrud';
import { ServiceItem } from '../../types/Services';
import moment from 'moment';
const {Text} = Typography;




interface UserServicesViewProps{

}

const mockServiceItems: ServiceItem[] = [
    {
    id:'fdafda387dsdwr3nv',
    name: 'Line skip pro + cover',
    price: 2500,
    description: 'Best service in town ready to take over the place',
    startDate: moment(),
    endDate: moment()
    },
    {
    id:'fdafda3873nv',
    name: 'Bottle service pro + cover',
    price: 5500,
    description: 'Skip the line and lets get you in',
    startDate: moment(),
    endDate: moment()
    },
]

export default function UserServicesView({}:UserServicesViewProps){

    const {asPath} = useRouter()
    const serviceId = asPath.split('/')[4]


    const {
        state,
        showCreateForm, 
        openCreateForm,
        showEditForm,
        itemToEdit,
        selectItemToEdit,
        createItem,
        editItem,
        deleteItem,
        closeCreateForm,
        closeEditForm
       } = useCrud<ServiceItem>(mockServiceItems)



    return(
        <div>
           
            { state.length > 0 
                ? <ServiceList onDeleteService = {deleteItem} onSelectService={selectItemToEdit} onCreateService={openCreateForm} services={state}/>
                :<EmptyServices onRegisterService={openCreateForm}/>
            }

            <Modal title={'Create service'} open={showCreateForm} footer={null} onCancel={closeCreateForm}>
                <ServiceItemForm 
                onTriggerFormAction={createItem} 
                onCancelFormCreation={closeCreateForm}/>
            </Modal>

            <Modal title={'Edit Service'} open={showEditForm} footer={null} onCancel={closeEditForm}>
                <EditForm 
                initValues={itemToEdit} 
                onTriggerFormAction={editItem} 
                onCancelFormCreation={closeEditForm}/>
            </Modal>

        </div>
    )
}







interface EmptyStoreProps{
    onRegisterService: ()=>void
}
const EmptyServices = ({onRegisterService}:EmptyStoreProps)=>{
    return(
        <Card className='flex-col flex justify-center items-center'>
            <Button type='link' size='small' onClick={onRegisterService}>Create new service item</Button>
        </Card>
    )
}
