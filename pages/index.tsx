import {useEffect, useState} from 'react'
import type { NextPage } from 'next'

import {PlusCircleOutlined} from '@ant-design/icons'
import RegisterOrgForm from '../components/Accounts/RegisterOrgForm/RegisterOrgForm';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { Card, Button, List, Typography, Avatar, Tag, Modal } from 'antd';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';
import { useOrgContext } from '../context/OrgContext';
import useFetchUserOrgs from '../hooks/useFetchUserOrgs';
import { OrganistationReq, Org, OrgFormData } from '../types/OrganisationTypes';
import { nftStorageClient } from '../utils/nftStorage';

const Home: NextPage = () => {

  const {orgs} = useFetchUserOrgs()
    const [userOrgs,setUserOrgs] = useState([{name:'Avery Juice Bar',id:'3743hfebcda',logoUrl:'https://joeschmoe.io/api/v1/random'},{name:'Benjamins Labs',id:'3fdae43febcda',logoUrl:'https://joeschmoe.io/api/v1/random'}]);
    const [unApprovedOrgs, setUnApprovedOrgs] = useState([{name: 'Mujeex Labs', id:'4345faf434',logoUrl:'https://joeschmoe.io/api/v1/random'},{name:'Schelling labs', id:'fdadf4r34rdf',logoUrl:'https://joeschmoe.io/api/v1/random'}])
    const [isFetchingOrgs, setIsFetchingOrgs] = useState(false)
    const [isRegisteringOrg, setIsRegisteringOrg] = useState(false)
    const [showOrgForm, setShowOrgForm] = useState(false)
    const [selectedOrg, setSelectedOrg] = useState('')
    const [isNavigatingToOrgs, setIsNavigatingToOrg] = useState(false)
    const {isAuthenticated} = useAuthContext()
    const router = useRouter()
    // const {setCurrentOrg} = useOrgContext()
    // const mutation = useMutation()

    const {switchOrg} =  useOrgContext()

    const createNewOrg = useMutation({
        mutationFn: (newOrgReq:OrganistationReq) => {
          return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/`,{
            Headers:{
                'Authorization':''
            },
            body: JSON.stringify(newOrgReq)
          })
        },
        onSuccess:async()=>{
            console.log('Show positive notification')
        },
        onError:()=>{
            console.log('show negative notification')
        }
      })

    useEffect(() => {
        // setIsFetchingOrgs(true)
        // fetch user roles here
        // setUserOrgs here
    }, [])


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
            console.log(cid)
            createNewOrg.mutate({  
                name:formData.name,
                emailId: formData.emailId,
                address: formData.address,
                phoneNumber: formData.phoneNumber,
                imageHash: cid
            })

            // add new org to state
            // const unApprovedOrgsCopy = unApprovedOrgs.slice()
            // unApprovedOrgsCopy.push(formData)
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


                <Button type='link' style={{marginBottom:'1em',display:'flex',alignItems:'center'}} icon={<PlusCircleOutlined />} onClick={()=>setShowOrgForm(true)}>Register new organisation</Button>

            {orgs.length>0 
            ?
            <Card style={{width:'60%', marginTop:'2em'}}>
                <List
                    size="small"
                    style={{border:'none'}}
                    header={<Typography.Title level={5}>My Organisations</Typography.Title>}
                    bordered
                    dataSource={orgs}
                    renderItem={item => 
                        <List.Item 
                            actions={[<Button key={item.id} size='small' type='link' loading={item.id===selectedOrg?isNavigatingToOrgs:false} onClick={()=>navigateToApp(item)}>Go to organisation</Button>]} 
                            style={{border:'none'}} 
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
            : null
            }

            <Card style={{width:'60%', marginTop:'2em'}}>
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
            </Card>


            <Modal  title="Edit store" open={showOrgForm} footer={null} onCancel={()=>setShowOrgForm(false)}>
                <RegisterOrgForm
                    onRegisterNewOrg={registerOrg}
                    isRegisteringOrg={isRegisteringOrg}
                />
            </Modal>
        </div>
    )
}


export default Home