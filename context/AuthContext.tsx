import { useRouter } from 'next/router';
import React,{useState,useContext,createContext, ReactNode, useEffect} from 'react';
import { deleteStorage, getStorage } from '../utils/storage';


const AuthContext = createContext<Values|undefined>(undefined);

type Values = {
    isAuthenticated: boolean,
    setIsAuthenticated: (isAuthenticate:boolean)=>void,
    paseto: string | undefined | null,
    logout: ()=>void
}

interface AuthContextProviderProps{
    children: ReactNode
}

const AuthContextProvider = ({children}:AuthContextProviderProps)=>{

    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [paseto, setPaseto] = useState(()=>{
        const localPaseto = getStorage('PLATFORM_PASETO')
          if(localPaseto === undefined) return
        return localPaseto
    })

    const logout = () =>{
        setIsAuthenticated(false)
        // clear all caches
        localStorage.clear()
        // redirect user to login page
        router.replace('/login')
    }



    const values: Values = {
        isAuthenticated:true,
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