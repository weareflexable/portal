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
        const {data} =  await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/services/user/get-services?orgId=${currentOrg.id}`,{
            headers:{
                //@ts-ignore
                "Authorization": JSON.parse(paseto)
            }
        })
        return data?.payload;
    }

    // use react query to fetch all services
    const {data,isLoading,isSuccess} = useQuery(['services'],fetchServices);
    console.log(data, isSuccess);

    const fetchedServices: Service[] = data && data;


    const determineCurrentService = (services: Service[])=>{
        const servicesCopy = services && [...services]
        return servicesCopy.map(service=>(
             {
                ...service,
                isActive: service.id == currentService.id? true:false
            }
        ))
    } 

    // indicates the service user is currently in
    const activeServices = fetchedServices && determineCurrentService(fetchedServices)
    // console.log(test)
    // const activeServices = fetchedServices




    // fetch all services belonging to a user
    return {
        services:activeServices,
        isFetchingServices: isLoading
    }
}