import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import BookingsView from '../../../components/BookingsPage/index'
import AppLayout from '../../../components/shared/Layout/layout'
import { Typography,Col, Row } from 'antd'
import dynamic from 'next/dynamic'
const {Title} = Typography;

export default function Bookings(){
    return(

        <AppLayout>
            <Row>
                <Col offset={1} span={22}>
                    <Title style={{marginTop:'1em'}} level={3}>Bookings</Title>
                    <Content
                        style={{
                        // margin:'1em',
                        width:`98%`,
                        maxWidth:'100%',
                        // height: '100%',
                        // minHeight:'70vh',
                        }}
                    > 
                        <BookingsView/>
                    </Content>
                </Col>
            </Row>
        </AppLayout>

    )
}