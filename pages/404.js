import {Typography,Button} from 'antd'
import { useRouter } from 'next/router'

export default function Custom404() {
    const router = useRouter()
    return (
    <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', background: '#fff', width:'100vw', height:'100vh'}}>
        <Typography.Title level={2}>404 - Page Not Found</Typography.Title>
        <Button style={{marginTop:'1rem'}} onClick={()=>router.replace('/')}>Go to Dashboard</Button>
    </div> 
    )
  }