import { Content } from 'antd/lib/layout/layout'
import React, { Suspense } from 'react'
import BookingsView from '../../../../../components/BookingsPage/index'
import AppLayout from '../../../../../components/shared/Layout/layout'
import { Typography,Col, Row, Spin } from 'antd'
import dynamic from 'next/dynamic'
const {Title} = Typography;

const DynamicBookings = dynamic(()=>import('../../../../../components/BookingsPage/index'),{
    ssr:false
})

export default function Bookings(){
    return(

        <AppLayout>
            <Row>
                <Col offset={1} span={21}>
                    <Title style={{marginLeft: '1em', marginTop:'1em'}} level={3}>Bookings</Title>
                    <Content
                        style={{
                        padding: '1em',
                        margin:'1em',
                        background:'white' ,
                        width:`98%`,
                        maxWidth:'100%',
                        // height: '100%',
                        // minHeight:'70vh',
                        }}
                    > 
                        <Suspense fallback={<Spin size='large'/>}>
                         <DynamicBookings/>
                        </Suspense>
                    </Content>
                </Col>
            </Row>
        </AppLayout>

    )
}