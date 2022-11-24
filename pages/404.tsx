import {Typography,Button} from 'antd'
import { useRouter } from 'next/router'

export default function Custom404() {
    const router = useRouter()
    return (<div>
        <Typography.Title level={2}>404 - Page Not Found</Typography.Title>
        <Button onClick={()=>router.back()}>Go back</Button>
    </div> 
    )
  }