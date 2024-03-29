
import { Community } from '../types/Community'
import { deleteStorage} from '../utils/storage'
import useLocalStorage from './useLocalStorage'


export default function useCommunity(){
    // const [activeOrg, setActiveOrg] = useState<Org>({id:'weea434',logoUrl:'dfaerefadf',name:'Mujeex labs'})
    const [currentCommunity, setCurrentCommunity] = useLocalStorage('currentCommunity',[])

    const switchCommunity = (org:Community)=>{
        // setInLocal storage
        setCurrentCommunity(org)
    }


    // This function removes the active org from site.
    // Should be called when user logsOut.
    const exitCommunity = ()=>{
        deleteStorage('currentCommunity')
    }

    return {currentCommunity, switchCommunity, exitCommunity}
}