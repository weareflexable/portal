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

    const [isRegisteringOrg, setIsRegisteringOrg] = useState(false)
    const [showOrgForm, setShowOrgForm] = useState(false)
    const [selectedOrg, setSelectedOrg] = useState('')
    const [isNavigatingToOrgs, setIsNavigatingToOrg] = useState(false)

    const {push} = useRouter()

    const {paseto,isAuthenticated,logout} = useAuthContext()

    const {data,isLoading} = useQuery(['orgs'],async()=>{
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/org/user/get-org`,{
            headers:{
                //@ts-ignore
                "Authorization": JSON.parse(paseto) 
            }
        })
        return data;
    }) 


    // useEffect(()=>{
    //     console.log(isAuthenticated)
    //     if(isAuthenticated)return
    //     push('/login')

    // },[isAuthenticated, push ]) 


    // const {orgs} = useFetchUserOrgs()

   

    const {createItem} = useMutateData('org/user/create')

    const orgs: Org[] = data && data.payload;
    const uniqueOrgs: Org[] = orgs?.filter((item, i) => orgs.findIndex((org)=>item.id===org.id)===i); 

    console.log(uniqueOrgs)

    const {switchOrg} =  useOrgContext()



    const navigateToApp = (org:Org)=>{
        // save selected org to local storage
        
        setSelectedOrg(org.id)
        setIsNavigatingToOrg(true)
        setTimeout(() => {
            setIsNavigatingToOrg(false)
            switchOrg(org)
            push(`/organisation/${org.id}`)
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

   

    // if(!isAuthenticated){
    //     return(
    //         <div>
    //             You have to be authenticated to view this page
    //         </div>
    //     )
    // }

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

                <div style={{display:'flex', justifyContent:'space-between',alignItems:'center',width:'90%'}}>
                        <Title level={1}>Welcome to the lounge</Title>
                        <Button danger type='ghost' onClick={logout}>Logout</Button>
                </div>
            
                <div style={{display:'flex', marginTop:'4em', flexDirection:'column', width:'60%'}} > 
                             <Title style={{marginBottom:'0'}} level={4}>My organizations</Title>
                        <Card  style={{width:'100%', marginTop:'1em'}}>
                            <Button disabled={isLoading} type='link' style={{marginBottom:'1em',display:'flex',alignItems:'center'}} icon={<PlusCircleOutlined />} onClick={()=>setShowOrgForm(true)}>Register new organisation</Button>
                            <List
                                size="small"
                                bordered={false}
                                loading={isLoading} 
                                dataSource={uniqueOrgs}
                                renderItem={item => 
                                    <List.Item 
                                    actions={[<Button key={item.id} size='middle' disabled={!item.approved} type='primary' shape='round' loading={item.id===selectedOrg?isNavigatingToOrgs:false} onClick={()=>navigateToApp(item)}>{item.approved?`Go to organization`:'Organization in review'}</Button>]} 
                                        style={{border:'none', background:'#f9f9f9',marginBottom:'.5em',padding:'1em', borderRadius:'4px'}}
                                        key={item.id}
                                        >
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.logoUrl} />}
                                            title={
                                                <div style={{display:'flex'}}>
                                                <Typography.Text style={{marginRight: '1em'}}>{item.name}</Typography.Text>
                                                    <Tag>{item.role==='STAFF'?'Employee':item.role}</Tag>
                                                </div>
                                                }
                                            />
                                    
                                    </List.Item>
                                        }
                            />
                        </Card>
                    </div>

                


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