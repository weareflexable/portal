import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import BookingsView from '../../../components/BookingsPage/index'
import AppLayout from '../../../components/Layout/layout'
import { Typography,Col, Row } from 'antd'
import VenuesLayout from '../../../components/Layout/VenuesLayout'

export default function VenueBookings(){
    return(
            <Row>
                <Col offset={0} span={23}>
                    <Content
                        style={{
                        // margin:'1em',
                        width:`100%`,
                        maxWidth:'100%',
                        // height: '100%',
                        // minHeight:'70vh',
                        }}
                    > 
                        <BookingsView/>
                    </Content>
                </Col>
            </Row>

    )
}

VenueBookings.PageLayout = VenuesLayout