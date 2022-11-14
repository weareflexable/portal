import { Content } from 'antd/lib/layout/layout'
import { Typography } from 'antd'
const {Title} = Typography
import React from 'react'
import BillingsView from '../../../../../components/BillingsPage/BillingsView/BillingsView'
import AppLayout from '../../../../../components/shared/Layout/layout'

export default function Billings(){
    return(
        <AppLayout>
        <Title style={{marginLeft: '1em', marginTop:'1em'}} level={3}>Billings</Title>
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
            <BillingsView/>
        </Content>
    </AppLayout>
    )
}