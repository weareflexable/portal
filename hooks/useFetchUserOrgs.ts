import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {useState, useEffect}  from 'react'
import { useAuthContext } from '../context/AuthContext'
import { ActiveOrgs, NewOrg, Org } from '../types/OrganisationTypes';
import useOrgs from './useOrgs';
import utils from '../utils/env';

// const initOrgs: Org[] = [
//     {id:'faefe3fdafdr3', name: 'Mujeex Labs', logoUrl:'https://joeschmoe.io/api/v1/random',role:'Admin'},
//     {id:'faefedavav33263r3', name: 'Schelling overs', logoUrl:'https://joeschmoe.io/api/v1/random',role: 'Staff'},
//     {id:'faeffa6ndje3r3', name: 'Magic Mike Exclusive Club', logoUrl:'https://joeschmoe.io/api/v1/random',role:'Admin'}
// ]

export default function useFetchUserOrgs(){
    // get currentOrg from hook
    const {currentOrg} = useOrgs()
    const {paseto} = useAuthContext()

    const queryClient = useQueryClient()

    useEffect(() => {
        queryClient.invalidateQueries(['orgs'])
    }, [])

    const orgsQuery = useQuery(['orgs'],async()=>{
        const {data} = await axios.get(`${utils.NEXT_PUBLIC_NEW_API_URL}/admin/orgs?tatus=1&pageNumber=1&pageSize=30&key2=created_by`,{
            headers:{
                //@ts-ignore
                "Authorization": paseto
            }
        })
        return data;
    },
    {
        staleTime:Infinity
    }
    )

    
    const orgs: NewOrg[] = orgsQuery.data ? orgsQuery.data.data :[]
    

    // use react query to fetch all orgs 

    const determineCurrentOrg = (orgs:NewOrg[])=>{
        return orgs.map((org:NewOrg):ActiveOrgs =>(
             {
                ...org,
                // @ts-ignore
                isActive: org.orgId == currentOrg.orgId? true:false
            }
        ))

    }

    // // // indicates the org user is currently in
    const activeOrgs = determineCurrentOrg(orgs)
    console.log(activeOrgs)




    // fetch all orgs belonging to a user
    return {
        orgs:activeOrgs,
        isLoadingOrgs: orgsQuery.isLoading
    }
}