import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal, PageHeader} from 'antd'
import router, { useRouter } from 'next/router';
import ServiceForm from '../ServiceForm/ServiceForm';

import StoreList from '../../StoresPage/StoreList/StoreList';
import ServiceList from '../ServiceList/ServiceList';
import EditForm from '../EditForm/EditForm';
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
        console.log(updatedService)
        const clonedServices = services.slice()
        const serviceIndex = clonedServices.findIndex(service=>service.key === updatedService.key)
        console.log(serviceIndex)
        clonedServices[serviceIndex]= updatedService
        setServices(clonedServices)
        setIsEditModalOpen(false)
    }

    const cancelServiceCreation = ()=>{
        setIsModalOpen(false)
    }

    const selectServiceForEdit = (service:Service)=>{
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
            onBack={() => router.push('/stores')}
            title="Bill Cage Coffe shop"
            subTitle="Illinois, United states"
            />
            { services.length > 0 ? 
                <ServiceList onDeleteService = {deleteService} onSelectService={selectServiceForEdit} onCreateService={handleRegisterService} services={services}/>:
                <EmptyServices onRegisterService={handleRegisterService}/>
            }
            <Modal title={serviceToEdit?'Edit Service': 'Create service'} open={isModalOpen} footer={null} onCancel={()=>setIsModalOpen(false)}>
                <ServiceForm 
                onTriggerFormAction={handleCreateService} 
                onCancelFormCreation={cancelServiceCreation}/>
            </Modal>

            <Modal title={serviceToEdit?'Edit Service': 'Create service'} open={isEditModalOpen} footer={null} onCancel={()=>setIsModalOpen(false)}>
                <EditForm 
                initValues={serviceToEdit} 
                onTriggerFormAction={handleEditService} 
                onCancelFormCreation={cancelServiceCreation}/>
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
