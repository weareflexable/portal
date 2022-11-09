import {useState,useEffect} from 'react'
import {Card,List,Button, Divider,Typography, Modal, Avatar} from 'antd'
import { useAuthContext } from '../context/AuthContext'
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import RegisterOrgForm from '../components/LoungePage/RegisterOrgForm/RegisterOrgForm'
import {OrganistationReq} from '../types/OrganisationTypes'

type Organisation={

}



export default function Lounge(){

    const [userOrgs,setUserOrgs] = useState([{name:'Avery Juice Bar',id:'3743hfebcda'},{name:'Benjamins Labs',id:'3fdae43febcda'}]);
    const [isFetchingOrgs, setIsFetchingOrgs] = useState(false)
    const [showOrgForm, setShowOrgForm] = useState(false)
    const [selectedOrg, setSelectedOrg] = useState('')
    const [isNavigatingToOrgs, setIsNavigatingToOrg] = useState(false)
    const {isAuthenticated} = useAuthContext()
    const router = useRouter()
    // const mutation = useMutation()

    const createNewOrg = useMutation({
        mutationFn: (newOrgReq:OrganistationReq) => {
          return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/`,{
            Headers:{
                'Authorization':''
            },
            body: JSON.stringify(newOrgReq)
          })
        }
      })

    useEffect(() => {
        // setIsFetchingOrgs(true)
        // fetch user roles here
        // setUserOrgs here
    }, [])


    const navigateToApp = (orgId:string)=>{
        setSelectedOrg(orgId)
        setIsNavigatingToOrg(true)
        setTimeout(() => {
            setIsNavigatingToOrg(false)
            router.push(`/organisation/${orgId}/dashboard`)
        }, 3000);
    }

    

    // Function to request for organisations
    const registerOrg = (formData:OrganistationReq)=>{
        // call image hashing function here
        createNewOrg.mutate({
            name:formData.name,
            emailId: formData.emailId,
            address: formData.address,
            phoneNumber: formData.phoneNumber,
            imageHash: formData.imageHash
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
            paddingLeft:'4rem',
            paddingTop:'2rem'
        }}>
            {userOrgs.length>0
            ?
            <Card style={{width:'60%', marginTop:'2em'}}>
                <List
                    size="small"
                    style={{border:'none'}}
                    header={<Typography.Title level={5}>My Organisations</Typography.Title>}
                    bordered
                    dataSource={userOrgs}
                    renderItem={item => 
                        <List.Item key={item.id}>
                             <List.Item.Meta
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                title={ <Button loading={item.id===selectedOrg?isNavigatingToOrgs:false} onClick={()=>navigateToApp(item.id)} type='link'>{item.name}</Button>}
                                // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                />
                           
                        </List.Item>
                            }
                />
            </Card>
            : null
        }
            <Card style={{width:'60%', marginTop:'2em'}}>
                <Button type='ghost' onClick={()=>setShowOrgForm(true)}>Register new organisation</Button>
            </Card>

            <Modal  title="Edit store" open={showOrgForm} footer={null} onCancel={()=>setShowOrgForm(false)}>
                <RegisterOrgForm
                    onRegisterNewOrg={registerOrg}
                />
            </Modal>
        </div>
    )
}