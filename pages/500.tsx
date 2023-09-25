import {Button, Typography} from 'antd'
import { useRouter } from 'next/router'

export default function Custom500() {
  const router = useRouter()
    return(
      <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', background: '#fff', width:'100vw', height:'100vh'}}>
      <Typography.Title level={2}>
        500 - Server side error occured
        <Button style={{marginTop:'1rem'}} onClick={()=>router.replace('/')}>Go to Dashboard</Button>
        </Typography.Title>
      </div>
    )
  }