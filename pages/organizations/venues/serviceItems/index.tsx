import React, { Suspense } from 'react'
import ServiceItemPageView from '../../../../components/ServiceItemsPage'
import AppLayout from '../../../../components/Layout/layout' 
import { Content } from 'antd/lib/layout/layout'
import {PlusOutlined} from "@ant-design/icons"
import { Typography, Row, Col, Spin, Button } from 'antd'
const {Title} = Typography
import { useRouter } from 'next/router'
import ServiceItemErrorBoundary from '../../../../components/shared/ErrorBoundary/ErrorBoundary'
import dynamic from 'next/dynamic'
import VenuesLayout from '../../../../components/Layout/VenuesLayout'

// const DynamicServiceItems = dynamic(()=>import('../../../../../components/ServiceItemsPage'),{
//     ssr:false
// })

export default function Services(){ // ServiceItems

    const router = useRouter()

    return(
                <Row>
                    <Col offset={0} span={23}>
                    <div style={{display:'flex', marginTop:'1rem', marginBottom:'1rem', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                        <Title style={{ margin:'0'}} level={2}>Services</Title>
                    </div>
                        <Content 
                            style={{
                            // background:'white' ,
                            width:`100%`,
                            maxWidth:'100%',
                            // height: '100%',
                            // minHeight:'70vh',
                            }}
                        > 
                            <ServiceItemErrorBoundary name='Service page'>
                                    <ServiceItemPageView/>
                            </ServiceItemErrorBoundary>
                        </Content>
                    </Col>
                </Row>
    )
}


Services.PageLayout = VenuesLayout



