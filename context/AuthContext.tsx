import { useRouter } from 'next/router';
import React,{useState,useContext,createContext, ReactNode, useEffect} from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
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

    // const [paseto, setPaseto] =useLocalStorage<string>('PLATFORM_PASETO','v4.local.UozESpGaJorQ6WXrSFFFCMCcekZvVbokgIOejGniDGsz2_2XyIPKkrppb-FMsnKAVZtLNnOawvpIuPQXywGETc2X2xX9HNnzX5Auz4QvyTuyhLej-aizUv6GtroSxIZM4_ktrup8zHoVWkKbcP0qwrcrqbHg7Rd23v-okg8UpeJKFkc3rxsr40EdvPQx7ejsUlvGyGVkV8cvMz2h9Hhmj1cs')
    const [paseto, setPaseto] =useState<string|string[]|undefined>(()=>{
        const storedPaseto = getStorage('PLATFORM_PASETO')
        if(storedPaseto){
            return storedPaseto
        }
        return ''
    })

    const pasetoFromUrl = query.paseto 
    // console.log('urlpaseto',pasetoFromUrl)

    useEffect(()=>{
        if(paseto !== '' && paseto !== null){
            setIsAuthenticated(true)
        }
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