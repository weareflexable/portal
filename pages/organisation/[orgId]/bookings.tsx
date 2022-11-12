import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import BookingsView from '../../../components/BookingsPage/index'
import AppLayout from '../../../components/shared/Layout/layout'

export default function Bookings(){
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
                <BookingsView/>
            </Content>
        </AppLayout>

    )
}