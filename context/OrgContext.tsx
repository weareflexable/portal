import React,{useState,useContext,createContext, ReactNode} from 'react';
import useOrgs from '../hooks/useOrgs';
import {NewOrg, Org} from '../types/OrganisationTypes'

const OrgContext = createContext<Values|undefined>(undefined);



type Values = {
    currentOrg: NewOrg,
    switchOrg: (org:NewOrg)=>void,
    orgUserRole: string,
    isAdmin: boolean,
    isStaff: boolean
}

interface OrgContextProviderProps{
    children: ReactNode
}

const OrgContextProvider = ({children}:OrgContextProviderProps)=>{


    const {switchOrg,currentOrg,orgUserRole,isAdmin, isStaff} = useOrgs()

    const values: Values = {
        currentOrg,
        switchOrg,
        orgUserRole,
        isAdmin,
        isStaff
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