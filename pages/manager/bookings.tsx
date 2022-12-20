import React from 'react'
import { Content } from 'antd/lib/layout/layout'
import { Typography,Row, Col } from 'antd'
import ManagerLayout from '../../components/Manager/Layout/Layout'

const {Title} = Typography

export default function AdminStaff(){


    return(
        
        <ManagerLayout>
            <Row>
                <Col offset={1} span={15}>
                    <Title style={{marginLeft: '1em', marginTop:'1em'}} level={3}>Organization bookings</Title>
                    <Content
                        style={{
                        padding: '1em',
                        margin:'1em',
                        background:'white' ,
                        width:`98%`,
                        maxWidth:'100%',
                        }}
                    >
                        {/* <StaffView/> */}
                    </Content>
                </Col>
            </Row>
        </ManagerLayout>
    )
}
