import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {useEffect, useState} from 'react'
import { useAuthContext } from '../context/AuthContext'
import { useServicesContext } from '../context/ServicesContext'
import useUrlPrefix from './useUrlPrefix'
import utils from '../utils/env'

export default function useServiceItemTypes(){
    const {paseto} = useAuthContext()
    const {currentService} = useServicesContext()
    // console.log('currenService', currentService.serviceType[0])
    // @ts-ignore
    // const [hydrated,setHydrated] = useState(false)
    // const [serviceTypeId, setServiceTypeId] = useState('')

    const serviceTypeId = currentService.serviceTypeId

    // useEffect(() => {
    //     setServiceTypeId(currentService.serviceType[0].id) 
    // }, [currentService.serviceType, hydrated])

    const urlPrefix = useUrlPrefix()

    const fetchServiceItemTypes = async()=>{
        const {data} = await axios.get(`${utils.NEXT_PUBLIC_NEW_API_URL}/${urlPrefix}/service-item-types?pageNumber=1&pageSize=20&serviceTypeId=${serviceTypeId}&status=1`,{
            headers:{
                //@ts-ignore
                "Authorization":paseto
            }
        })
        return data?.data
    }

    const {data:serviceItemTypes} = useQuery({queryKey:['serviceItemTypes'],queryFn:fetchServiceItemTypes,enabled:serviceTypeId!==''||undefined})

    const menuItems = serviceItemTypes && serviceItemTypes.map((service:any)=>({
            label: service.name,
            value: service.id
    }))
 

    return menuItems || []
}