
import {useState} from 'react'
import type { NextPage } from 'next'

import { Button,Typography,Modal} from 'antd';
const {Title} = Typography; 
import { useAuthContext } from '../../context/AuthContext';
import {OrgFormData } from '../../types/OrganisationTypes';
import { nftStorageClient } from '../../utils/nftStorage';
import RegisterOrgForm from '../../components/LoungePage/RegisterOrgForm/RegisterOrgForm';
import {PlusCircleOutlined} from '@ant-design/icons'
import dynamic from 'next/dynamic';
import useMutateData from '../../hooks/useMutateData';

const DynamicOrgs = dynamic(()=>import('../../components/OrganizationsPage/OrganizationList/OrganizationList'),{
    ssr:false,
})


const Organizations: NextPage = () => {


    const [isRegisteringOrg, setIsRegisteringOrg] = useState(false)
    const [showOrgForm, setShowOrgForm] = useState(false)
    

    const {logout} = useAuthContext()
 
    const {createItem} = useMutateData('org/user/create')
    

    // Function to request for organisations
    const registerOrg = (formData:OrgFormData)=>{
        // call image hashing function here
        console.log(formData)
        setIsRegisteringOrg(true)
        const imageBlob = formData.imageFile
        // TODO: fix this this type issue later
        nftStorageClient.storeBlob(imageBlob as unknown as Blob).then(cid=>{
            
            const reqPayload = {  
                name:formData.name,
                emailId: formData.emailId,
                address: formData.address,
                phoneNumber: formData.phoneNumber,
                imageHash: cid
            }
            // createNewOrg.mutate()
            createItem(reqPayload)

            setIsRegisteringOrg(false)

        }).catch(err=>{
            setIsRegisteringOrg(false)
            console.log('something went wrong',err) 
        })

       
    }


    return(
        <>
        {/* <Button type='primary'>Button</Button> */}
        <div style={{
            width: '100vw',
            minHeight:'100vh',
            background: '#f7f7f7',
            height: '100%',
            display:'flex',
            flexDirection:'column',
            alignItems:'flex-start',
            paddingLeft:'4rem',
            paddingTop:'2rem'
        }}>

                <div style={{display:'flex', justifyContent:'space-between',alignItems:'center',width:'90%'}}>
                        <Title level={1}>Welcome to the lounge</Title>
                        <Button danger onClick={logout}>Logout</Button>
                </div>
            
                <div style={{display:'flex', marginTop:'4em', flexDirection:'column', width:'60%'}} > 
                             <Title style={{marginBottom:'0'}} level={4}>My organizations</Title>
                                <Button type='link' style={{ marginTop:'1.5em', display: 'flex', alignItems: 'center' }} icon={<PlusCircleOutlined />} onClick={()=>setShowOrgForm(true)}>Register new organisation</Button>
                                <DynamicOrgs/>
                    </div> 



           { showOrgForm? <Modal  title="Create organization" open={showOrgForm} footer={null} onCancel={()=>setShowOrgForm(false)}>
                <RegisterOrgForm
                    onRegisterNewOrg={registerOrg}
                    isRegisteringOrg={isRegisteringOrg}
                />
            </Modal>: null}
            
        </div>
        </>
    )
}


export default Organizations

