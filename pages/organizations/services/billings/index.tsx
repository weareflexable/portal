import { Content } from 'antd/lib/layout/layout'
import { Typography, Row, Button, Col } from 'antd'
const {Title} = Typography
import {ArrowLeftOutlined} from '@ant-design/icons'
import React from 'react'
import BillingsView from '../../../../components/BillingsPage'
import AppLayout from '../../../../components/shared/Layout/layout'
import { useRouter } from 'next/router'

export default function Billings(){

    const router = useRouter()
    
    return(
        // <AppLayout>
        <div style={{background:'#f6f6f6', height:'100%', minHeight:'100vh'}}>
            <Row>
                <Col offset={1} span={22}> 
                    <div style={{display:'flex', flex:'7',   marginTop:'1rem', marginBottom:'2rem', flexDirection:'column'}}> 
                        <Button style={{display:'flex', padding: '0', margin:'0', alignItems:'center', textAlign:'left'}} onClick={()=>router.back()} icon={<ArrowLeftOutlined />} type='link'>Back to services</Button>
                        <Title style={{margin:0}} level={2}> Billings </Title>    
                    </div>
                </Col> 
            </Row>
             <Row >
                <Col offset={1} span={22}>
                    <Content
                        style={{
                            // margin:'1em',
                            maxWidth:'100%',
                        }}
                        >
                        <BillingsView/>
                    </Content>
                </Col>
            </Row>
    </div>
    )
}
