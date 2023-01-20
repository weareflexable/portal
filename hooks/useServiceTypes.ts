import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {useState} from 'react'
import { useAuthContext } from '../context/AuthContext'

export default function useServiceTypes(){
    const {paseto} = useAuthContext()

    const fetchServiceTypes = async()=>{
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_NEW_API_URL}/manager/service-types?pageNumber=0&pageSize=5`,{
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