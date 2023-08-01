import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext'
import { useOrgContext } from '../context/OrgContext';
import { Service } from '../types/Services';
import useServices from './useServices';


export default function useFetchUserServices(){
    // get currentService from hook
    const {currentService} = useServices()
    const {paseto} =  useAuthContext()
    const {currentOrg} = useOrgContext()

    const fetchServices = async()=>{
        //@ts-ignore
        const {data} =  await axios.get(`${process.env.NEXT_PUBLIC_NEW_API_URL}/admin/services?key=org_id&value=${currentOrg.orgId}&pageNumber=1&pageSize=20`,{
            headers:{
                //@ts-ignore
                "Authorization": paseto
            }
        })
        return data?.data;
    }

    // use react query to fetch all services
    const servicesQuery = useQuery(['services'],fetchServices,{enabled:currentOrg != undefined});

    // const fetchedServices: Service[] = servicesQuery && servicesQuery.data;

    const determineCurrentService = (services: Service[])=>{
        const servicesCopy = services && [...services]
        return servicesCopy.map(service=>(
             {
                ...service,
                isActive: service.id == currentService.id? true:false
            }
        ))
    } 

    // // indicates the service user is currently in
    const activeServices = servicesQuery.data && determineCurrentService(servicesQuery.data)

    // fetch all services belonging to a user
    return {
        services:activeServices,
        isFetchingServices: servicesQuery.isLoading
    }
}