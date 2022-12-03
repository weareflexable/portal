import React from 'react'
import AppLayout from '../../../../../components/shared/Layout/layout'
import { Content } from 'antd/lib/layout/layout'
import { Typography,Row, Col, Spin } from 'antd'
import dynamic from 'next/dynamic'
const {Title} = Typography

const DynamicStaff = dynamic(()=>import('../../../../../components/StaffsPage'),{
    ssr:false
})


export default function Staff(){


    return(
        
        <AppLayout>
                <Row>
                    <Col offset={1} span={15}>
                        <Title style={{marginLeft: '1em', marginTop:'1em'}} level={3}>Staff</Title>
                        <Content
                            style={{
                            padding: '1em',
                            margin:'1em',
                            background:'white' ,
                            width:`98%`,
                            maxWidth:'100%',
                            }}
                        >
                                <DynamicStaff/>
                        </Content>
                    </Col>
                </Row>
        </AppLayout>
    )
}
