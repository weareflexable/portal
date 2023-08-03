import { useRouter } from 'next/router';
import React,{useState,useContext,createContext, ReactNode, useEffect} from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { getStorage, setStorage } from '../utils/storage';
import  {useQuery} from '@tanstack/react-query'
import axios from 'axios';
import dayjs from 'dayjs'


const AuthContext = createContext<Values|undefined>(undefined);

type Values = {
    isAuthenticated: boolean,
    currentUser: any,
    setIsAuthenticated: (isAuthenticate:boolean)=>void,
    paseto: string | undefined | null | string[],
    logout: ()=>void
}

interface AuthContextProviderProps{
    children: ReactNode
}

const AuthContextProvider = ({children}:AuthContextProviderProps)=>{

    const router = useRouter()

    

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useLocalStorage('currentUser','')

    const [paseto, setPaseto] =useState<string|string[]|undefined>(()=>{
        const storedPaseto = getStorage('PLATFORM_PASETO')
        if(storedPaseto){
            return storedPaseto
        }
        return ''
    })

    /*
    * Get paseto that got passed through query parameter
    * from auth-web
    */ 
    const pasetoFromUrl = router.query.paseto 


    /*
    * Effect for setting isAuthenticated state to true if paseto exist
    * in local storage
    */
    useEffect(()=>{
        if(paseto !== '' && paseto !== null){
            setIsAuthenticated(true) 
        }
    },[paseto])

    useEffect(()=>{

        async function decodePaseto(){
          const paseto = localStorage.getItem('PLATFORM_PASETO')
          const tokenExpiry = localStorage.getItem('tokenExpiry')
    
          if(!paseto) return
    
          // if token already exist just check storage without having to call API
          if(tokenExpiry){
            const isExpired = dayjs().isAfter(tokenExpiry)
            if(isExpired){
              logout()
            }
            return
          }
    
    
          try{
    
            const res =  await axios.post(`https://platform.dev.flexabledats.com/decodePaseto`, {token: paseto },
            {
              headers:{
              'Authorization': paseto
              }
            }
            )
    
            if(res.status < 201){
              const expiryDate = res.data.data.exp
              localStorage.setItem('tokenExpiry',expiryDate)
              const isExpired = dayjs().isAfter(expiryDate)
              if(isExpired){
                logout()
              }
            }
    
          }catch(err){
    
            console.log(err)
    
          }
          
          
        }
        decodePaseto()
    },[router])

    useEffect(() => {
        // set state if url paseto exist
        if(pasetoFromUrl){
            // set ui and local storage
            setPaseto(pasetoFromUrl) 
            //@ts-ignore
            setStorage('PLATFORM_PASETO',pasetoFromUrl)
            setIsAuthenticated(true)
        }

    }, [pasetoFromUrl])

    // Effect for decoding user paseto and fetching user role.
    async function fetchCurrentUser(){
        // use axios to fetch
        const res =  await axios.get(`${process.env.NEXT_PUBLIC_NEW_API_URL}/users`,{
            headers:{
                "Authorization": paseto
            }
        })

        return res && res.data.data[0]; 
    }

    const userQuery = useQuery({
        queryKey:['user'], 
        queryFn:fetchCurrentUser, 
        enabled:paseto!=='', 
        onSuccess:(user)=>{
            const isArray = Array.isArray(user)
            setCurrentUser(isArray?user[0]:user)
        }, 
        staleTime:Infinity,
        retry: (failureCount, error) =>{
          if(failureCount >2) return false
          return true  
        },
        onError:(error:any)=>{ 
            console.log(error)
            // const statusCode = error.response.status
            // if(statusCode === 401){ // 401: user token has expired
            //     // logout user if token has expired
            //     logout()
            // }
        }
    })


    

    const logout = () =>{
        setIsAuthenticated(false)
        // clear all caches
        localStorage.clear()
        // redirect user to login page
        router.replace('/')
    }



    const values: Values = {
        isAuthenticated,
        setIsAuthenticated,
        currentUser,
        paseto,
        logout
    }

    return(
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
}


const useAuthContext = ()=>{
    const context = useContext(AuthContext);

    if(context === undefined){
        throw new Error('Context is not being used under its provider')
    }

    return context
}

export {useAuthContext, AuthContextProvider }