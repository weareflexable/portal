import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {useState} from 'react'
import { useAuthContext } from '../context/AuthContext'
import { useServicesContext } from '../context/ServicesContext'

export default function useServiceTypes(){
    const {paseto} = useAuthContext()
    const {currentService} = useServicesContext()

    const fetchServiceItemTypes = async()=>{
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/services/user/get-generic-service?orgServiceId=${currentService.id}`,{
            headers:{
                //@ts-ignore
                "Authorization":JSON.parse(paseto)
            }
        })
        return data?.payload
    }

    const {data:serviceTypes} = useQuery(['serviceItemTypes'],fetchServiceItemTypes)

    const menuItems = serviceTypes && serviceTypes.map((service:any)=>({
            label: service.serviceItemName,
            value: service.serviceItemId
    }))

    return menuItems
}