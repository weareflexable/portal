import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import { Col, Row,Card,Statistic,Typography } from 'antd';
import AdminLayout from '../../components/Manager/Layout/Layout';
// import Earnings from '../components/AdminDashboard/Earnings/Earnings';
// import StaffStats from '../components/AdminDashboard/StaffStats/StaffStats';
// import ServiceStats from '../components/AdminDashboard/ApprovedOrgsStats/ApprovedOrgsStats';
// import AwaitingOrgsStats from '../components/AdminDashboard/AwaitingOrgsStats/AwaitingOrgs';
// import ApprovedOrgsStats from '../components/AdminDashboard/ApprovedOrgsStats/ApprovedOrgsStats';
const {Title} = Typography
export default function Dashboard(){


    return(
        <AdminLayout>
           <Row>
              <Col offset={1} span={21}>
                  <Title style={{marginLeft: '1em', marginTop:'1em'}} level={3}>Overview</Title>
                  <Content
                      style={{
                        padding: '1em',
                        margin:'1em',
                        background:'white' ,
                        width:`98%`,
                        maxWidth:'100%',
                        // height: '100%',
                        minHeight:'70vh',
                      }}
                    >
                      <Row gutter={[16, 16]}> 
                        <Col span={12}>
                            {/* <Earnings/>  */}
                        </Col>

                          <Col  span={12}>

                          <Row gutter={[16,16]}>
                            <Col span={24}>
                            {/* <StaffStats/> */}
                              <div>Total earnings</div>
                            </Col>

                            <Col span={24}>
                              {/* <AwaitingOrgsStats/> */}
                              <div>Awaiting orgs stats</div>
                            </Col>

                            <Col span={24}>
                              {/* <ApprovedOrgsStats/> */}
                              <div>approved orgs</div>
                            </Col>
                            
                          </Row>
                        </Col>
                        
                      </Row>
                  </Content>
              </Col>
            </Row>
        </AdminLayout>
    )
}
