import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {useState, useEffect}  from 'react'
import { useAuthContext } from '../context/AuthContext'
import { ActiveOrgs, Org } from '../types/OrganisationTypes';
import useOrgs from './useOrgs';

// const initOrgs: Org[] = [
//     {id:'faefe3fdafdr3', name: 'Mujeex Labs', logoUrl:'https://joeschmoe.io/api/v1/random',role:'Admin'},
//     {id:'faefedavav33263r3', name: 'Schelling overs', logoUrl:'https://joeschmoe.io/api/v1/random',role: 'Staff'},
//     {id:'faeffa6ndje3r3', name: 'Magic Mike Exclusive Club', logoUrl:'https://joeschmoe.io/api/v1/random',role:'Admin'}
// ]

export default function useFetchUserOrgs(){
    // get currentOrg from hook
    const {currentOrg} = useOrgs()
    const {paseto} = useAuthContext()

    const {data,isLoading:isLoadingOrgs} = useQuery(['orgs'],async()=>{
        const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1.0/org/user/get-org`,{
            headers:{
                //@ts-ignore
                "Authorization": paseto
            }
        })
        return data;
    })

    console.log(data)

    const orgs: Org[] = data ? data?.payload :[]


    // use react query to fetch all orgs 

    const determineCurrentOrg = (orgs:Org[])=>{
        return orgs.map((org:Org):ActiveOrgs =>(
             {
                ...org,
                isActive: org.id == currentOrg.id? true:false
            }
        ))

    }

    // // indicates the org user is currently in
    const activeOrgs = determineCurrentOrg(orgs)




    // fetch all orgs belonging to a user
    return {
        orgs:activeOrgs,
        isLoadingOrgs
    }
}