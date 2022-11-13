import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import BookingsView from '../../../../../components/BookingsPage/index'
import AppLayout from '../../../../../components/shared/Layout/layout'
import { Typography } from 'antd'
const {Title} = Typography;

export default function Bookings(){
    return(

        <AppLayout>
            <Title style={{marginLeft: '1em', marginTop:'1em'}} level={3}>Bookings</Title>
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
                <BookingsView/>
            </Content>
        </AppLayout>

    )
}