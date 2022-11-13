import React from 'react'
import ServicePageView from '../../../../components/ServicePage'
import AppLayout from '../../../../components/shared/Layout/layout' 
import { Content } from 'antd/lib/layout/layout'

export default function Staffs(){
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
                <ServicePageView/>
            </Content>
        </AppLayout> 
    )
}