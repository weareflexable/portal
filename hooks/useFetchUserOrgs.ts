import {useState, useEffect}  from 'react'
import { useAuthContext } from '../context/AuthContext'
import { Org } from '../types/OrganisationTypes';
import useActiveOrgs from './useOrgs';

const initOrgs: Org[] = [
    {id:'faefe3fdafdr3', name: 'Mujeex Labs', logoUrl:'https://joeschmoe.io/api/v1/random'},
    {id:'faefedavav33263r3', name: 'Schelling overs', logoUrl:'https://joeschmoe.io/api/v1/random'},
    {id:'faeffa6ndje3r3', name: 'Magic Mike Exclusive Club', logoUrl:'https://joeschmoe.io/api/v1/random'}
]

export default function useFetchUserOrgs(){
    const {isAuthenticated} = useAuthContext();
    // get currentOrg from hook
    const {currentOrg} = useActiveOrgs()

    const [orgs, setOrgs] = useState<Org[]>(initOrgs)

    // use react query to fetch all orgs

    const determineCurrentOrg = ()=>{
        const orgsCopy = [...orgs];
        return orgsCopy.map(org=>(
             {
                ...org,
                status: org.id == currentOrg.id? true:false
            }
        ))

    }

    const activeOrgs = determineCurrentOrg()



    // fetch all orgs belonging to a user
    return {
        orgs:activeOrgs,

    }
}