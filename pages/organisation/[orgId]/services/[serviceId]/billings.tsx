import { Content } from 'antd/lib/layout/layout'
import { Typography, Row, Col } from 'antd'
const {Title} = Typography
import React from 'react'
import BillingsView from '../../../../../components/BillingsPage'
import AppLayout from '../../../../../components/shared/Layout/layout'

export default function Billings(){
    return(
        <AppLayout>
             <Row>
                <Col offset={1} span={21}>
                    <Title style={{marginLeft: '1em', marginTop:'1em'}} level={3}>Billings</Title>
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
                        <BillingsView/>
                    </Content>
                </Col>
            </Row>
    </AppLayout> 
    )
}