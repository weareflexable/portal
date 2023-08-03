import {Button, Typography, Card, Spin} from 'antd'
import Head from 'next/head';
import { useRouter } from 'next/router'
import { useEffect,useState } from 'react'
import { useAuthContext } from '../context/AuthContext';
import Logo from './logo.svg'
import Image from 'next/image'

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
        if(currentUser.role == 1 || currentUser.role == 0){
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
    return <div style={{ width: '100vw', background:' rgba(0,0,0,.5) url("/landing-flexable.jpeg")', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width: '50%' }}>
            <Image src="/logo.svg" width="200" height="200" />
            <Title style={{textAlign:'center', color:'white'}} level={1}>Start creating and managing <br/> events • communities • services  </Title>
            <Text style={{width:'70%', color:'white', textAlign:'center', marginTop:'.5rem', marginBottom:'2rem'}}>Flexable provides the easiest and fastest way to create and manage events, communities and services</Text>
            <Button size='large' shape='round' type='primary' onClick={handleLogin}>Login to Dashboard</Button>
        </div> 
    </div>;
}
