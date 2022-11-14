import React,{useState,useContext,createContext, ReactNode} from 'react';
import useServices from '../hooks/useServices';
import {Service} from '../types/Services'

const ServiceContext = createContext<Values|undefined>(undefined);



type Values = {
    currentService: Service,
    switchService: (service:Service)=>void,
}

interface ServiceContextProviderProps{
    children: ReactNode
}

const ServicesContextProvider = ({children}:ServiceContextProviderProps)=>{


    const {switchService,currentService} = useServices()

    const values: Values = {
        currentService,
        switchService,
    }

    return(
        <ServiceContext.Provider value={values}>
            {children}
        </ServiceContext.Provider>
    )
}


const useServiceContext = ()=>{
    const context = useContext(ServiceContext);

    if(context === undefined){
        throw new Error('Context is not being used under its provider')
    }

    return context
}

export {useServiceContext, ServicesContextProvider }