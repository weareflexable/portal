import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

export default function useSession(){
    const [sessionStatus, setSessionStatus] = useState('active')
    const {paseto} = useAuthContext()

    async function getDecodedPaseto(){
        // const res =  await axios.get('')
        
    }

    const pasetoQuery = useQuery(['pasetoQuery'],getDecodedPaseto,{
        enabled: paseto !== '',
        onSuccess:(data)=>{
            // check if date has expired
            const isPasetoExpired = false
            if(isPasetoExpired){

                // setSession('expired')
            }else{

                // setSession('active')
            }
            // change isPastoExpired state accordingly
        },
        onError:()=>{
            // change user session to stale unable to fetch
            setSessionStatus('checking')
        },
        onSettled:()=>{
            // change state
        }
    })

    return{
        isCheckingUserSession: pasetoQuery.isLoading,
        sessionStatus: sessionStatus
    }

}