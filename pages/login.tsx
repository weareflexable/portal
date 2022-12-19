import {Button, Typography, Card, Spin} from 'antd'
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

    const handleLogin = ()=>{ 
        if(window !== undefined){
            location.href = `${process.env.NEXT_PUBLIC_AUTH}/login?redirect_to=portal`
        }
    }

    useEffect(() => {
      if(isAuthenticated){
        // navigate to lounge
          replace('/organizations')
      }
    }, [isAuthenticated, replace]) 


    if(!isAuthenticated){
        return <LoginView  handleLogin={handleLogin}/>
    }

    return(
        <div style={{width:'100vw',minHeight:'100vh',background:'#f4f4f4',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <Spin size='large'/>
        </div>
    ) 
}

interface LoginViewProps{
    handleLogin:()=>void

}
function LoginView({handleLogin}: LoginViewProps) {
    return <div style={{ width: '100vw', display: 'flex', background: '#f9f9f9', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Card style={{ width: '30%' }}>
                    <Title level={5}>Login to portal</Title>
                    <Button size='large' shape='round' type='primary' onClick={handleLogin}>Login</Button>
             
        </Card>
    </div>;
}
