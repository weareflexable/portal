import {Modal,List,Typography, Button, Tag} from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useOrgContext } from '../../../context/OrgContext'
import useFetchUserOrgs from '../../../hooks/useFetchUserOrgs'
import { ActiveOrgs, NewOrg, Org } from '../../../types/OrganisationTypes'

interface OrgSwitcherModalProps{
    isModalOpen: boolean
    onCloseModal: ()=>void
}
export default function OrgSwitcherModal({isModalOpen, onCloseModal}:OrgSwitcherModalProps){

    const {orgs,isLoadingOrgs} =  useFetchUserOrgs()
    const uniqueOrgs: ActiveOrgs[] = orgs?.filter((item, i) => orgs.findIndex((org)=>item.id===org.id)===i); 

    const {switchOrg} = useOrgContext()
    const router = useRouter()

    const [targetOrg, setTargeOrg] = useState<NewOrg>()

    const switchOrgHandler = (selectedOrg:NewOrg)=>{
        setTimeout(()=>{
            router.replace(`/organizations`)
            switchOrg(selectedOrg)
            onCloseModal()
            setTargeOrg(selectedOrg)
        },3000)
    }

    return(
        <Modal open={isModalOpen} footer={null} onCancel={onCloseModal}>
            <List
                size='small'
                loading={isLoadingOrgs}
                dataSource={uniqueOrgs && uniqueOrgs}
                renderItem={(item) => (
                    <List.Item style={{border: 'none', marginBottom:'0'}}>
                        <div style={{width:'100%', borderRadius:'4px', background:'#f8f8f8', display:'flex', justifyContent: 'space-between', alignItems:'center', padding: '1.3em'}}>
                            <div>
                             <Typography.Text>{item.name}</Typography.Text>
                             {/* <Tag style={{marginLeft:'.4em'}}>{item.role}</Tag> .\ */}
                            </div>
                             {item.isActive?<Typography.Text type='secondary'>Logged in</Typography.Text>:<Button type='link' loading={targetOrg?.id===item.id} onClick={()=>switchOrgHandler(item)} shape='round'  size='small'>Switch to Org</Button>}
                        </div>
                    </List.Item>
                )}
    />
        </Modal>
    )
}