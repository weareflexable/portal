
import { Event } from '../types/Event'
import { deleteStorage} from '../utils/storage'
import useLocalStorage from './useLocalStorage'


export default function useEvent(){
    // const [activeOrg, setActiveOrg] = useState<Org>({id:'weea434',logoUrl:'dfaerefadf',name:'Mujeex labs'})
    const [currentEvent, setCurrentEvent] = useLocalStorage('currentEvent',[])

    const switchEvent = (org:Event)=>{
        // setInLocal storage
        setCurrentEvent(org)
    }


    // This function removes the active org from site.
    // Should be called when user logsOut.
    const exitEvent = ()=>{
        deleteStorage('currentEvent')
    }

    return {currentEvent, switchEvent, exitEvent}
}