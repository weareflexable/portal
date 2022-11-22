import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal, PageHeader} from 'antd'
import {PlusCircleOutlined} from '@ant-design/icons'
import router, { useRouter } from 'next/router';
import ServiceItemForm from './CreateServiceItemForm/CreateServiceItemForm';

// import ServiceItemTable from '../ServicesPage/ServicesTable/ServicesTable';
import ServiceList from './ServiceItemList/ServiceItemList';
import EditForm from './EditServiceForm/EditServiceForm';
import useCrud from '../../hooks/useCrud';
import { ServiceItem, ServiceItemReqPaylod } from '../../types/Services';
import moment from 'moment';
import ServiceItemList from './ServiceItemList/ServiceItemList';
import useCrudDB from '../../hooks/useCrudDB';
import { useServicesContext } from '../../context/ServicesContext';
const {Text} = Typography;
 



interface UserServicesViewProps{

}

// const mockServiceItems: ServiceItem[] = [
//     {
//     id:'fdafda387dsdwr3nv',
//     name: 'Line skip pro + cover',
//     price: 2500,
//     ticketsPerDay:21,
//     description: 'Best service in town ready to take over the place',
//     startDate: moment(),
//     endDate: moment(),
//     startTime:moment('00:00:00', 'HH:mm:ss'),
//     rangeTime:4
//     },
//     {
//     id:'fdafda3873nv',
//     name: 'Bottle service pro + cover',
//     price: 5500,
//     ticketsPerDay:21,
//     description: 'Skip the line and lets get you in',
//     startDate: moment(),
//     endDate: moment(),
//     startTime:moment('00:00:00', 'HH:mm:ss'),
//     rangeTime:5
//     },
// ]

export default function UserServicesView({}:UserServicesViewProps){

    const {asPath} = useRouter()
    const {currentService} = useServicesContext();
    // const serviceId = asPath.split('/')[5]
    const serviceId = currentService.id


    const hookConfig = {
        fetchUrl: `services/user/get-service-items?orgServiceId=${serviceId}`,
        mutateUrl: 'services/orgadmin/org-service-item',
        patchUrl: 'services/user/update-service-item'
    }

    const {
        state,
        showCreateForm, 
        openCreateForm,
        isPatchingData,
        isCreatingData,
        isLoading,
        showEditForm,
        itemToEdit,
        selectItemToEdit,
        createItem,
        editItem,
        deleteItem,
        closeCreateForm,
        closeEditForm
       } = useCrudDB<ServiceItem>(hookConfig,'serviceItems')

       console.log(state)

       const serviceItems = state && state


    return(
        <div> 
           
            {/* { state  */}
                <ServiceItemList serviceItemsIsLoading={isLoading} onDeleteService = {deleteItem} isFetching={isLoading} onSelectService={selectItemToEdit} onCreateService={openCreateForm} serviceItems={serviceItems}/>
                {/* // :<EmptyServices onRegisterService={openCreateForm}/> */}
            {/* } */}

            <Modal title={'Create service item'} open={showCreateForm} footer={null} onCancel={closeCreateForm}>
                <ServiceItemForm 
                isCreatingServiceItem={isCreatingData}
                onTriggerFormAction={createItem} 
                onCloseForm={closeCreateForm}/>
            </Modal>

            <Modal title={'Edit Service item'} open={showEditForm} footer={null} onCancel={closeEditForm}>
                <EditForm 
                isPatchingServiceItem={isPatchingData}
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
        <Button type='link' style={{display:'flex', alignItems:'center'}} icon={<PlusCircleOutlined />} onClick={onRegisterService}>Create service item</Button>
    )
}
