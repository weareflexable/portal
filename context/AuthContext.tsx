import { useRouter } from 'next/router';
import React,{useState,useContext,createContext, ReactNode, useEffect, useMemo, useCallback} from 'react';
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

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const [paseto, setPaseto] =useState<string|string[]|undefined>(()=>{
        const storedPaseto = getStorage('PLATFORM_PASETO')
        if(storedPaseto){
            return storedPaseto
        }
        return ''
    })

    // Get paseto that go passed through query parameter
    // from auth-web
    const pasetoFromUrl = query.paseto 


    useEffect(()=>{
        if(paseto !== '' && paseto !== null){
            setIsAuthenticated(true)
            // take user to desired route
        }
        // take user to login page
    },[paseto])

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


    const logout = () =>{
        setIsAuthenticated(false)
        // clear all caches
        localStorage.clear()
        // redirect user to login page
        replace('/')
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