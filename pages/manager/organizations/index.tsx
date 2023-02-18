import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import { Typography,Col, Row, Button, Tabs } from 'antd'

import ManagerLayout from '../../../components/Manager/Layout/Layout'
import { useRouter } from 'next/router'
import ManagerOrgsView from '../../../components/Manager/Organizations/ManagerOrgsView/ManagerOrgsView'
const {Title} = Typography;
import { PlusOutlined } from '@ant-design/icons';

export default function ManagerOrganizations(){

    const router =  useRouter()
    
    return(
        <ManagerLayout>
            <Row>
                <Col offset={1} span={22}>
                    <div style={{width:'100%', display:'flex', marginTop:'2rem', justifyContent:'space-between', alignItems:'center'}}>
                        <Title style={{marginLeft: '1em'}} level={3}>Organizations</Title>
                        <Button shape='round' type='primary' icon={<PlusOutlined/>} onClick={()=>router.push('/manager/organizations/new')}>New Organization</Button>
                    </div>
                    <Content
                        style={{
                        // padding: '1em',
                        margin:'1em',
                        // background:'white' ,
                        width:`98%`,
                        maxWidth:'100%',
                        }}
                    > 
                            <ManagerOrgsView/>

                    </Content>
                </Col>
            </Row>
        </ManagerLayout>

    )
}