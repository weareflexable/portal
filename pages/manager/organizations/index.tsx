import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import { Typography,Col, Row, Button, Tabs } from 'antd'

// import AdminOrgs from '../components/AdminOrgs'
import TabPane from 'antd/lib/tabs/TabPane'
// import AwaitingOrgs from '../components/AdminOrgs/AwaitingOrgsTable'
import ManagerLayout from '../../../components/Manager/Layout/Layout'
import ManagerOrgsLayout from '../../../components/Manager/Organizations/Layout'
const {Title} = Typography;

export default function Bookings(){
    return(

        <ManagerLayout>
            <Row>
                <Col offset={1} span={21}>
                    <Title style={{marginLeft: '1em', marginTop:'1em'}} level={3}>Organizations</Title>
                    <Content
                        style={{
                        padding: '1em',
                        margin:'1em',
                        background:'white' ,
                        width:`98%`,
                        maxWidth:'100%',
                        }}
                    > 
                        <ManagerOrgsLayout>
                            
                        </ManagerOrgsLayout>
                    </Content>
                </Col>
            </Row>
        </ManagerLayout>

    )
}