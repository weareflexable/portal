import {useState} from 'react'
import { Org } from '../types/OrganisationTypes'
import { deleteStorage} from '../utils/storage'
import useLocalStorage from './useLocalStorage'
// import useLocalStorage

export default function useOrgs(){
    // const [activeOrg, setActiveOrg] = useState<Org>({id:'weea434',logoUrl:'dfaerefadf',name:'Mujeex labs'})
    const [currentOrg, setCurrentOrg] = useLocalStorage<Org>('currentOrg',{id:'weea434',logoUrl:'dfaerefadf',name:'Mujeex labs'})

    const switchOrg = (org:Org)=>{
        // setInLocal storage
        setCurrentOrg(org)
    }

    // This function removes the active org from site.
    // Should be called when user logsOut.
    const exitOrg = ()=>{
        deleteStorage('currentOrg')
    }
    // get active org from local storage
    // switch org in 

    return {currentOrg, switchOrg, exitOrg}
}