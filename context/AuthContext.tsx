import { useRouter } from 'next/router';
import React,{useState,useContext,createContext, ReactNode, useEffect} from 'react';
import { deleteStorage, getStorage, setStorage } from '../utils/storage';


const AuthContext = createContext<Values|undefined>(undefined);

type Values = {
    isAuthenticated: boolean,
    setIsAuthenticated: (isAuthenticate:boolean)=>void,
    paseto: string | undefined | null | string[],
    logout: ()=>void
}

interface AuthContextProviderProps{
    children: ReactNode
}

const AuthContextProvider = ({children}:AuthContextProviderProps)=>{

    const {push,replace,query} = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(()=>{
        const localPaseto = JSON.parse(getStorage('PLATFORM_PASETO')||'{}')
          if(localPaseto === undefined) return false
          return true

    });
    const [paseto, setPaseto] = useState<string|undefined|string[]|null>(()=>{
        const localPaseto = JSON.parse(getStorage('PLATFORM_PASETO')||'{}')
          if(localPaseto === undefined) return
        return localPaseto
    })

    const returnedPaseto = query.paseto
    // effect to grab paseto from url and set to storage
    useEffect(() => {
        if(returnedPaseto){
            setStorage('PLATFORM_PASETO',JSON.stringify(returnedPaseto))
        }

    }, [returnedPaseto]) 
    
    useEffect(() => { 
        const paseto = JSON.parse(getStorage('PLATFORM_PASETO')||'{}')
        console.log(paseto)
        if(paseto){
            setPaseto(paseto)
            setIsAuthenticated(true)
            // redirect to lounge
            push('/')
        } 
    }, [isAuthenticated]) 




    const logout = () =>{
        setIsAuthenticated(false)
        // clear all caches
        localStorage.clear()
        // redirect user to login page
        replace('/login')
    }



    const values: Values = {
        isAuthenticated,
        setIsAuthenticated,
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