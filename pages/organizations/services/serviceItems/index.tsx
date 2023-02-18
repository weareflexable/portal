import React, { Suspense } from 'react'
import ServiceItemPageView from '../../../../components/ServiceItemsPage'
import AppLayout from '../../../../components/shared/Layout/layout' 
import { Content } from 'antd/lib/layout/layout'
import {PlusOutlined} from "@ant-design/icons"
import { Typography, Row, Col, Spin, Button } from 'antd'
const {Title} = Typography
import { useRouter } from 'next/router'
import ServiceItemErrorBoundary from '../../../../components/shared/ErrorBoundary/ErrorBoundary'
import dynamic from 'next/dynamic'

// const DynamicServiceItems = dynamic(()=>import('../../../../../components/ServiceItemsPage'),{
//     ssr:false
// })

export default function Staffs(){

    const router = useRouter()

    return(
        <AppLayout>
                <Row>
                    <Col offset={1} span={22}>
                    <div style={{width:'100%', display:'flex', marginTop:'.5rem', justifyContent:'space-between', alignItems:'center'}}> 
                        <Title level={2}>Services</Title> 
                     </div>
                        <Content
                            style={{
                            // background:'white' ,
                            // width:`98%`,
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
        </AppLayout> 
    )
}

