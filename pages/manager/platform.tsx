import { Button, Col, Row, Layout, Typography } from "antd";
const {Title} = Typography
const {Content} = Layout
import ManagerLayout from "../../components/Manager/Layout/Layout";
import PlatformView from "../../components/Manager/Platform";

export default function Platform(){
    return(
        <ManagerLayout>
            <Row>
                <Col offset={1} span={22}>
                    <Title style={{marginLeft: '1em', marginTop:'1em'}} level={2}>Platform</Title>
                    <Content
                        style={{
                        margin:'1em', 
                        width:`98%`,
                        maxWidth:'100%',
                        }}
                    >
                        <PlatformView/>
                    </Content>
                </Col>
            </Row>
        </ManagerLayout>
    )
}