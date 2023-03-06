import {Modal,List,Typography, Button, Tag, Avatar} from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useServicesContext } from '../../../context/ServicesContext'
import useFetchUserServices from '../../../hooks/useFetchServices'
import { Service } from '../../../types/Services'

interface ServiceSwitcherModalProps{
    isModalOpen: boolean
    onCloseModal: ()=>void
}
export default function ServiceSwitcherModal({isModalOpen, onCloseModal}:ServiceSwitcherModalProps){

    const {services, isFetchingServices} =  useFetchUserServices()

    const {switchService} = useServicesContext()

    const {asPath,replace} = useRouter() 

    const [targetService, setTargeService] = useState<Service>()

    const switchServiceHandler = (selectedService:Service)=>{
        setTargeService(selectedService)
        setTimeout(()=>{
            replace(`/organizations/services/serviceItems`)
            switchService(selectedService)
            onCloseModal()
            // setTargeService(selectedService)
        },3000)
    }

    return(
        <Modal open={isModalOpen} footer={null} onCancel={onCloseModal}>
            <List
                size='small'
                loading={isFetchingServices}
                dataSource={services && services}
                renderItem={(item:any) => (
                    <List.Item style={{border: 'none', marginBottom:'0'}}>
                        <div style={{width:'100%', borderRadius:'4px', background:'#f8f8f8', display:'flex', justifyContent: 'space-between', alignItems:'center', padding: '1.3em'}}>
                            <div style={{display:'flex',alignItems:'center'}}>
                                <Avatar style={{marginRight:'.7rem'}} src={`${process.env.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${item.logoImageHash}`}/>
                                <div style={{display:'flex', flexDirection:'column'}}>
                                <Typography.Text>{item.name}</Typography.Text>
                                <Typography.Text type='secondary'>{item.serviceType[0].name}</Typography.Text>
                                </div>
                            </div>
                             {item.isActive?<Typography.Text type='secondary'>Logged in</Typography.Text>:<Button type='link' loading={targetService?.id===item.id} onClick={()=>switchServiceHandler(item)} shape='round'  size='small'>Switch to Service</Button>}
                        </div>
                    </List.Item>
                )}
    />
        </Modal>
    )
}