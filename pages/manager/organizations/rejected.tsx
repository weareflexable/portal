import { Col, Row, Layout, Typography, Button } from "antd";
import { useRouter } from "next/router";
import ManagerLayout from "../../../components/Manager/Layout/Layout";
import ManagerOrgsLayout from "../../../components/Manager/Organizations/Layout";
import RejectedOrgs from "../../../components/Manager/Organizations/RejectedOrgs/RejectedOrgs";
const {Content} = Layout
const {Title} = Typography

export default function DeActived(){
    const router = useRouter()
    return(
        <ManagerLayout>
            <Row>
                <Col offset={1} span={21}>
                    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <Title style={{marginLeft: '1em', marginTop:'1em'}} level={3}>Organizations</Title>
                        <Button onClick={()=>router.push('/manager/organizations/new')}>Create new organization</Button>
                    </div>
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
                    <RejectedOrgs/>
                </ManagerOrgsLayout>
        </Content>
        </Col>
            </Row>
        </ManagerLayout>
    )
}