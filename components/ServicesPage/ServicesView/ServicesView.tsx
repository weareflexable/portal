import React,{useEffect, useState} from 'react'
import {Card,Button,Typography,Alert,Space,Modal, Row,Col,Skeleton} from 'antd'
import {PlusCircleOutlined,ArrowLeftOutlined,SettingOutlined} from '@ant-design/icons'
import { useRouter } from 'next/router';
import CreateServiceForm from '../CreateServiceForm/CreateServiceForm';
import EditServiceForm from '../EditServiceForm/EditServiceForm'

import { Service } from '../../../types/Services';
import ServicesList from '../ServicesList/ServicesList';

import { useOrgContext } from '../../../context/OrgContext';

import useCrudDB from '../../../hooks/useCrudDB';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthContext } from '../../../context/AuthContext';

const {Text,Title} = Typography;

const mockServices: Service[] =[
//     {
//     name: 'Benjamins On Franklin',
//     address: 'Newyork syracuse, 2234',
//     type: 'Bar',
//     storeLogo: ['https://joeschmoe.io/api/v1/random'],
//     storeCoverImage: ['https://joeschmoe.io/api/v1/random'],
//     id: 'dadvaereafd'
// },
//     {
//     name: 'Schelling Restaurant',
//     address: 'Barcelona, Estonia 2234',
//     type: 'Restaurant',
//     storeLogo: ['https://joeschmoe.io/api/v1/random'],
//     storeCoverImage: ['https://joeschmoe.io/api/v1/random'],
//     id: 'dadvaer8379343fedfa'
// },
]



interface ServicesViewProps{

}
export default function ServiceView({}:ServicesViewProps){

    const {replace} = useRouter()
    const {paseto} = useAuthContext()
    const {currentOrg} = useOrgContext()
    const [hydrated, setHydrated] = useState(false)
    const [orgName, setOrgName] = useState('')
    // const [orgId, setOrgId] = useState('')
    const orgId = currentOrg.orgId 
    
    useEffect(()=>{
        setHydrated(true)
            if(hydrated){
                 setOrgName(currentOrg.name)
                //  setOrgId(currentOrg.id)
            }
    },[currentOrg.orgId, currentOrg.name, hydrated])

    // async function fetchServices(){
    //         const res  = await axios({
    //             method: 'get',
    //             url: `${process.env.NEXT_PUBLIC_NEW_API_URL}/services?key=org_id&value=12&pageNumber=0&pageSize=2&orgId=${orgId}`,
    //             headers:{
    //                 "Authorization": paseto
    //             }
    //         })
    //         return res.data.data 
    // }

    // const servicesQuery = useQuery(
    //     {
    //     queryKey:['services', orgId],  
    //     queryFn:fetchServices,
    //     // enabled: paseto ! === '    
    // })

    // console.log(servicesQuery.data)
    
    const hookConfig = {
        fetchUrl: `/manager/services?key=org_id&value=12&pageNumber=0&pageSize=2&orgId=${orgId}`,
        mutateUrl: 'services/orgadmin/org-service'
    }
    
    const {
        state,
        showCreateForm, 
        isLoading,
        isCreatingData,
        openCreateForm,
        showEditForm,
        itemToEdit,
        selectItemToEdit,
        createItem,
        editItem,
        deleteItem,
        closeCreateForm,
        closeEditForm
    } = useCrudDB<Service>(hookConfig,['services', orgId])

     

    // remove this after there is guarantee of payload prop in response
    // const services = state && state.hasOwnProperty('payload')? state: []
    // console.log('services',state)
    // const uniqueServices = services.length > 0 ? state?.filter((item, i) => state.findIndex((service)=>item.id===service.id)===i):services;
    // const uniqueServices = state && state?.filter((item, i) => state.findIndex((service)=>item.id===service.id)===i);
    // console.log(services)
    // console.log(uniqueServices)


    

    return(
        <div style={{background:'#f7f7f7', minHeight:'100vh'}}>
           
            <Row style={{marginTop:'.5em'}} gutter={[16,46]}>
                <header style={{width:'100%', background:'#ffffff'}}>
                    <Col style={{display:'flex', justifyContent:'space-between'}} offset={2} span={20}>
                        <div style={{display:'flex', flex:'7', flexDirection:'column'}}> 
                            <Button style={{display:'flex', padding: '0', margin:'0', alignItems:'center', textAlign:'left'}} onClick={()=>replace('/')} icon={<ArrowLeftOutlined />} type='link'>Back to organizations</Button>
                            {orgName === ''? <Skeleton.Input active size='large' />:<Title level={4}>{orgName}</Title> }
                        </div>

                        <div style={{display:'flex', flex:'3', justifyContent:'space-between', alignItems:'center'}}>
                            {/* <CurrentUser /> */}
                            <div style={{padding:'.7em', cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center', borderRadius:'50px', background:'#f4f4f4'}}>
                                {/* <SettingOutlined style={{fontSize:'1.4em'}}/> */}
                            </div>
                        </div>
                    </Col>
                </header>

                <Col offset={2} span={20}>
                    <Title style={{marginBottom:'1em'}} level={2}>Services</Title>
                        <ServicesList
                        isLoadingServices={isLoading}
                        onCreateService={openCreateForm}
                        services={state}
                        onDeleteService={deleteItem}
                        onSelectService={selectItemToEdit}
                        />

                </Col> 
            </Row>
         {showCreateForm?
        <Modal title="Launch new service" open={showCreateForm} footer={null} onCancel={closeCreateForm}>
            <CreateServiceForm 
                onCancelFormCreation={closeCreateForm} // don't need this
                onLaunchStore={createItem}
                isCreatingData = {isCreatingData}
             />
        </Modal>:null} 

         {showEditForm?
        <Modal title="Edit service" open={showEditForm} footer={null} onCancel={closeEditForm}>
            <EditServiceForm 
                initValues={itemToEdit} 
                onCloseEditForm={closeEditForm} 
                onEditService={editItem}
            />
        </Modal>:null}

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
