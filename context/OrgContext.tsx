import React,{useState,useContext,createContext, ReactNode} from 'react';


const OrgContext = createContext<Values|undefined>(undefined);

type Org = {
    name: string,
    id: string,
    logoHash: string
}

type Values = {
    currentOrg: Org,
    setCurrentOrg: (org:Org)=>void
}

interface OrgContextProviderProps{
    children: ReactNode
}

const OrgContextProvider = ({children}:OrgContextProviderProps)=>{

    const [currentOrg, setCurrentOrg] = useState({
        name:'',
        id:'',
        logoHash:''
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