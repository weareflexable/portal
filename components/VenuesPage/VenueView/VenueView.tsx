import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal} from 'antd'
import router, { useRouter } from 'next/router';
import CreateVenueForm from '../CreateVenueForm/CreateVenueForm';
import EditVenueForm from '../EditVenueForm/EditVenueForm'
import VenueTable from '../VenueTable/VenueTable';
import useCrud from '../../../hooks/useCrud';
import { Venue } from '../../../types/Venue';

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
export default function ServiceView({}:StoreViewProps){

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
        } = useCrud<Venue>()



    

    return(
        <div>
        { state.length > 0 ? 
            <VenueTable
             showCreateForm={openCreateForm}
             venues={state}
             onDeleteStore={deleteItem}
             onSelectStoreToEdit={selectItemToEdit}
            />:
            <EmptyStore onRegisterStore={openCreateForm}/>
        }
        <Modal title="Launch new store" open={showCreateForm} footer={null} onCancel={closeCreateForm}>
            <CreateVenueForm 
                onCancelFormCreation={closeCreateForm} 
                onLaunchStore={createItem}
             />
        </Modal>

        <Modal title="Edit store" open={showEditForm} footer={null} onCancel={closeEditForm}>
            <EditVenueForm 
                initValues={itemToEdit} 
                onCloseEditForm={closeEditForm} 
                onEditVenue={editItem}
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
