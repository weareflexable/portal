import {Modal,List,Typography, Button, Tag} from 'antd'
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

    const {services} =  useFetchUserServices()
    const {switchService} = useServicesContext()
    const router = useRouter()

    const [targetService, setTargeService] = useState<Service>()

    const switchServiceHandler = (selectedService:Service)=>{
        setTimeout(()=>{
            router.replace(`/serviceanisation/${selectedService.id}/dashboard`)
            switchService(selectedService)
            onCloseModal()
            setTargeService(selectedService)
        },3000)
    }

    return(
        <Modal open={isModalOpen} footer={null} onCancel={onCloseModal}>
            <List
                size='small'
                dataSource={services && services}
                renderItem={(item) => (
                    <List.Item style={{border: 'none', marginBottom:'0'}}>
                        <div style={{width:'100%', borderRadius:'4px', background:'#f8f8f8', display:'flex', justifyContent: 'space-between', alignItems:'center', padding: '1.3em'}}>
                            <div>
                             <Typography.Text>{item.name}</Typography.Text>
                            </div>
                             {item.isActive?<Typography.Text type='secondary'>Logged in</Typography.Text>:<Button type='link' loading={targetService?.id===item.id} onClick={()=>switchServiceHandler(item)} shape='round'  size='small'>Switch to Service</Button>}
                        </div>
                    </List.Item>
                )}
    />
        </Modal>
    )
}