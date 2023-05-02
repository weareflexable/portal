import React from 'react'
import { Content } from 'antd/lib/layout/layout'
import { Typography,Row, Col } from 'antd'
import ManagerBookingsView from '../../components/Manager/Bookings/Bookings'
import ManagerLayout from '../../components/Layout/ManagerLayout'

const {Title} = Typography

export default function ManagerBookings(){


    return(
        
            <Row>
                <Col offset={1} span={22}>
                    <Content
                        style={{
                        margin:'1em',
                        width:`98%`,
                        maxWidth:'100%',
                        }}
                    >
                        <ManagerBookingsView/>
                    </Content>
                </Col>
            </Row>

    )
}


ManagerBookings.PageLayout = ManagerLayout