import {useState,useEffect} from 'react'
import {Card,List,Button, Divider,Typography} from 'antd'
import { useAuthContext } from '../context/AuthContext'
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'


type Organisation={

}

type OrganistationReq = {
    name: string,
    emailId: string,
    address: string,
    phoneNumber: string,
    imageHash: string
}

export default function Lounge(){

    const [userOrgs,setUserOrgs] = useState([{name:'Avery Juice Bar',id:'3743hfebcda'},{name:'Benjamins Labs',id:'3fdae43febcda'}]);
    const [isFetchingOrgs, setIsFetchingOrgs] = useState(false)
    const [selectedOrg, setSelectedOrg] = useState('')
    const [isNavigatingToOrgs, setIsNavigatingToOrg] = useState(false)
    const {isAuthenticated} = useAuthContext()
    const router = useRouter()
    // const mutation = useMutation()

    const createNewOrg = useMutation({
        mutationFn: (newOrgReq:OrganistationReq) => {
          return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/`, newOrgReq)
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
            router.push(`/organisation/${orgId}`)
        }, 3000);
    }

    // Function to request for organisations
    const requestOrg = (formData:OrganistationReq)=>{
        // collect form data from register form
        // call api to register
        createNewOrg.mutate({
            name: '',
            emailId: '',
            address: '',
            phoneNumber: '',
            imageHash: ''
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
            height: '100%',
            display:'flex',
            flexDirection:'column',
            paddingLeft:'4rem',
            paddingTop:'2rem'
        }}>
            <List
                size="small"
                style={{width:'60%'}}
                header={<Typography.Title level={5}>My Organisations</Typography.Title>}
                bordered
                dataSource={userOrgs}
                renderItem={item => 
                <List.Item key={item.id}>
                    <Button loading={item.id===selectedOrg?isNavigatingToOrgs:false} onClick={()=>navigateToApp(item.id)} type='link'>{item.name}</Button>
                </List.Item>
            }
            />
        </div>
    )
}