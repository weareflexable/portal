import {Button, Typography, Card, Spin} from 'antd'
import Head from 'next/head';
import { useRouter } from 'next/router'
import { useEffect,useState } from 'react'
import { useAuthContext } from '../context/AuthContext';

const {Title,Text} = Typography;

export default function Login(){

    const {replace} = useRouter()
    const {isAuthenticated, currentUser}= useAuthContext()
  

    const handleLogin = ()=>{ 
        if(window !== undefined){
            location.href = `${process.env.NEXT_PUBLIC_AUTH}/login?redirect_to=portal`
        }
    }

    useEffect(() => {
      if(isAuthenticated && currentUser.id){
        if(currentUser.role == 1){
            replace('/manager/organizations')
        }else(
            replace('/organizations')
        )
        // check users currrent role
        // navigate user accordingly
        // if user is manager, navigate to manager page
        // if user is admin, navigate to organizations page
      }
    }, [isAuthenticated, currentUser, replace]) 


    if(!isAuthenticated){
        return <LoginView  handleLogin={handleLogin}/>
    }

    return(
        <>
        <Head>
             <title>Flexable|Portal</title>
             {/* <link rel="icon" href="/favicon.png" /> */}
        </Head>
        <div style={{width:'100vw',minHeight:'100vh',background:'#f4f4f4',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <Spin size='large'/>
        </div>
        </>
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
