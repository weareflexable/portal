import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal} from 'antd'
import {PlusCircleOutlined} from '@ant-design/icons'
import router, { useRouter } from 'next/router';
import CreateServiceForm from '../CreateServiceForm/CreateServiceForm';
import EditServiceForm from '../EditServiceForm/EditServiceForm'
import ServicesTable from '../ServicesTable/ServicesTable';
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
            <ServicesTable
             showCreateForm={openCreateForm}
             services={state}
             onDeleteStore={deleteItem}
             onSelectStoreToEdit={selectItemToEdit}
            />:
            <EmptyStore onRegisterStore={openCreateForm}/>
        }
        <Modal title="Launch new store" open={showCreateForm} footer={null} onCancel={closeCreateForm}>
            <CreateServiceForm 
                onCancelFormCreation={closeCreateForm} 
                onLaunchStore={createItem}
             />
        </Modal>

        <Modal title="Edit store" open={showEditForm} footer={null} onCancel={closeEditForm}>
            <EditServiceForm 
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
            <Button style={{display:'flex',alignItems:'center'}} type='link' icon={<PlusCircleOutlined />} onClick={onRegisterStore}>Create new service</Button>
    )
}
