import React,{useState,useContext,createContext, ReactNode} from 'react';
import {Org} from '../types/OrganisationTypes'

const OrgContext = createContext<Values|undefined>(undefined);



type Values = {
    currentOrg: Org,
    setCurrentOrg: (org:Org)=>void
}

interface OrgContextProviderProps{
    children: ReactNode
}

const OrgContextProvider = ({children}:OrgContextProviderProps)=>{

    const [currentOrg, setCurrentOrg] = useState<Org>({
        name:'',
        id:'',
        logoUrl:''
    });

    const values: Values = {
        currentOrg,
        setCurrentOrg
    }

    return(
        <OrgContext.Provider value={values}>
            {children}
        </OrgContext.Provider>
    )
}


const useOrgContext = ()=>{
    const context = useContext(OrgContext);

    if(context === undefined){
        throw new Error('Context is not being used under its provider')
    }

    return context
}

export {useOrgContext, OrgContextProvider }