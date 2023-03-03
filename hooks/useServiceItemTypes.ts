import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {useEffect, useState} from 'react'
import { useAuthContext } from '../context/AuthContext'
import { useServicesContext } from '../context/ServicesContext'

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


    const fetchServiceItemTypes = async()=>{
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/service-item-types?pageNumber=0&pageSize=10&key=service_type_id&value=${serviceTypeId}&key2=status&value2=1`,{
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