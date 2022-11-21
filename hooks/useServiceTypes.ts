import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {useState} from 'react'
import { useAuthContext } from '../context/AuthContext'

export default function useServiceTypes(){
    const {paseto} = useAuthContext()

    const fetchServiceTypes = async()=>{
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/services/public/generic-services`,{
            headers:{
                //@ts-ignore
                "Authorization":JSON.parse(paseto)
            }
        })
        return data?.payload
    }

    const {data:serviceTypes} = useQuery(['serviceTypes'],fetchServiceTypes)

    const menuItems = serviceTypes && serviceTypes.map((service:any)=>({
            label: service.name,
            value: service.id
    }))

    return menuItems
}