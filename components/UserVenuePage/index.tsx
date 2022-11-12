import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal, PageHeader} from 'antd'
import router, { useRouter } from 'next/router';
import ServiceItemForm from './CreateServiceForm/CreateServiceForm';

// import ServiceItemTable from '../ServicesPage/ServicesTable/ServicesTable';
import ServiceList from './ServiceItemList/ServiceItemList';
import EditForm from './EditServiceForm/EditServiceForm';
import useCrud from '../../hooks/useCrud';
import { ServiceItem } from '../../types/Services';
const {Text} = Typography;




interface UserServicesViewProps{

}

const mockServiceItems: ServiceItem[] = [
    {
    id:'fdafda3873nv',
    name: 'Line skip pro + cover',
    price: 2500,
    description: 'Best service in town ready to take over the place',
    serviceDuration: '22 Feburary'
    },
    {
    id:'fdafda3873nv',
    name: 'Bottle service pro + cover',
    price: 5500,
    description: 'Skip the line and lets get you in',
    serviceDuration: '26 Feburary'
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
            <PageHeader
            onBack={() => router.back()}
            title="Benjamins On Franklin"
            subTitle="Illinois, United states"
            />
            { state.length > 0 ? 
                <ServiceList onDeleteService = {deleteItem} onSelectService={selectItemToEdit} onCreateService={openCreateForm} services={state}/>:
                <EmptyServices onRegisterService={openCreateForm}/>
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
            <Text type='secondary'>No services in your store yet</Text>
            <Button onClick={onRegisterService}>Create new service</Button>
        </Card>
    )
}
