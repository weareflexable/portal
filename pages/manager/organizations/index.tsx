import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import { Typography,Col, Row, Button, Tabs } from 'antd'

// import AdminOrgs from '../components/AdminOrgs'
import TabPane from 'antd/lib/tabs/TabPane'
// import AwaitingOrgs from '../components/AdminOrgs/AwaitingOrgsTable'
import ManagerLayout from '../../../components/Manager/Layout/Layout'
import ManagerOrgsLayout from '../../../components/Manager/Organizations/Layout'
import ApprovedOrgs from '../../../components/Manager/Organizations/ApprovedOrgsTable/ApprovedOrgsTable'
import { useRouter } from 'next/router'
const {Title} = Typography;

export default function ManagerOrganizations(){

    const router =  useRouter()
    
    return(
        <ManagerLayout>
            <Row>
                <Col offset={1} span={21}>
                    <div style={{width:'100%', display:'flex', marginTop:'2rem', justifyContent:'space-between', alignItems:'center'}}>
                        <Title style={{marginLeft: '1em'}} level={3}>Organizations</Title>
                        <Button type='primary' onClick={()=>router.push('/manager/organizations/new')}>Create organization</Button>
                    </div>
                    <Content
                        style={{
                        padding: '1em',
                        margin:'1em',
                        // background:'white' ,
                        width:`98%`,
                        maxWidth:'100%',
                        }}
                    > 

                            <ApprovedOrgs/>

                    </Content>
                </Col>
            </Row>
        </ManagerLayout>

    )
}