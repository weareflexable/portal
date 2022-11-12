import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal, PageHeader} from 'antd'
import router, { useRouter } from 'next/router';
import ServiceForm from './CreateServiceForm/CreateServiceForm';

import StoreList from '../ServicesPage/ServicesTable/ServicesTable';
import ServiceList from './ServiceList/ServiceList';
import EditForm from './EditServiceForm/EditServiceForm';
import Bookings from './Bookings/Bookings';
const {Text} = Typography;



export type Service = {
    key: string,
    name: string,
    price: number,
    description: string,
    serviceDuration: string
}

interface UserStoreViewProps{

}
export default function UserStoreView({}:UserStoreViewProps){

    const router = useRouter()

    // TODO: fetch all stores from db
    const [services, setServices] = useState<Array<Service>>([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [serviceToEdit, setServiceToEdit] = useState<Service|undefined>(undefined)

    const handleRegisterService = ()=>{
        setIsModalOpen(true)
    }
    const handleCreateService = (serviceData:Service)=>{
        const clonedServices =  services.slice()
        clonedServices.push(serviceData)
        setServices(clonedServices);
        setIsModalOpen(false)
    }

    const handleEditService = (updatedService: Service)=>{

        // copy state to avoid mutation
        const clonedServices = services.slice()
        // find index of updated service in old services
        const serviceIndex = clonedServices.findIndex(service=>service.key === updatedService.key)
        // update edited service
        clonedServices[serviceIndex]= updatedService;
        // update service in state
        setServices(clonedServices)
        setIsEditModalOpen(false)
    }


    const selectServiceForEdit = (service:Service)=>{
        console.log('selectedService', service)
        setIsEditModalOpen(true)
        setServiceToEdit(service)
    }

    const deleteService = (itemKey:string)=>{
        const clonedServices = services.slice()
        const updatedServices = clonedServices.filter(service=>service.key !== itemKey );
        setServices(updatedServices);
    }
    

    return(
        <div>
            <PageHeader
            onBack={() => router.back()}
            title="Benjamins On Franklin"
            subTitle="Illinois, United states"
            />
            { services.length > 0 ? 
                <ServiceList onDeleteService = {deleteService} onSelectService={selectServiceForEdit} onCreateService={()=>setIsModalOpen(true)} services={services}/>:
                <EmptyServices onRegisterService={()=>setIsModalOpen(true)}/>
            }

            <Modal title={serviceToEdit?'Edit Service': 'Create service'} open={isModalOpen} footer={null} onCancel={()=>setIsModalOpen(false)}>
                <ServiceForm 
                onTriggerFormAction={handleCreateService} 
                onCancelFormCreation={()=>setIsModalOpen(false)}/>
            </Modal>

            <Modal title={'Edit Service'} open={isEditModalOpen} footer={null} onCancel={()=>setIsEditModalOpen(false)}>
                <EditForm 
                initValues={serviceToEdit} 
                onTriggerFormAction={handleEditService} 
                onCancelFormCreation={()=>setIsEditModalOpen(false)}/>
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
