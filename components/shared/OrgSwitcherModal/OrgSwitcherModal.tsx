import {Modal,List,Typography, Button} from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useOrgContext } from '../../../context/OrgContext'
import useFetchUserOrgs from '../../../hooks/useFetchUserOrgs'
import { Org } from '../../../types/OrganisationTypes'

interface OrgSwitcherModalProps{
    isModalOpen: boolean
    onCloseModal: ()=>void
}
export default function OrgSwitcherModal({isModalOpen, onCloseModal}:OrgSwitcherModalProps){

    const {orgs} =  useFetchUserOrgs()
    const {switchOrg} = useOrgContext()
    const router = useRouter()

    const [targetOrg, setTargeOrg] = useState<Org>()

    const switchOrgHandler = (selectedOrg:Org)=>{
        setTargeOrg(selectedOrg)
        setTimeout(()=>{
            router.replace(`/organisation/${selectedOrg.id}/dashboard`)
            switchOrg(selectedOrg)
            onCloseModal()
            setTargeOrg(false)
        },3000)
    }

    return(
        <Modal open={isModalOpen} footer={null} onCancel={onCloseModal}>
            <List
                size='small'
                dataSource={orgs && orgs}
                renderItem={(item) => (
                    <List.Item style={{border: 'none', marginBottom:'0'}}>
                        <div style={{width:'100%', borderRadius:'4px', background:'#f8f8f8', display:'flex', justifyContent: 'space-between', alignItems:'center', padding: '1em'}}>
                             <Typography.Text>{item.name}</Typography.Text>
                             {item.isActive?null:<Button loading={targetOrg?.id===item.id} onClick={()=>switchOrgHandler(item)} shape='round'  size='small'>Switch to Org</Button>}
                        </div>
                    </List.Item>
                )}
    />
        </Modal>
    )
}