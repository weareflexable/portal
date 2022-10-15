import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal} from 'antd'
import router, { useRouter } from 'next/router';
import StoreForm from '../StoreForm/StoreForm';

import StoreList from '../StoreList/StoreList';
const {Text} = Typography;


interface StoreViewProps{

}
export default function StoreView({}:StoreViewProps){

    const {asPath, push} = useRouter()
    const currentPath = asPath.split('#')

    // TODO: fetch all stores from db
    const [stores, setStores] = useState<Array<FormData>>([]);
    const [storePath, setStorePath] = useState(currentPath[1])
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleRegisterStore = ()=>{
        setIsModalOpen(true)
        setStorePath('launchNewStore')
    }
    const handleLaunchStore = (storeData:FormData)=>{
        console.log(storeData)
        const clonedStore =  stores.slice()
        clonedStore.push(storeData)
        setStores(clonedStore);
        setStorePath('store')
        setIsModalOpen(false);
    }

    const cancelFormCreation = ()=>{
        setStorePath('store')
        push('/dashboard#store')
    }

    

    // if (storePath === 'launchNewStore'){ 
    //     return <StoreForm onCancelFormCreation={cancelFormCreation} onLaunchStore={handleLaunchStore}/>
    // }

    return(
        <div>
        { stores.length > 0 ? 
            <StoreList onRegisterNewStore={handleRegisterStore} stores={stores}/>:
            <EmptyStore onRegisterStore={handleRegisterStore}/>
        }
        <Modal title="Launch new store" open={isModalOpen} footer={null} onCancel={()=>setIsModalOpen(false)}>
            <StoreForm onCancelFormCreation={cancelFormCreation} onLaunchStore={handleLaunchStore}/>
        </Modal>
        </div>
    )
}







interface EmptyStoreProps{
    onRegisterStore: ()=>void
}
const EmptyStore = ({onRegisterStore}:EmptyStoreProps)=>{
    return(
        <Card className='flex-col flex justify-center items-center'>
            <Text type='secondary'>No stores have been detected yet</Text>
            <Button onClick={onRegisterStore} href='#launchNewStore'>Create new store</Button>
        </Card>
    )
}
