import React,{useState,useContext,createContext, ReactNode} from 'react';
import useOrgs from '../hooks/useOrgs';
import {Org} from '../types/OrganisationTypes'

const OrgContext = createContext<Values|undefined>(undefined);



type Values = {
    currentOrg: Org,
    switchOrg: (org:Org)=>void,
    orgUserRole: string
}

interface OrgContextProviderProps{
    children: ReactNode
}

const OrgContextProvider = ({children}:OrgContextProviderProps)=>{


    const {switchOrg,currentOrg,orgUserRole} = useOrgs()

    const values: Values = {
        currentOrg,
        switchOrg,
        orgUserRole
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