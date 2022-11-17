import React,{useState,useContext,createContext, ReactNode, useEffect} from 'react';
import { getStorage } from '../utils/storage';


const AuthContext = createContext<Values|undefined>(undefined);

type Values = {
    isAuthenticated: boolean,
    setIsAuthenticated: (isAuthenticate:boolean)=>void,
    paseto: string | undefined | null
}

interface AuthContextProviderProps{
    children: ReactNode
}

const AuthContextProvider = ({children}:AuthContextProviderProps)=>{

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [paseto, setPaseto] = useState(()=>{
        const localPaseto = getStorage('PLATFORM_PASETO')
        console.log('context',localPaseto)
          if(localPaseto === undefined) return
        return localPaseto
    })



    const values: Values = {
        isAuthenticated:true,
        setIsAuthenticated,
        paseto
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