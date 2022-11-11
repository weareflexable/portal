import {Modal,List,Typography, Button} from 'antd'
import useFetchUserOrgs from '../../../hooks/useFetchUserOrgs'
import { Org } from '../../../types/OrganisationTypes'

interface OrgSwitcherModalProps{
    isModalOpen: boolean
    onCloseModal: ()=>void
}
export default function OrgSwitcherModal({isModalOpen, onCloseModal}:OrgSwitcherModalProps){

    const {orgs} =  useFetchUserOrgs()

    return(
        <Modal open={isModalOpen} footer={null} onCancel={onCloseModal}>
            <List
                size='small'
                dataSource={orgs && orgs}
                renderItem={(item) => (
                    <List.Item style={{border: 'none'}}>
                        <div style={{width:'100%', borderRadius:'4px', background:'#f8f8f8', display:'flex', justifyContent: 'space-between', alignItems:'center', padding: '.5em'}}>
                             <Typography.Text>{item.name}</Typography.Text>
                             {item.isActive?null:<Button size='small'>Switch to Org</Button>}
                        </div>
                    </List.Item>
                )}
    />
        </Modal>
    )
}