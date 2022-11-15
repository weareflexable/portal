import {Button} from 'antd'
import { useRouter } from 'next/router'
import { useEffect,useState } from 'react'
import { deleteStorage, setStorage } from '../utils/storage'

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
            // save in local storage
        }
    }, [paseto, router])

    const handleLogin = ()=>{ 
        if(window !== undefined){
            location.href = 'https://localhost:3002/login?redirect_to=portal'
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
        <>
        <Button onClick={handleLogin}>Login</Button>
        </>
    )
}