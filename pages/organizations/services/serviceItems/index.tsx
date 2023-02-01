import React, { Suspense } from 'react'
import ServiceItemPageView from '../../../../components/Manager/ServiceItemsPage'
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
                    <Col offset={1} span={20}>
                    {/* <div style={{width:'100%', display:'flex', marginTop:'2rem', marginBottom:'3rem', justifyContent:'flex-end', alignItems:'center'}}> */}
                        {/* <Title style={{marginLeft: '1em'}} level={3}>Organizations</Title> */}
                        {/* <Button shape='round' type='primary' icon={<PlusOutlined/>} onClick={()=>router.push('/organizations/services/serviceItems/new')}>New service-item</Button> */}
                    {/* </div> */}
                        <Content
                            style={{

                            margin:'1em',
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

