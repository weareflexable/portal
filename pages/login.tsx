import {Button, Typography, Card} from 'antd'
import { useRouter } from 'next/router'
import { useEffect,useState } from 'react'
import { useAuthContext } from '../context/AuthContext';
import { deleteStorage, setStorage } from '../utils/storage'
const {Title,Text} = Typography;

export default function Login(){

    const {push, replace, query} = useRouter()
    const {isAuthenticated,setIsAuthenticated,logout}= useAuthContext()
    // // const paseto = query.paseto
    
    // useEffect(() => { 
    //     // console.log(router.isReady)
    //     const paseto = query.paseto
    //     console.log(paseto)
    //     if(paseto){
    //         setIsAuthenticated(true)
    //         setStorage('PLATFORM_PASETO',JSON.stringify(paseto))
    //         // redirect to lounge
    //         push('/') 
    //     }
    // }, [push, query, setIsAuthenticated])

    if(isAuthenticated){
        replace('/')
    }

    const handleLogin = ()=>{ 
        if(window !== undefined){
            location.href = `${process.env.NEXT_PUBLIC_AUTH}/login?redirect_to=portal`
        }
    }


    return(
        <div style={{width:'100vw',display:'flex', background:'#f9f9f9', justifyContent:'center',alignItems:'center',height:'100vh'}}>
            <Card style={{width:'30%'}}>
                {!isAuthenticated
                    ?
                    <>
                        <Title level={5}>Login to portal</Title>
                        <Button size='large' shape='round' type='primary' onClick={handleLogin}>Login</Button>
                    </>
                    :
                    <>
                    <Text type='secondary'>Logged in!</Text>   
                    <Button danger  type='link' onClick={logout}>Logout</Button>
                    </>
                }
            </Card>
        </div>
    )
}