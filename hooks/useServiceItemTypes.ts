import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {useState} from 'react'
import { useAuthContext } from '../context/AuthContext'
import { useServicesContext } from '../context/ServicesContext'

export default function useServiceTypes(){
    const {paseto} = useAuthContext()
    const {currentService} = useServicesContext()
    // @ts-ignore
    const serviceTypeId = currentService.serviceType[0].id

    const fetchServiceItemTypes = async()=>{
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/service_item_types?pageNumber=0&pageSize=10&key=service_type_id&value=${serviceTypeId}`,{
            headers:{
                //@ts-ignore
                "Authorization":paseto
            }
        })
        return data?.data
    }

    const {data:serviceTypes} = useQuery(['serviceItemTypes'],fetchServiceItemTypes)

    const menuItems = serviceTypes && serviceTypes.map((service:any)=>({
            label: service.name,
            value: service.id
    }))

    return menuItems
}