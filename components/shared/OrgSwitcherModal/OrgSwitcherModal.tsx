import {Modal,List,Typography, Button, Tag, Avatar} from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useOrgContext } from '../../../context/OrgContext'
import useFetchUserOrgs from '../../../hooks/useFetchUserOrgs'
import { ActiveOrgs, NewOrg, Org } from '../../../types/OrganisationTypes'
import utils from '../../../utils/env'

interface OrgSwitcherModalProps{
    isModalOpen: boolean
    onCloseModal: ()=>void
}
export default function OrgSwitcherModal({isModalOpen, onCloseModal}:OrgSwitcherModalProps){

    const {orgs,isLoadingOrgs} =  useFetchUserOrgs()

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
                dataSource={orgs}
                renderItem={(item) => (
                    <List.Item style={{border: 'none', marginBottom:'0'}}>
                        <div style={{width:'100%', borderRadius:'4px', background:'#f8f8f8', display:'flex', justifyContent: 'space-between', alignItems:'center', padding: '1.3em'}}>
                        <div style={{display:'flex',alignItems:'center'}}>
                                <Avatar style={{marginRight:'.7rem'}} src={`${utils.NEXT_PUBLIC_NFT_STORAGE_PREFIX_URL}/${item.logoImageHash}`}/>
                                <div style={{display:'flex', flexDirection:'column'}}>
                                <Typography.Text>{item.name}</Typography.Text>
                                {/* <Typography.Text type='secondary'>{item.serviceType[0].name}</Typography.Text> */}
                                </div>
                            </div>
                             {item.isActive?<Typography.Text type='secondary'>Logged in</Typography.Text>:<Button type='link' loading={targetOrg?.id===item.id} onClick={()=>switchOrgHandler(item)} shape='round'  size='small'>Switch to Org</Button>}
                        </div>
                    </List.Item>
                )}
    />
        </Modal>
    )
}