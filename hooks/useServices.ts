import {useState} from 'react'
import { Service } from '../types/Services'
import { deleteStorage} from '../utils/storage'
import useLocalStorage from './useLocalStorage'
// import useLocalStorage

export default function useServices(){
    // const [activeService, setActiveService] = useState<Service>({id:'weea434',logoUrl:'dfaerefadf',name:'Mujeex labs'})
    const [currentService, setCurrentService] = useLocalStorage<Service>('currentService',{id:'weea434',address:'Syracuse NY, Bacon Hill',name:'Mujeex labs',type:'Bar',storeCoverImage:[''],storeLogo:['']})

    const switchService = (org:Service)=>{
        // setInLocal storage
        setCurrentService(org)
    }


    // This function removes the active org from site.
    // Should be called when user logsOut.
    const exitService = ()=>{
        deleteStorage('currentService')
    }
    // get active org from local storage
    // switch org in 

    return {currentService, switchService, exitService}
}