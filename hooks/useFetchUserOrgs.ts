import {useState, useEffect}  from 'react'
import { useAuthContext } from '../context/AuthContext'
import { Org } from '../types/OrganisationTypes';
import useOrgs from './useOrgs';

const initOrgs: Org[] = [
    {id:'faefe3fdafdr3', name: 'Mujeex Labs', logoUrl:'https://joeschmoe.io/api/v1/random',role:'Admin'},
    {id:'faefedavav33263r3', name: 'Schelling overs', logoUrl:'https://joeschmoe.io/api/v1/random',role: 'Staff'},
    {id:'faeffa6ndje3r3', name: 'Magic Mike Exclusive Club', logoUrl:'https://joeschmoe.io/api/v1/random',role:'Admin'}
]

export default function useFetchUserOrgs(){
    // get currentOrg from hook
    const {currentOrg} = useOrgs()

    const [orgs, setOrgs] = useState<Org[]>(initOrgs)

    // use react query to fetch all orgs

    const determineCurrentOrg = ()=>{
        const orgsCopy = [...orgs];
        return orgsCopy.map(org=>(
             {
                ...org,
                isActive: org.id == currentOrg.id? true:false
            }
        ))

    }

    // indicates the org user is currently in
    const activeOrgs = determineCurrentOrg()



    // fetch all orgs belonging to a user
    return {
        orgs:activeOrgs,

    }
}