import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal} from 'antd'
import router, { useRouter } from 'next/router';
import CreateVenueForm from '../CreateVenueForm/CreateVenueForm';
import EditVenueForm from '../EditVenueForm/EditVenueForm'
import VenueTable from '../VenueTable/VenueTable';

const {Text} = Typography;



// TODO: add google picker for grabbing location coordinates
export type Store ={
    name: string,
    address: string,
    type: string,
    storeLogo: Array<object>,
    storeCoverImage: Array<object>,
    key: string
}

interface StoreViewProps{

}
export default function StoreView({}:StoreViewProps){


    // TODO: fetch all stores from db
    const [stores, setStores] = useState<Store[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [storeToEdit, setStoreToEdit] = useState<Store>()

    const handleRegisterStore = ()=>{
        setIsModalOpen(true)
    }
    const handleLaunchStore = (storeData:Store)=>{
        const clonedStore =  stores.slice()
        clonedStore.push(storeData)
        setStores(clonedStore);
        setIsModalOpen(false);
    }

    const cancelFormCreation = ()=>{
        setIsModalOpen(false)
    }

    const deleteStore = (storeId: string)=>{
        const clonedStores = stores.slice();
        const updatedStores = clonedStores.filter(store=>store.key !== storeId)
        setStores(updatedStores)
    }

    const editStore = (updatedStore:Store)=>{

        // copy state to avoid mutation
        const clonedStores = stores.slice()
        // find index of updated service in old services
        const serviceIndex = clonedStores.findIndex(store=>store.key === store.key)
        // update edited service
        clonedStores[serviceIndex]= updatedStore;
        // update service in state
        setStores(clonedStores)
        setIsEditModalOpen(false)
    }

    const selectStoreToEdit=(store:Store)=>{
        setIsEditModalOpen(true)
        setStoreToEdit(store)
    }
    

    return(
        <div>
        { stores.length > 0 ? 
            <VenueTable
             onRegisterNewStore={handleRegisterStore}
             stores={stores}
             onDeleteStore={deleteStore}
             onSelectStoreToEdit={selectStoreToEdit}
            />:
            <EmptyStore onRegisterStore={()=>setIsModalOpen(true)}/>
        }
        <Modal title="Launch new store" open={isModalOpen} footer={null} onCancel={()=>setIsModalOpen(false)}>
            <CreateVenueForm 
                onCancelFormCreation={cancelFormCreation} 
                onLaunchStore={handleLaunchStore}
             />
        </Modal>

        <Modal title="Edit store" open={isEditModalOpen} footer={null} onCancel={()=>setIsEditModalOpen(false)}>
            <EditVenueForm 
                initValues={storeToEdit} 
                onCancelFormCreation={()=>setIsEditModalOpen(false)} 
                onEditStore={editStore}
            />
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
            <Button onClick={onRegisterStore}>Create new store</Button>
        </Card>
    )
}
