import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal} from 'antd'
import router, { useRouter } from 'next/router';
import CreateVenueForm from '../CreateServiceForm/CreateServiceForm';
import EditVenueForm from '../EditServiceForm/EditServiceForm'
import VenueTable from '../ServicesTable/ServicesTable';
import useCrud from '../../../hooks/useCrud';
import { Service } from '../../../types/Services';

const {Text} = Typography;

const mockServices: Service[] =[
    {
    name: 'Benjamins On Franklin',
    address: 'Newyork syracuse, 2234',
    type: 'Bar',
    storeLogo: ['https://joeschmoe.io/api/v1/random'],
    storeCoverImage: ['https://joeschmoe.io/api/v1/random'],
    id: 'dadvaereafd'
},
    {
    name: 'Schelling Restaurant',
    address: 'Barcelona, Estonia 2234',
    type: 'Restaurant',
    storeLogo: ['https://joeschmoe.io/api/v1/random'],
    storeCoverImage: ['https://joeschmoe.io/api/v1/random'],
    id: 'dadvaer8379343fedfa'
},
]



interface ServicesViewProps{

}
export default function ServiceView({}:ServicesViewProps){

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
        } = useCrud<Service>(mockServices)

    

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
