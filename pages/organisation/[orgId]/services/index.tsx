import React from 'react'
import ServiceView from '../../../../components/VenuesPage/VenueView/VenueView'
import AppLayout from '../../../../components/shared/Layout/layout'
import { Content } from 'antd/lib/layout/layout'

export default function Stores(){
    return(
        
        <AppLayout>
            <Content
                style={{
                padding: '1em',
                margin:'1em',
                background:'white' ,
                width:`98%`,
                maxWidth:'100%',
                height: '100%',
                minHeight:'100vh',
                }}
            >
                <ServiceView/>
            </Content>
        </AppLayout>
    )
}