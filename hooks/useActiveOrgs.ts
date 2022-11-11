import {useState} from 'react'
import { Org } from '../types/OrganisationTypes'
// import useLocalStorage

export default function useActiveOrgs(){
    const [activeOrg, setActiveOrg] = useState<Org>({id:'weea434',logoUrl:'dfaerefadf',name:'Mujeex labs'})

    const switchOrg = (org:Org)=>{
        // setInLocal storage
    }

    // This function removes the active org from site.
    // Should be called when user logsOut.
    const exitOrg = ()=>{

    }
    // get active org from local storage
    // switch org in 

    return {currentOrg:activeOrg, switchOrg, exitOrg}
}