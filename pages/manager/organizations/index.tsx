import { Content } from 'antd/lib/layout/layout'
import React from 'react'
import { Typography,Col, Row, Button, Tabs } from 'antd'

import { useRouter } from 'next/router'
import ManagerOrgsView from '../../../components/Manager/Organizations/ManagerOrgsView/ManagerOrgsView'
const {Title} = Typography;
import { PlusOutlined } from '@ant-design/icons';
import ManagerLayout from '../../../components/Layout/ManagerLayout'

export default function ManagerOrganizations(){

    
    return(

            <Row>
                <Col offset={1} span={22}>
                    
                    <Content
                        style={{
                        // padding: '1em',
                        // margin:'1em',
                        // background:'white' ,
                        width:`100%`,
                        maxWidth:'100%',
                        }}
                    > 
                            <ManagerOrgsView/>

                    </Content>
                </Col>
            </Row>


    )
}

ManagerOrganizations.PageLayout = ManagerLayout