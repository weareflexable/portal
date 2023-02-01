import React from 'react'
import { Content } from 'antd/lib/layout/layout'
import { Typography,Row, Col } from 'antd'
import ManagerLayout from '../../components/Manager/Layout/Layout'
import ManagerBookingsView from '../../components/Manager/Bookings/Bookings'

const {Title} = Typography

export default function AdminStaff(){


    return(
        
        <ManagerLayout>
            <Row>
                <Col offset={1} span={22}>
                    <Title style={{marginLeft: '1em', marginTop:'1em'}} level={2}>Bookings</Title>
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
        </ManagerLayout>
    )
}
