import React from 'react'
import ServicePageView from '../../../../../components/ServiceItemsPage'
import AppLayout from '../../../../../components/shared/Layout/layout' 
import { Content } from 'antd/lib/layout/layout'
import { Typography, Row, Col } from 'antd'
const {Title} = Typography
import { useRouter } from 'next/router'
import ServiceItemErrorBoundary from '../../../../../components/ServiceItemsPage/ErrorBoundary/ServiceItemErrorBoundary'

export default function Staffs(){

    const router = useRouter()

    return(
        <AppLayout>
            <Row>
                <Col offset={1} span={15}>
                    <Title style={{marginLeft: '1em', marginTop:'1em'}} level={3}>Service Item</Title>
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
                        <ServiceItemErrorBoundary>
                            <ServicePageView/>
                        </ServiceItemErrorBoundary>
                    </Content>
                </Col>
            </Row>
        </AppLayout> 
    )
}