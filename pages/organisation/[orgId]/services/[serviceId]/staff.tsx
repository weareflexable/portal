import React from 'react'
import StaffView from '../../../../../components/StaffsPage'
import AppLayout from '../../../../../components/shared/Layout/layout'
import { useAuthContext } from '../../../../../context/AuthContext'
import { Content } from 'antd/lib/layout/layout'
import { Typography,Row, Col } from 'antd'
const {Title} = Typography

export default function Staff(){


    return(
        
        <AppLayout>
            <Row>
                <Col offset={1} span={21}>
                    <Title style={{marginLeft: '1em', marginTop:'1em'}} level={3}>Staff</Title>
                    <Content
                        style={{
                        padding: '1em',
                        margin:'1em',
                        background:'white' ,
                        width:`98%`,
                        maxWidth:'100%',
                        height: '100%',
                        minHeight:'70vh',
                        }}
                    >
                        <StaffView/>
                    </Content>
                </Col>
            </Row>
        </AppLayout>
    )
}