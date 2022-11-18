import {useState, useEffect}  from 'react'
import { useAuthContext } from '../context/AuthContext'
import { Service } from '../types/Services';
import useServices from './useServices';

// const initServices: Service[] = [
//     {id:'weea4feq56534',address:'Syracuse NY, Bacon Hill',name:'Benjamins On Franklin',type:'Bar',storeCoverImage:[''],storeLogo:['']},
//     {id:'weeafda4fa434',address:'Canada, Tukur road',name:'Turing restaurant',type:'Restaurant',storeCoverImage:[''],storeLogo:['']},
//     {id:'weegjyriya434',address:'Pablo main, Mountain Hill',name:'Mujeex Gyms',type:'Gym',storeCoverImage:[''],storeLogo:['']},
//    ]

export default function useFetchUserServices(){
    // get currentService from hook
    const {currentService} = useServices()

    const [services, setServices] = useState<Service[]>([])

    // use react query to fetch all services

    const determineCurrentService = ()=>{
        const servicesCopy = [...services];
        return servicesCopy.map(service=>(
             {
                ...service,
                isActive: service.id == currentService.id? true:false
            }
        ))

    }

    // indicates the service user is currently in
    const activeServices = determineCurrentService()



    // fetch all services belonging to a user
    return {
        services:activeServices,
    }
}