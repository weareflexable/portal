import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space} from 'antd'
import router, { useRouter } from 'next/router';
import ServiceForm from './ServiceForm/ServiceForm';

import StoreList from '../StoreList/StoreList';
const {Text} = Typography;


interface UserStoreViewProps{

}
export default function UserStoreView({}:UserStoreViewProps){

    const {asPath, push} = useRouter()
    const currentPath = asPath.split('#')

    // TODO: fetch all stores from db
    const [stores, setStores] = useState<Array<FormData>>([]);
    const [storePath, setStorePath] = useState(currentPath[1])

    const handleRegisterStore = ()=>{
        setStorePath('launchNewStore')
    }
    const handleLaunchStore = (storeData:FormData)=>{
        console.log(storeData)
        const clonedStore =  stores.slice()
        clonedStore.push(storeData)
        setStores(clonedStore);
        setStorePath('store')
    }

    const cancelFormCreation = ()=>{
        setStorePath('store')
        push('/dashboard#store')
    }

    

    if (storePath === 'launchNewStore'){ 
        return <ServiceForm onCancelFormCreation={cancelFormCreation} onLaunchStore={handleLaunchStore}/>
    }

    return(
        <div>
        { stores.length > 0 ? 
            <StoreList onRegisterNewStore={handleRegisterStore} stores={stores}/>:
            <EmptyStore onRegisterStore={handleRegisterStore}/>
        }
        </div>
    )
}







interface EmptyStoreProps{
    onRegisterStore: ()=>void
}
const EmptyStore = ({onRegisterStore}:EmptyStoreProps)=>{
    return(
        <Card className='flex-col flex justify-center items-center'>
            <Text type='secondary'>No services in your store yet</Text>
            <Button onClick={onRegisterStore} href='#launchNewStore'>Create new service</Button>
        </Card>
    )
}
