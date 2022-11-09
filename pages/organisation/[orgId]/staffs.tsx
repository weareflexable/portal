import React from 'react'
import StaffView from '../../../components/StaffsPage/StaffView/StaffView'
import AppLayout from '../../../components/shared/Layout/layout'
import { useAuthContext } from '../../../context/AuthContext'

export default function Staffs(){


    return(
        <AppLayout>
            <StaffView/>
        </AppLayout>
    )
}