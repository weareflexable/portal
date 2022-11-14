import React,{useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal, Row,Col} from 'antd'
import {PlusCircleOutlined,ArrowLeftOutlined} from '@ant-design/icons'
import router, { useRouter } from 'next/router';
import CreateServiceForm from '../CreateServiceForm/CreateServiceForm';
import EditServiceForm from '../EditServiceForm/EditServiceForm'
import ServicesTable from '../ServicesTable/ServicesTable';
import useCrud from '../../../hooks/useCrud';
import { Service } from '../../../types/Services';
import CurrentUser from '../../Header/CurrentUser/CurrentUser';

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
        <div>
           
            <Row style={{marginTop:'.5em'}} gutter={[16,46]}>
                <header style={{width:'100%', boxShadow:'.5px 3px 3px 0px rgba(5,5,5,0.08)'}}>
                    <Col style={{display:'flex', justifyContent:'space-between'}} offset={2} span={20}>
                        <div style={{display:'flex', flexDirection:'column'}}> 
                            <Button style={{display:'flex', padding: '0', margin:'0', alignItems:'center', textAlign:'left'}} onClick={()=>back()} icon={<ArrowLeftOutlined />} type='link'>Back to organizations</Button>
                            <Title level={4}>Magic Mike Exclusive club</Title> 
                        </div>
                        <CurrentUser/>
                    </Col>
                </header>
                <Col offset={2} span={20}>
                    { state.length > 0 ?  
                        <ServicesTable
                        showCreateForm={openCreateForm}
                        services={state}
                        onDeleteStore={deleteItem}
                        onSelectStoreToEdit={selectItemToEdit}
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
