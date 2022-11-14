import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import AppLayout from '../../../../../components/shared/Layout/layout'
import { useAuthContext } from '../../../../../context/AuthContext'
import { Col, Row,Card,Statistic,Typography } from 'antd';
import Earnings from '../../../../../components/DashboardPage/Earnings/Earnings';
import StaffStats from '../../../../../components/DashboardPage/StaffStats/StaffStats';
import ServiceStats from '../../../../../components/DashboardPage/ServiceStats/ServiceStats';
const {Title} = Typography
export default function Dashboard(){


    return(
        <AppLayout>
           <Row>
              <Col offset={1} span={21}>
                  <Title style={{marginLeft: '1em', marginTop:'1em'}} level={3}>Dashboard</Title>
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
                      <Row gutter={[16, 16]}> 
                        <Col span={12}>
                            <Earnings/> 
                        </Col>

                          <Col  span={12}>

                          <Row gutter={[16,16]}>
                            <Col span={24}>
                            <StaffStats/>
                            </Col>

                            <Col span={24}>
                              <ServiceStats/>
                            </Col>
                            
                          </Row>
                        </Col>
                        
                      </Row>
                  </Content>
              </Col>
            </Row>
        </AppLayout>
    )
}