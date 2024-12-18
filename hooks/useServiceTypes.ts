import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useAuthContext } from '../context/AuthContext'
import useUrlPrefix from './useUrlPrefix'
import utils from '../utils/env'

export default function useServiceTypes(){
    const {paseto} = useAuthContext()
    const urlPrefix = useUrlPrefix()

    const fetchServiceTypes = async()=>{
        const {data} = await axios.get(`${utils.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-types?pageNumber=1&pageSize=20&status=1`,{
            headers:{
                //@ts-ignore
                "Authorization":paseto
            }
        })
        return data && data.data
    }

    
    const {data:serviceTypes} = useQuery({queryKey:['serviceTypes'],queryFn:fetchServiceTypes, staleTime: Infinity})


    const menuItems = serviceTypes && serviceTypes.map((service:any)=>({
            label: service.name,
            value: service.id
    }))

    return menuItems
}