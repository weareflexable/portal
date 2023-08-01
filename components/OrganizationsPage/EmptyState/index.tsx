import { Button, Typography } from "antd"
import { useRouter } from "next/router"
import {PlusOutlined} from '@ant-design/icons'

const {Text, Title} = Typography

export default function EmptyState(){
    const router = useRouter()
    return(
      <div style={{border: '1px solid #dddddd', display:'flex', justifyContent:'center', height:'30vh', alignItems:'center', marginTop:'2rem', padding: '2rem'}}>
        <div style={{maxWidth:'300px', display:'flex', flexDirection:'column', justifyContent:'center'}}>
          <Title style={{textAlign:'center'}} level={3}>Get Started</Title>
          <Text style={{textAlign:'center'}}>Ready to get started listing your services on the Flexable Marketplace? The first step is to load in your organization’s details</Text>
          <Button size="large" shape="round" type="primary" style={{marginTop:'2rem'}} icon={<PlusOutlined rev={undefined} />} onClick={()=>router.push('/organizations/new')}>Create New Organization</Button>
        </div>
      </div>
    )
  }