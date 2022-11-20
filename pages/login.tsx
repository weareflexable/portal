import {Button, Typography, Card} from 'antd'
import { useRouter } from 'next/router'
import { useEffect,useState } from 'react'
import { deleteStorage, setStorage } from '../utils/storage'
const {Title,Text} = Typography;

export default function Login(){

    const router = useRouter()
    const [loggedIn, setLoggedIn] = useState(false)
    const paseto = router.query.paseto

    useEffect(() => { 
        // console.log(router.isReady)
        console.log(router.query)
        console.log(paseto)
 
        if(paseto){
            setLoggedIn(true)
            setStorage('PLATFORM_PASETO',JSON.stringify(paseto))
            // redirect to lounge
            router.push('/')
        }
    }, [paseto, router])

    const handleLogin = ()=>{ 
        if(window !== undefined){
            location.href = 'https://auth.dev.flexabledats.com/login?redirect_to=portal'
        }
    }

    const logoutHandler = ()=>{
        deleteStorage('PLATFORM_PASETO')
        setLoggedIn(false)
    }

    if(loggedIn){
        return(
            <>
            <div>Logged in successfully</div>
            <Button onClick={logoutHandler}>Logout</Button>
            </>
        )
    }
    return(
        <div style={{width:'100vw',display:'flex', background:'#f9f9f9', justifyContent:'center',alignItems:'center',height:'100vh'}}>
            <Card style={{width:'30%'}}>
                {loggedIn
                    ?
                    <>
                        <Title level={5}>Login to portal</Title>
                        <Button size='large' shape='round' type='primary' onClick={handleLogin}>Login</Button>
                    </>
                    :
                    <>
                    <Text type='secondary'>Logged in!</Text>   
                    <Button danger  type='link' onClick={logoutHandler}>Logout</Button>
                    </>
                }
            </Card>
        </div>
    )
}