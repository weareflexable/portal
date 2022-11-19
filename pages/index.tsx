import {useEffect, useState} from 'react'
import type { NextPage } from 'next'

import {PlusCircleOutlined} from '@ant-design/icons'

import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, Button, List, Typography, Avatar, Tag, Modal } from 'antd';
const {Title} = Typography; 
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';
import { useOrgContext } from '../context/OrgContext';
import useFetchUserOrgs from '../hooks/useFetchUserOrgs';
import { OrganistationReq, Org, OrgFormData } from '../types/OrganisationTypes';
import { nftStorageClient } from '../utils/nftStorage';
import RegisterOrgForm from '../components/LoungePage/RegisterOrgForm/RegisterOrgForm';
import { Order } from '../types/Booking';
import dynamic from 'next/dynamic';
import useMutateData from '../hooks/useMutateData';

const Home: NextPage = () => {

    const {data,isLoading} = useQuery(['orgs'],async()=>{
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/org/user/get-org`,{
            headers:{
                "Authorization": 'v4.local.URC2UcW0k5Xpn7PFhsjfjOu1z8sIOCWFbBOJnPxzfVOWWOusxpmBSCT1oNJ5edT4vTntsRNifEviLBk4KYrVCB5whgYpqFCSdQJ9-hACAvZ7FDtx9jgUe3aXHj_EszDQQ9WU7MLXDQTq07oK8s-v1HiMbjdW-jkMbtdVPpQ2qEXckX92BQD-uWX4dwy5gTmJfdEVpa_fi4IK_rjwVXo8i01bZ6c'
            }
        })
        return data;
    })


    // const {orgs} = useFetchUserOrgs()

    const [isRegisteringOrg, setIsRegisteringOrg] = useState(false)
    const [showOrgForm, setShowOrgForm] = useState(false)
    const [selectedOrg, setSelectedOrg] = useState('')
    const [isNavigatingToOrgs, setIsNavigatingToOrg] = useState(false)
    const {isAuthenticated} = useAuthContext()
    const router = useRouter()

    const {createItem} = useMutateData('org/user/create')

    const orgs: Org[] = data && data.payload;

    const {switchOrg} =  useOrgContext()

    // const createNewOrg = useMutation({
    //     mutationFn: (newOrgReq:OrganistationReq) => {
    //       return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/`,{
    //         Headers:{
    //             'Authorization':''
    //         },
    //         body: JSON.stringify(newOrgReq)
    //       })
    //     },
    //     onSuccess:async()=>{
    //         console.log('Show positive notification')
    //     },
    //     onError:()=>{
    //         console.log('show negative notification')
    //     }
    //   })



    const navigateToApp = (org:Org)=>{
        // save selected org to local storage
        
        setSelectedOrg(org.id)
        setIsNavigatingToOrg(true)
        setTimeout(() => {
            setIsNavigatingToOrg(false)
            switchOrg(org)
            router.push(`/organisation/${org.id}`)
        }, 3000);
    }

    

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

   

    if(!isAuthenticated){
        return(
            <div>
                You have to be authenticated to view this page
            </div>
        )
    }

    return(
        <div style={{
            width: '100vw',
            minHeight:'100vh',
            background: '#f9f9f9',
            height: '100%',
            display:'flex',
            flexDirection:'column',
            alignItems:'flex-start',
            paddingLeft:'4rem',
            paddingTop:'2rem'
        }}>

            <Title level={1}>Welcome to the lounge</Title>
            

            {data&&data.payload.length>0 
                ?
                <div style={{display:'flex', marginTop:'4em', flexDirection:'column', width:'60%'}} > 
                        <Title style={{marginBottom:'0'}} level={4}>My organizations</Title>
                        <Card  style={{width:'100%', marginTop:'1em'}}>
                            <Button type='link' style={{marginBottom:'1em',display:'flex',alignItems:'center'}} icon={<PlusCircleOutlined />} onClick={()=>setShowOrgForm(true)}>Register new organisation</Button>
                            <List
                                size="small"
                                bordered={false}
                                loading={isLoading} 
                                dataSource={orgs}
                                renderItem={item => 
                                    <List.Item 
                                    actions={[<Button key={item.id} size='middle' type='primary' shape='round' loading={item.id===selectedOrg?isNavigatingToOrgs:false} onClick={()=>navigateToApp(item)}>Go to organisation</Button>]} 
                                        style={{border:'none', background:'#f9f9f9',marginBottom:'.5em',padding:'1em', borderRadius:'4px'}}
                                        key={item.id}
                                        >
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.logoUrl} />}
                                            title={
                                                <div style={{display:'flex'}}>
                                                <Typography.Text style={{marginRight: '1em'}}>{item.name}</Typography.Text>
                                                    <Tag>{item.role}</Tag>
                                                </div>
                                                }
                                            />
                                    
                                    </List.Item>
                                        }
                            />
                        </Card>
                    </div>
                : <Button type='link' style={{marginBottom:'1em',display:'flex',alignItems:'center'}} icon={<PlusCircleOutlined />} onClick={()=>setShowOrgForm(true)}>Register new organisation</Button>
                
            }

            {/* <Card style={{width:'60%', marginTop:'2em'}}>
                <List
                    size="small"
                    style={{border:'none'}}
                    header={<Typography.Title level={5}>Awaiting approval</Typography.Title>}
                    bordered
                    dataSource={unApprovedOrgs}
                    renderItem={item => 
                        <List.Item style={{border:'none'}} key={item.id}>
                             <List.Item.Meta
                                avatar={<Avatar src={item.logoUrl} />}
                                title={ 
                                    <div style={{display:'flex'}}>
                                        <Typography.Text style={{marginRight: '1em'}}>{item.name}</Typography.Text>
                                        <Tag color='magenta'>Pending approval</Tag>
                                    </div>
                                     }
                                />
                           
                        </List.Item>
                            }
                />
            </Card> */}


            <Modal  title="Create organization" open={showOrgForm} footer={null} onCancel={()=>setShowOrgForm(false)}>
                <RegisterOrgForm
                    onRegisterNewOrg={registerOrg}
                    isRegisteringOrg={isRegisteringOrg}
                />
            </Modal>
            
        </div>
    )
}


export default Home