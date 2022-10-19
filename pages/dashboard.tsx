import React from 'react'
import AppLayout from '../components/shared/layout'
import { useAuthContext } from '../context/AuthContext'

export default function Dashboard(){

    const {isAuthenticated} = useAuthContext() 

    return(
        <AppLayout>
            {isAuthenticated? <div>Dashboard will be here</div>: <div>You gotta authenticate bro</div>  }
        </AppLayout>
    )
}