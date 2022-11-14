import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal, Row,Col} from 'antd'
import {PlusCircleOutlined,ArrowLeftOutlined} from '@ant-design/icons'
import router, { useRouter } from 'next/router';
import CreateServiceForm from '../CreateServiceForm/CreateServiceForm';
import EditServiceForm from '../EditServiceForm/EditServiceForm'

import useCrud from '../../../hooks/useCrud';
import { Service } from '../../../types/Services';
import CurrentUser from '../../Header/CurrentUser/CurrentUser';
import ServicesList from '../ServicesList/ServicesList';

const {Text,Title} = Typography;

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

    const {back} = useRouter()

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
        <div style={{background:'#f7f7f7', minHeight:'100vh'}}>
           
            <Row style={{marginTop:'.5em'}} gutter={[16,46]}>
                <header style={{width:'100%', background:'#ffffff'}}>
                    <Col style={{display:'flex', justifyContent:'space-between'}} offset={2} span={20}>
                        <div style={{display:'flex', flexDirection:'column'}}> 
                            <Button style={{display:'flex', padding: '0', margin:'0', alignItems:'center', textAlign:'left'}} onClick={()=>back()} icon={<ArrowLeftOutlined />} type='link'>Back to organizations</Button>
                            <Title level={4}>Magic Mike Exclusive club</Title> 
                        </div>
                        <CurrentUser/>
                    </Col>
                </header>

                <Col offset={2} span={20}>
                    <Title style={{marginBottom:'1em'}} level={4}>Services</Title>
                    { state.length > 0 ?  
                        <ServicesList
                        onCreateService={openCreateForm}
                        services={state}
                        onDeleteService={deleteItem}
                        onSelectService={selectItemToEdit}
                        />:
                        <EmptyStore onRegisterStore={openCreateForm}/>
                    }
                </Col>
            </Row>
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
