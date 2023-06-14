import React from 'react'
import StaffView from '../../../../components/StaffPage'
import AppLayout from '../../../../components/Layout/layout'
import { Content } from 'antd/lib/layout/layout'
import { Typography,Row, Col, Spin } from 'antd'
import dynamic from 'next/dynamic'
import VenuesLayout from '../../../../components/Layout/VenuesLayout'
const {Title} = Typography

// const DynamicStaff = dynamic(()=>import('../../../../../components/StaffsPage'),{
//     ssr:false
// })


export default function VenueStaff(){


    return(
    
                <Row>
                    <Col offset={0} span={23}>
                    <div style={{display:'flex', marginTop:'1rem', marginBottom:'1rem', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
                        <Title style={{ margin:'0'}} level={2}>Staff</Title>
                    </div>
                        <Content
                            style={{
                            // padding: '1em',
                            // margin:'1em',
                            // background:'white' ,
                            width:`100%`,
                            maxWidth:'100%',
                            }}
                        >
                                <StaffView/>
                        </Content>
                    </Col>
                </Row>
    )
}


VenueStaff.PageLayout = VenuesLayout