import React from 'react'
import { Content } from 'antd/lib/layout/layout'
import { Typography,Row, Col } from 'antd'
import UsersView from '../../components/Manager/Users/UsersView'
import ManagerLayout from '../../components/Layout/ManagerLayout'

const {Title} = Typography

export default function ManagerUsers(){


    return(
        
            <Row>
                <Col offset={1} span={22}>
                
                    <Content
                        style={{
                        margin:'1em',
                        width:`98%`,
                        maxWidth:'100%',
                        }}
                    >
                        <UsersView/>
                    </Content>
                </Col>
            </Row>
    )
}


ManagerUsers.PageLayout = ManagerLayout