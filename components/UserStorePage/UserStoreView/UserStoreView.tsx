import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal} from 'antd'
import router, { useRouter } from 'next/router';
import ServiceForm from '../ServiceForm/ServiceForm';

import StoreList from '../../StoresPage/StoreList/StoreList';
import ServiceList from '../ServiceList/ServiceList';
const {Text} = Typography;


interface UserStoreViewProps{

}
export default function UserStoreView({}:UserStoreViewProps){

    const {asPath, push} = useRouter()
    const currentPath = asPath.split('#')

    // TODO: fetch all stores from db
    const [services, setServices] = useState<Array<FormData>>([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    // const [storePath, setStorePath] = useState(currentPath[1])

    const handleRegisterService = ()=>{
        setIsModalOpen(true)
        // setStorePath('launchNewStore')
    }
    const handleCreateService = (serviceData:FormData)=>{
        const clonedServices =  services.slice()
        clonedServices.push(serviceData)
        setServices(clonedServices);
        setIsModalOpen(false)
        // setStorePath('store')
    }

    const cancelServiceCreation = ()=>{
        setIsModalOpen(false)
        // setStorePath('services')
        // push('/dashboard#store')
    }

    

    // if (servicePath === 'newServices'){ 
        // return <ServiceForm onCancelFormCreation={cancelServiceCreation} onLaunchStore={handleCreateService}/>
    // }

    return(
        <div>
        { services.length > 0 ? 
            <ServiceList onCreateService={handleRegisterService} services={services}/>:
            <EmptyServices onRegisterService={handleRegisterService}/>
        }
        <Modal title="Basic Modal" open={isModalOpen} footer={null} onCancel={()=>setIsModalOpen(false)}>
            <ServiceForm onCreateService={handleCreateService} onCancelFormCreation={cancelServiceCreation}/>
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
            <Button onClick={onRegisterService} href='#launchNewStore'>Create new service</Button>
        </Card>
    )
}
