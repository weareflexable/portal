import React from 'react'
import StaffView from '../../../../../components/StaffsPage'
import AppLayout from '../../../../../components/shared/Layout/layout'
import { useAuthContext } from '../../../../../context/AuthContext'
import { Content } from 'antd/lib/layout/layout'
import { Typography,Row, Col } from 'antd'
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
                        // height: '100%',
                        // minHeight:'70vh',
                        }}
                    >
                        <DynamicStaff/>
                    </Content>
                </Col>
            </Row>
        </AppLayout>
    )
}
